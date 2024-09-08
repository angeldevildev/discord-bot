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
            // Unban the user
            await interaction.guild.members.unban(userId, reason);

            // Attempt to send a DM to the user
            const user = await interaction.client.users.fetch(userId);
            const dmEmbed = new EmbedBuilder()
                .setColor("Green")
                .setTitle('You have been unbanned')
                .setDescription(`You have been unbanned from **${interaction.guild.name}**.`)
                .addFields(
                    { name: 'Reason', value: reason },
                    { name: 'Moderator', value: `${interaction.user.tag}` }
                )
                .setTimestamp();

            await user.send({ embeds: [dmEmbed] }).catch(err => {
                console.log("This user has disabled DMs.");
            });

            // Confirmation message in the server
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
            const embed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('Error')
                .setDescription('I was unable to unban the user. I may not have enough permissions or the user ID is incorrect.')
                .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    },
};
