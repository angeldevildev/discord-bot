const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rules')
        .setDescription('Display server rules'),
    async execute(interaction) {
        const ownerRoleId = '1281197591391899668';

        if (!interaction.member.roles.cache.has(ownerRoleId)) {
            return interaction.reply({ content: 'You do not have permission to execute this command.', ephemeral: true });
        }

        const rulesEmbed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle("Server's rules")
            .setDescription('Here are the rules to follow to keep the server safe and friendly!')
            .addFields(
                { name: '**Chat Rules**', value: 
                    `1. Treat everyone with respect\n` +
                    `2. Listen to the Moderators\n` +
                    `3. No inappropriate messages\n` +
                    `4. Keep conversations in English\n` +
                    `5. No advertising\n` +
                    `6. Don't spam\n` +
                    `7. No Doxxing`
                },
                { name: '**Voice Rules**', value: 
                    `1. Don't spam in your mic\n` +
                    `2. Use Krisp noise suppression when available\n` +
                    `3. Don't keep rejoining for no reason`
                },
                { name: '**Server Rules**', value: 
                    `1. Follow Discord TOS\n` +
                    `2. Don't bypass rules\n` +
                    `3. Have Fun!`
                }
            )
            .setFooter({ text: 'Thanks for following the rules!' });

        await interaction.reply({ embeds: [rulesEmbed] });
    },
};
