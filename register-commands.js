require('dotenv').config();
const { REST, Routes, Application, ApplicationCommand, ApplicationCommandOptionType } = require('discord.js');

const commands = [
    {
        name: 'ping',
        description: 'Replies with Pong!'
    },
    {
        name: 'play',
        description: 'Plays a song from YouTube',
        options: [
            {
                name: 'song',
                type: ApplicationCommandOptionType.String,
                description: 'The song you want to play',
                required: true
            }
        ],
        member: {
            voice: {
                channel: {
                    required: true,
                    type: ApplicationCommandOptionType.Channel
                }
            }
        }
    },
    {
        name: 'skip',
        description: 'Skips the current song',
    }
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands },
        );
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error('There was an error while registering the commands:', error);
    }
})();