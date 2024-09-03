const { SlashCommandBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Testing 2'),
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};