const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

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
                .setDescription('Reason for the ban')
                .setRequired(false)),
    async execute(interaction) {
        if (!interaction.member.permissions.has('BAN_MEMBERS')) {
            return interaction.reply({ content: 'You have no permissions to ban this member.', ephemeral: true });
        }

        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        const member = await interaction.guild.members.fetch(user.id).catch(console.error);

        if (!member) {
            return interaction.reply({ content: "This member doesn't exist in this server.", ephemeral: true });
        }

        const botMember = interaction.guild.members.me; 

        if (member.roles.highest.position >= botMember.roles.highest.position) {
            return interaction.reply({ content: 'I cannot ban this user because they have a higher or equal role than me.', ephemeral: true });
        }

        try {
            const dmEmbed = new EmbedBuilder()
                .setColor("Red")
                .setTitle('You have been banned')
                .setDescription(`You have been banned from **${interaction.guild.name}**.`)
                .addFields(
                    { name: 'Reason', value: reason },
                    { name: 'Moderator', value: `${interaction.user.tag}` }
                )
                .setTimestamp();

            await user.send({ embeds: [dmEmbed] }).catch(err => {
                console.log("This user has disabled DMs or an error occurred.");
            });

            await member.ban({ reason });

            const embed = new EmbedBuilder()
                .setColor("Red")
                .setTitle('User Banned')
                .setDescription(`**${user.tag}** has been banned from the server.`)
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
                .setDescription('I was unable to ban the user. I may not have enough permissions or the user has a higher role.')
                .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    },
};
