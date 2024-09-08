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

        if (member.roles.highest.position >= interaction.guild.members.me.roles.highest.position) {
            return interaction.reply({ content: "I cannot timeout this user due to role hierarchy.", ephemeral: true });
        }

        try {
            await member.timeout(null, reason);

            const dmEmbed = new EmbedBuilder()
                .setColor("DarkBlue")
                .setTitle('Timeout Removed')
                .setDescription(`Your timeout has been removed in **${interaction.guild.name}**.`)
                .addFields(
                    { name: 'Reason', value: reason },
                    { name: 'Moderator', value: `${interaction.user.tag}` }
                )
                .setTimestamp();

            await user.send({ embeds: [dmEmbed] }).catch(err => {
                console.log("This user has disabled DMs.");
            });

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
            const embed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('Error')
                .setDescription('I was unable to untimeout the user. I may not have enough permissions or the user has a higher role.')
                .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    },
};
