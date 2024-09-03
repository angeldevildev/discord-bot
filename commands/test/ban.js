const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a server user')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('User to ban')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                .setDescription('Reason of the ban')
                .setRequired(false)),
    async execute(interaction) {
        if (!interaction.member.permissions.has('BAN_MEMBERS')) {
            return interaction.reply({ content: 'You have no permissions to ban this member', ephemeral: true });
        }

        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        const member = await interaction.guild.members.fetch(user.id).catch(console.error);

        if (!member) {
            return interaction.reply({ content: "This member doensn't exist in this server", ephemeral: true });
        }

        try {
            await member.ban({ reason });
            interaction.reply({ content: `${user.tag} has been banned. Reason: ${reason}` });
        } catch (error) {
            console.error(error);
            interaction.reply({ content: 'I was unable to ban the user. I may not have enough permissions or the user has a higher role.', ephemeral: true });
        }
    },
};
