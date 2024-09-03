const { SlashCommandBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription('Testing2'),
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};