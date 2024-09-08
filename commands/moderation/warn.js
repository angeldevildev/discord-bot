const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Warn a user')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user to warn')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                .setDescription('The reason for the warning')
                .setRequired(true)),
    async execute(interaction) {
        if (!interaction.member.permissions.has('MODERATE_MEMBERS')) {
            return interaction.reply({ content: 'You do not have permission to warn members.', ephemeral: true });
        }

        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason');

        const member = await interaction.guild.members.fetch(user.id).catch(console.error);

        if (!member) {
            return interaction.reply({ content: "The user doesn't exist in this server.", ephemeral: true });
        }

        try {
            const dmEmbed = new EmbedBuilder()
                .setColor("Yellow")
                .setTitle('You have been warned')
                .setDescription(`You have been warned in **${interaction.guild.name}**.`)
                .addFields(
                    { name: 'Reason', value: reason },
                    { name: 'Moderator', value: `${interaction.user.tag}` }
                )
                .setTimestamp();

            await user.send({ embeds: [dmEmbed] }).catch(err => {
                console.log("This user has disabled DMs.");
            });

            const embed = new EmbedBuilder()
                .setColor("Yellow")
                .setTitle('User Warned')
                .setDescription(`**${user.tag}** has been warned.`)
                .addFields(
                    { name: 'User', value: `${user.tag}`, inline: true },
                    { name: 'Moderator', value: `${interaction.user.tag}`, inline: true },
                    { name: 'Reason', value: reason }
                )
                .setTimestamp();

            await interaction.reply({ embeds: [embed], fetchReply: true });

        } catch (error) {
            console.error(error);
            const embed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('Error')
                .setDescription('I was unable to warn the user. I may not have enough permissions or the user has a higher role.')
                .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    },
};
