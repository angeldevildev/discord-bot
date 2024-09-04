const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removemessages')
        .setDescription('Remove a specified number of messages from the chat or from a specific user')
        .addIntegerOption(option =>
            option.setName('count')
                .setDescription('Number of messages to delete')
                .setRequired(true))
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user whose messages will be deleted')
                .setRequired(false)),
    async execute(interaction) {
        if (!interaction.member.permissions.has('MANAGE_MESSAGES')) {
            return interaction.reply({ content: 'You do not have permission to manage messages.', ephemeral: true });
        }

        const count = interaction.options.getInteger('count');
        const user = interaction.options.getUser('user');

        if (count < 1 || count > 100) {
            return interaction.reply({ content: 'Please enter a number between 1 and 100.', ephemeral: true });
        }

        try {
            let messages;

            if (user) {
                messages = (await interaction.channel.messages.fetch({ limit: 100 }))
                    .filter(msg => msg.author.id === user.id)
                    .first(count);
            } else {
                messages = await interaction.channel.messages.fetch({ limit: count });
            }

            await interaction.channel.bulkDelete(messages, true);

            const embed = new EmbedBuilder()
                .setTitle('Messages Deleted')
                .setColor('Red')
                .setDescription(user 
                    ? `Successfully deleted **${messages.size}** messages from **${user.tag}**.` 
                    : `Successfully deleted **${messages.size}** messages from this channel.`)
                .setFooter({ text: `Deleted by ${interaction.user.tag}` })
                .setTimestamp();

            const message = interaction.reply({ embeds: [embed], ephemeral: true });

            setTimeout(() => {
                message.delete().catch(console.error);
            }, 30000);
            
        } catch (error) {
            console.error(error);
            const embed = new EmbedBuilder()
            .setColor(0xFF0000)  
            .setTitle('Error')
            .setDescription('An error occurred while trying to delete messages. Ensure messages are not older than 14 days..')
            .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    },
};
