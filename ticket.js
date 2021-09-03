const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { categoryId, guildId, supportRole, logsChannel } = require('./config.json');

module.exports.closeTicket = async (interaction, tickets, db, client) => {
    let channelId = interaction.customId.split("-")[1];

    let guild = client.guilds.cache.get(guildId);
    let channel = guild.channels.cache.get(channelId);

    await channel.delete(`Ticket closed by ${interaction.user.username} (ID: ${interaction.user.id})`);

    const logs = client.channels.cache.get(logsChannel);
    const logEmbed = new MessageEmbed()
        .setTitle("Ticket closed")
        .setColor(tickets.color)
        .setTimestamp()
        .setDescription(`Name: ${tickets.title}\nUser: <@${interaction.user.id}>\nTicket category ID: ${tickets.id}`);

    await logs.send({ embeds: [logEmbed], content: "Ticket closed succesfully." });
}

module.exports.createTicket = async (interaction, tickets, client) => {
    if ((new Date() - new Date(client.cooldowns.get(interaction.user.id)) < 15 * 60 * 1000))
        return interaction.reply({ content: "You have already created a ticket in the last 15 minutes, please wait a while!", ephemeral: true });
    else
        client.cooldowns.set(interaction.user.id, new Date());

    let guild = client.guilds.cache.get(guildId);
    let category = guild.channels.cache.get(categoryId);

    let channel = await guild.channels.create(
        "ticket-" + interaction.user.username,
        {
            parent: category,
            topic: tickets.title,
            reason: `Ticket requested by <@${interaction.user.id}>.`,
            permissionOverwrites: [
                {
                    id: guild.roles.everyone,
                    deny: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                },
                {
                    id: client.user,
                    allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY']
                },
                {
                    id: interaction.user,
                    allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY']
                },
                {
                    id: supportRole,
                    allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY']
                }
            ]
        }
    );

    const embed = new MessageEmbed()
        .setDescription(`Hi there <@${interaction.user.id}>!\nPlease wait for support staff to assist you`)
        .setColor(tickets.color);

    const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId("close-" + channel.id + "-" + tickets.id)
                .setLabel("🔒 Close ticket")
                .setStyle('PRIMARY'),
        );

    await channel.send({
        content: `<@${interaction.user.id}> <@&${supportRole}>`,
        embeds: [embed],
        components: [row]
    })

    await interaction.reply({ content: `Ticket created in <#${channel.id}>!`, ephemeral: true });

    const logs = client.channels.cache.get(logsChannel);
    const logEmbed = new MessageEmbed()
        .setTitle("Ticket created")
        .setColor(tickets.color)
        .setTimestamp()
        .setDescription(`Name: ${tickets.title}\nUser: <@${interaction.user.id}>\nTicket category ID: ${tickets.id}`);

    await logs.send({ embeds: [logEmbed], content: "Ticket created succesfully." });
}