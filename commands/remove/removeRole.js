const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removerole')
        .setDescription('Remove a role from a user')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user from whom the role will be removed')
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('The role to remove')
                .setRequired(true)),
    async execute(interaction) {
        if (!interaction.member.permissions.has('MANAGE_ROLES')) {
            return interaction.reply({ content: 'You do not have permission to manage roles.', ephemeral: true });
        }

        const user = interaction.options.getUser('user');
        const role = interaction.options.getRole('role');

        const member = await interaction.guild.members.fetch(user.id).catch(console.error);

        if (!member) {
            return interaction.reply({ content: "The user doesn't exist in this server.", ephemeral: true });
        }

        if (!member.roles.cache.has(role.id)) {
            return interaction.reply({ content: `${user.tag} does not have the ${role.name} role.`, ephemeral: true });
        }

        try {
            await member.roles.remove(role);

            const embed = new EmbedBuilder()
                .setTitle('Role Removed')
                .setColor('Red')
                .addFields(
                    { name: 'User', value: `${user.tag}`, inline: true },
                    { name: 'Role Removed', value: `${role.name}`, inline: true },
                    { name: 'Removed by', value: `${interaction.user.tag}`, inline: true }
                )
                .setTimestamp();

            const message = interaction.reply({ embeds: [embed] });

            setTimeout(() => {
                message.delete().catch(console.error);
            }, 30000);
            
        } catch (error) {
            console.error(error);
            const embed = new EmbedBuilder()
            .setColor(0xFF0000)  
            .setTitle('Error')
            .setDescription('I was unable to remove the role. I may not have enough permissions or the role is higher than my role')
            .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    },
};
