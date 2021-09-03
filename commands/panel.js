const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { adminIds } = require('../config.json');
const { id } = require('../utils.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('panel')
        .setDescription('Creates a ticket panel on the specified channel')
        .addChannelOption(option => option.setName('channel').setDescription('The channel where to create a panel').setRequired(true))
        .addStringOption(option => option.setName('title').setDescription('The panel title').setRequired(true))
        .addStringOption(option => option.setName('description').setDescription('The panel description').setRequired(true))
        .addStringOption(option => option.setName('color').setDescription('The panel color in hex format').setRequired(true))
        .addStringOption(option => option.setName('emoji').setDescription('The panel button emoji').setRequired(true)),
    async execute(interaction, db) {
        if (!adminIds.includes(interaction.user.id)) await interaction.reply({ content: "You don't have permissions to use this command!", ephemeral: true });;

        const channel = interaction.options.getChannel('channel');
        const categoryId = id(5);

        const embed = new MessageEmbed()
            .setColor(interaction.options.getString('color'))
            .setTitle(interaction.options.getString('title'))
            .setDescription(interaction.options.getString('description'));
        
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId(categoryId)
                    .setLabel(interaction.options.getString('emoji') + " " + interaction.options.getString('title'))
                    .setStyle('PRIMARY'),
            );
        
        await db.get("tickets").insert({
            id: categoryId,
            title: interaction.options.getString('title'),
            description: interaction.options.getString('description'),
            color: interaction.options.getString('color'),
        });
        
        await channel.send({
            embeds: [embed],
            components: [row]
        });
        
        await interaction.reply({ content: "Done!", ephemeral: true });
    },
};