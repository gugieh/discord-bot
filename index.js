const { Client, IntentsBitField } = require('discord.js')
const { token } = require('./config.json');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]
});

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

client.login(token)