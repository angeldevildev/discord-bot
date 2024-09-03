const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Applies a timeout to a user.')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user to be put in timeout')
                .setRequired(true))
        .addIntegerOption(option => 
            option.setName('time')
                .setDescription('Timeout duration in minutes')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                .setDescription('The reason of the timeout')
                .setRequired(false)),
    async execute(interaction) {
        if (!interaction.member.permissions.has('MODERATE_MEMBERS')) {
            return interaction.reply({ content: 'You are not allowed to put members in timeout.', ephemeral: true });
        }

        const user = interaction.options.getUser('user');
        const duration = interaction.options.getInteger('time');
        const reason = interaction.options.getString('reason') || 'No reason given';

        const member = await interaction.guild.members.fetch(user.id).catch(console.error);

        if (!member) {
            return interaction.reply({ content: "The user doesn't exist in this server", ephemeral: true });
        }

        const timeoutDuration = duration * 60 * 1000; 

        try {
            await member.timeout(timeoutDuration, reason);

            const embed = new EmbedBuilder()
                .setColor("DarkRed")
                .setTitle('Timeout Applied')
                .setDescription(`**${user.tag}** has been put in timeout.`)
                .addFields(
                    { name: 'User', value: `${user.tag}`, inline: true },
                    { name: 'Moderator', value: `${interaction.user.tag}`, inline: true },
                    { name: 'Duration', value: `${duration} minutes`, inline: true },
                    { name: 'Reason', value: reason }
                )
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            interaction.reply({ content: 'I was unable to timeout the user. I may not have enough permissions or the user has a higher role.', ephemeral: true });
        }
    },
};
