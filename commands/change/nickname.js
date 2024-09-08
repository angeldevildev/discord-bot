const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nickname')
        .setDescription('Change a user nickname in the server.')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('nickname')
                .setDescription('The new nickname')
                .setRequired(true)),
    
    async execute(interaction) {
        if (!interaction.member.permissions.has(['MANAGE_NICKNAMES', 'CHANGE_NICKNAME'])) {
            return interaction.reply({ content: 'You do not have permission to manage or change nicknames.', ephemeral: true });
        }

        const user = interaction.options.getUser('user');
        const nickname = interaction.options.getString('nickname');
        
        const member = interaction.guild.members.cache.get(user.id);

        if (!member) {
            return interaction.reply({ content: 'That user does not exist in this server.', ephemeral: true });
        }

        try {
            await member.setNickname(nickname);

            const embed = new EmbedBuilder()
                .setColor(0x00AE86)  
                .setTitle('Nickname Changed')
                .setDescription(`Successfully changed the nickname for **${user.tag}**.`)
                .addFields(
                    { name: 'New Nickname', value: nickname, inline: true }
                )
                .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (error) {
            console.error(error);

            const embed = new EmbedBuilder()
                .setColor(0xFF0000)  
                .setTitle('Error')
                .setDescription('An error occurred while trying to change the nickname.')
                .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
};
