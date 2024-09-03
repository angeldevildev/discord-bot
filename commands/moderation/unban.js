const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Remove the ban from a user')
        .addStringOption(option => 
            option.setName('userid')
                .setDescription("User's ID")
                .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                .setDescription('The reason for the unban')
                .setRequired(false)),
    async execute(interaction) {
        if (!interaction.member.permissions.has('BAN_MEMBERS')) {
            return interaction.reply({ content: 'You are not allowed to remove bans.', ephemeral: true });
        }

        const userId = interaction.options.getString('userid');
        const reason = interaction.options.getString('reason') || 'No reason given.';

        try {
            await interaction.guild.members.unban(userId, reason);

            const embed = new EmbedBuilder()
                .setColor("Green")
                .setTitle('User Unbanned')
                .setDescription(`**User ID:** ${userId}\n**Reason:** ${reason}`)
                .addFields(
                    { name: 'Moderator', value: `${interaction.user.tag}`, inline: true }
                )
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            interaction.reply({ content: 'I was unable to unban the user. Please check that the ID is correct and that the user is indeed banned.', ephemeral: true });
        }
    },
};
