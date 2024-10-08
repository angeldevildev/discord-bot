const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('givevip')
        .setDescription('Give the VIP role to a user')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user to receive the VIP role')
                .setRequired(true)),
    async execute(interaction) {
        if (!interaction.member.permissions.has('MANAGE_ROLES')) {
            return interaction.reply({ content: 'You do not have permission to assign roles.', ephemeral: true });
        }

        const user = interaction.options.getUser('user');
        const member = await interaction.guild.members.fetch(user.id).catch(console.error);

        if (!member) {
            return interaction.reply({ content: "The user doesn't exist in this server.", ephemeral: true });
        }

        const vipRole = interaction.guild.roles.cache.find(role => role.name === 'VIP');
        
        if (!vipRole) {
            return interaction.reply({ content: 'VIP role not found in this server.', ephemeral: true });
        }

        try {
            await member.roles.add(vipRole);

            const embed = new EmbedBuilder()
                .setColor("Gold")
                .setTitle('VIP Role Assigned')
                .setDescription(`**${user.tag}** has been given the VIP role.`)
                .addFields(
                    { name: 'User', value: `${user.tag}`, inline: true },
                    { name: 'Moderator', value: `${interaction.user.tag}`, inline: true }
                )
                .setTimestamp();

            const message = await interaction.reply({ embeds: [embed] });

            setTimeout(() => {
                message.delete().catch(console.error);
            }, 30000);

        } catch (error) {
            console.error(error);
            const embed = new EmbedBuilder()
            .setColor(0xFF0000)  
            .setTitle('Error')
            .setDescription('I was unable to assign the VIP role. I may not have enough permissions or the role is higher than my role.')
            .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    },
};
