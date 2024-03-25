require('dotenv').config()
const { Client, IntentsBitField } = require('discord.js')
const { joinVoiceChannel } = require('@discordjs/voice');
const { useQueue, useMainPlayer } = require('discord-player');
const { Player } = require('discord-player');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildVoiceStates
    ]
});

const player = new Player(client);
player.extractors.loadDefault()

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`)
})

client.on('messageCreate', (message) => {
    console.log(message.content)
    if (message.author.bot) {
        return;
    }
    if (message.content === 'ping') {
        message.reply('pong')
    }
})

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) {
        return;
    }

    const { commandName } = interaction;

    if (commandName === 'ping') {
        await interaction.reply('Pong!');
    }
    if (commandName === 'play') {

        const player = useMainPlayer();

        const channel = interaction.member.voice.channel;
        if (!channel) return interaction.reply('Nie ma cie na kanale!');
        const query = interaction.options.getString('song', true);

        await interaction.deferReply();

        try {
            const { track } = await player.play(channel, query, {
                nodeOptions: {
                    metadata: interaction
                }
            });

            return interaction.followUp(`Śpiewać muszę bo się udusze: **${track.title}**   ${query}`);
        } catch (e) {
            return interaction.followUp(`Coś się zepsuło: ${e}`);
        }

    }
    if (commandName === 'skip') {
        const channel = interaction.member.voice.channel;
        if (!channel) return interaction.reply('Nie ma cie na kanale!');

        const queue = useQueue(interaction.guildId);

        if (!queue?.isPlaying()) {
            const embed = EmbedGenerator.Error({
                title: 'Not playing',
                description: 'I am not playing anything right now',
            }).withAuthor(interaction.user);

            return interaction.editReply({ embeds: [embed] });
        }

        queue.node.skip();
        return interaction.reply(`Skipuje ten shiton!`);

    }
})

client.login(process.env.TOKEN)