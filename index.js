const { Client, Collection, Intents } = require('discord.js');
const monk = require("monk");
const fs = require('fs');

const { createTicket, closeTicket } = require('./ticket.js');
const { token, mongo } = require('./config.json');

const db = monk(mongo);

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.commands = new Collection();
client.cooldowns = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

client.once('ready', () => {
    console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
    if (interaction.isCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        try {
            await command.execute(interaction, db);
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
        }
    } else if (interaction.isButton()) {
        if (interaction.customId.includes("close")) {
            let ticketData = await db.get("tickets").findOne({ id: interaction.customId.split("-")[2] });
            if (ticketData) return closeTicket(interaction, ticketData, db, client);
        } else {
            let buttonData = await db.get("tickets").findOne({ id: interaction.customId });
            if (buttonData) return createTicket(interaction, buttonData, client);
        }
    }
});

client.login(token);