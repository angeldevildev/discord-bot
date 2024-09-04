const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('giveaway')
        .setDescription('Start a giveaway')
        .addIntegerOption(option => 
            option.setName('duration')
                .setDescription('Duration of the giveaway in minutes')
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('The role to give to the winner')
                .setRequired(true)),
    async execute(interaction) {
        const duration = interaction.options.getInteger('duration');
        const role = interaction.options.getRole('role');

        if (!interaction.member.permissions.has('MANAGE_ROLES')) {
            return interaction.reply({ content: 'You do not have permission to manage roles.', ephemeral: true });
        }

        const joinButton = new ButtonBuilder()
            .setCustomId('join_giveaway')
            .setLabel('Join Giveaway!')
            .setStyle(ButtonStyle.Success);

        const actionRow = new ActionRowBuilder().addComponents(joinButton);

        let participants = [];

        let embed = new EmbedBuilder()
            .setTitle('🎉 Giveaway!')
            .setDescription(`Join the giveaway to win the **${role.name}** role!\nYou have **${duration} minutes** to join.\n\n**Participants:**\nNone yet.`)
            .setColor('Aqua')
            .setTimestamp();

        const message = await interaction.reply({ embeds: [embed], components: [actionRow], fetchReply: true });

        const filter = i => i.customId === 'join_giveaway' && !i.user.bot;
        const collector = message.createMessageComponentCollector({ filter, time: duration * 60 * 1000 });

        collector.on('collect', async i => {
            if (!participants.includes(i.user.id)) {
                participants.push(i.user.id);

                embed.setDescription(`Join the giveaway to win the **${role.name}** role!\nYou have **${duration} minutes** to join.\n\n**Participants:**\n${participants.map(id => `<@${id}>`).join('\n')}`);
                
                await message.edit({ embeds: [embed] });
                await i.reply({ content: 'You have joined the giveaway!', ephemeral: true });
            } else {
                await i.reply({ content: 'You have already joined the giveaway!', ephemeral: true });
            }
        });

        collector.on('end', async () => {
            if (participants.length === 0) {
                return interaction.followUp({ content: 'No one joined the giveaway, so there is no winner!', ephemeral: true });
            }

            const winnerId = participants[Math.floor(Math.random() * participants.length)];
            const winner = await interaction.guild.members.fetch(winnerId);

            try {
                await winner.roles.add(role);
                
                const winnerEmbed = new EmbedBuilder()
                    .setTitle('🎉 We have a winner!')
                    .setDescription(`Congratulations to **${winner.user.tag}** who has won the **${role.name}** role!`)
                    .setColor('Gold')
                    .setTimestamp();

                await interaction.followUp({ embeds: [winnerEmbed] });

            } catch (error) {
                console.error(error);
                const embed = new EmbedBuilder()
                .setColor(0xFF0000)  
                .setTitle('Error')
                .setDescription('There was an error while changing the role. Check my permissions and try again')
                .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });
            }
        });
    },
};
