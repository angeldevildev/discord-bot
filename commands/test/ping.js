const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Show the bot latency in ms'),
    async execute(interaction) {
        const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
        const latency = sent.createdTimestamp - interaction.createdTimestamp;
        let apiLatency = Math.round(interaction.client.ws.ping);

        if (apiLatency === -1) {
            apiLatency = 'Unavailable'; 
        } else {
            apiLatency = `${apiLatency}ms`;
        }

        const embed = new EmbedBuilder()
            .setColor(0x3498db) 
            .setTitle('🏓 Pong!')
            .addFields(
                { name: 'Latency', value: `${latency}ms`, inline: true },
                { name: 'API Latency', value: apiLatency, inline: true }
            )
            .setTimestamp() 
            .setFooter({ text: 'Ping command', iconURL: interaction.client.user.displayAvatarURL() });

        interaction.editReply({ content: null, embeds: [embed] });
    },
};
