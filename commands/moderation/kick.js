const { SlashCommandBuilder } = require('discord.js');

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
                .setDescription('The reason of the kick')
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
            interaction.reply({ content: `${user.tag} has been kicked. Reason: ${reason}` });
        } catch (error) {
            console.error(error);
            interaction.reply({ content: 'I was unable to eject the user. I may not have enough permissions or the user has a higher role.', ephemeral: true });
        }
    },
};
