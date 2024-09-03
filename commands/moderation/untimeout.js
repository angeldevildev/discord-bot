const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('untimeout')
        .setDescription('Remove the timeout from a user')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user to be removed from the timeout')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                .setDescription('The reason for removing the timeout')
                .setRequired(false)),
    async execute(interaction) {
        if (!interaction.member.permissions.has('MODERATE_MEMBERS')) {
            return interaction.reply({ content: 'You are not allowed to remove timeouts from members.', ephemeral: true });
        }

        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'No reason given.';

        const member = await interaction.guild.members.fetch(user.id).catch(console.error);

        if (!member) {
            return interaction.reply({ content: "The user doesn't exist in this server.", ephemeral: true });
        }

        try {
            await member.timeout(null, reason);  

            const embed = new EmbedBuilder()
                .setColor("DarkBlue")
                .setTitle('Timeout Removed')
                .setDescription(`**${user.tag}** has been untimeouted.`)
                .addFields(
                    { name: 'User', value: `${user.tag}`, inline: true },
                    { name: 'Moderator', value: `${interaction.user.tag}`, inline: true },
                    { name: 'Reason', value: reason }
                )
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            interaction.reply({ content: 'I could not remove the user timeout. I may not have enough permissions or the user has a higher role.', ephemeral: true });
        }
    },
};
