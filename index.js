const { Discord, Client, Collection, GatewayIntentBits, Partials } = require("discord.js");

const walkSync = require('./walkSync.js');

const path = require('path')

const client = new Client({
    shards: 'auto',
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildBans, 
        GatewayIntentBits.GuildVoiceStates, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.DirectMessages, 
        GatewayIntentBits.GuildMembers, 
        GatewayIntentBits.GuildEmojisAndStickers, 
        GatewayIntentBits.GuildInvites, 
        GatewayIntentBits.GuildMessageReactions
    ],
    partials: [
        Partials.Message, 
        Partials.Channel, 
        Partials.Reaction
    ]
});

module.exports = client;

// Global Variables
client.config = require("./config.json");
client.emotes = require('./config/emotes')

//Admins
client.ADMINS = [
    {"lastKnownTag": "confusion#8059", "ID": "790618859173969952"}
]

//Files
client.prerequisiteFiles = walkSync(path.join(__dirname, '/prerequisites'))
client.slashCommandFiles = walkSync(path.join(__dirname, '/SlashCommands'))

// Initializing the project
require("./handler")(client);

//MongoDB
const mongo = require('././handler/mongoose')

mongo().then(connection => {
    console.log('MongoDB Connection Established!')
})

client.login(client.config.token);
