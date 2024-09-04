const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment } = require('discord.js');

// Array di link delle immagini
const imageLinks = [
    'https://static.timesofisrael.com/www/uploads/2016/09/pepenazi.jpg',
    'https://storage.googleapis.com/pod_public/750/175426.jpg',
    'https://i.etsystatic.com/27103892/r/il/91c4ee/3009210963/il_fullxfull.3009210963_dyhn.jpg',
    'https://ilsaronno.it/images/images/2023/07/rm-0907.jpg',
    'https://static.news.bitcoin.com/wp-content/uploads/2023/04/pepes.jpg',
    'https://ih1.redbubble.net/image.1027549484.5704/bg,f8f8f8-flat,750x,075,f-pad,750x1000,f8f8f8.jpg',
    'https://pyxis.nymag.com/v1/imgs/bc9/5bb/95f88f06973066c75f07b98ed8af7f634a-18-pepe-the-frog.rsocial.w1200.jpg',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2SBwmZpenT1e16fj-QVf4SiHdfENUEY1s5w&s',
    'https://i.pinimg.com/236x/7c/3a/70/7c3a701c1f86936a70a450f68c3e75c4.jpg',
    'https://the-decoder.com/wp-content/uploads/2023/11/pepe_frog_meme_dall_e.png',
    'https://i.seadn.io/gae/BY5fxKF82o6Uwg8ZjpBDfvvEIvEKJCY-YWydkKCE4SqakluW88qxPRkas9IzLZoCmWE1YS8iwcmQAd-NZLBnGMqifOCBNYDjHvqHjw8?auto=format&dpr=1&w=1000'
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('peperino')
        .setDescription('Send a random peperino meme'),
    async execute(interaction) {
        const randomImage = imageLinks[Math.floor(Math.random() * imageLinks.length)];
        await interaction.reply(randomImage);
    },
};
