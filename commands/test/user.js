const { SlashCommandBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Test'),
	async execute(interaction) {
		await interaction.reply('Test 3');
	},
};