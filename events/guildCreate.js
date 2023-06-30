const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Client } = require('discord.js')
const client = require("../index");
const { glob } = require("glob");
const { promisify } = require("util");
const globPromise = promisify(glob);

client.on("guildCreate", async (guild) => {

    //Slash Commands
    const slashCommands = await globPromise(`${process.cwd()}/SlashCommands/*/*.js`);
    const arrayOfSlashCommands = [];

    slashCommands.map((value) => {
        const file = require(value)
        if (!file?.name) return;

        client.slashCommands.set(file.name, file)
        
        if (["MESSAGE", "USER"].includes(file.type)) delete file.description;
        console.log('Slash Command Loaded ' + file.name)
        arrayOfSlashCommands.push(file)
    });

    await guild.commands.set(arrayOfSlashCommands)
});
