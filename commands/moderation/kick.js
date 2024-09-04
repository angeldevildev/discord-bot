const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick a user from the server')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User to kick')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                .setDescription('The reason for the kick')
                .setRequired(false)),
    async execute(interaction) {
        if (!interaction.member.permissions.has('KICK_MEMBERS')) {
            return interaction.reply({ content: 'You are not allowed to kick members.', ephemeral: true });
        }

        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'No reason given';

        const member = await interaction.guild.members.fetch(user.id).catch(console.error);

        if (!member) {
            return interaction.reply({ content: "The user doesn't exist in this server", ephemeral: true });
        }

        try {
            await member.kick(reason);

            const embed = new EmbedBuilder()
                .setColor("Red")
                .setTitle('User Kicked')
                .setDescription(`**${user.tag}** has been kicked from the server.`)
                .addFields(
                    { name: 'User', value: `${user.tag}`, inline: true },
                    { name: 'Moderator', value: `${interaction.user.tag}`, inline: true },
                    { name: 'Reason', value: reason }
                )
                .setTimestamp();

            const message = await interaction.reply({ embeds: [embed] });

            setTimeout(() => {
                message.delete().catch(console.error);
            }, 30000);

        } catch (error) {
            console.error(error);
            console.error(error);
            const embed = new EmbedBuilder()
            .setColor(0xFF0000)  
            .setTitle('Error')
            .setDescription('I was unable to kick the user. I may not have enough permissions or the user has a higher role.')
            .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    },
};
