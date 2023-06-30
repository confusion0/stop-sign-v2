const { glob } = require("glob");
const { promisify } = require("util");
const globPromise = promisify(glob);
const { Discord, Client, Collection } = require("discord.js");
const walkSync = require('../walkSync.js');
const path = require('path')
const mongoose = require('mongoose');
const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = async (client) => {

    //Giveaways Manager
    const giveawaySchema = new mongoose.Schema({
        messageId: String,
        channelId: String,
        guildId: String,
        startAt: Number,
        endAt: Number,
        ended: Boolean,
        winnerCount: Number,
        prize: String,
        messages: {
            giveaway: String,
            giveawayEnded: String,
            inviteToParticipate: String,
            drawing: String,
            dropMessage: String,
            winMessage: mongoose.Mixed,
            embedFooter: mongoose.Mixed,
            noWinner: String,
            winners: String,
            endedAt: String,
            hostedBy: String
        },
        thumbnail: String,
        hostedBy: String,
        winnerIds: { type: [String], default: undefined },
        reaction: mongoose.Mixed,
        botsCanWin: Boolean,
        embedColor: mongoose.Mixed,
        embedColorEnd: mongoose.Mixed,
        exemptPermissions: { type: [], default: undefined },
        exemptMembers: String,
        bonusEntries: String,
        extraData: mongoose.Mixed,
        lastChance: {
            enabled: Boolean,
            content: String,
            threshold: Number,
            embedColor: mongoose.Mixed
        },
        pauseOptions: {
            isPaused: Boolean,
            content: String,
            unPauseAfter: Number,
            embedColor: mongoose.Mixed,
            durationAfterPause: Number
        },
        isDrop: Boolean,
        allowedMentions: {
            parse: { type: [String], default: undefined },
            users: { type: [String], default: undefined },
            roles: { type: [String], default: undefined }
        }
    }, { id: false });
    
    const giveawayModel = mongoose.model('giveawayData', giveawaySchema);
    
    const { GiveawaysManager } = require('discord-giveaways');
    const GiveawayManagerWithOwnDatabaseAndWithShardSupport = class extends GiveawaysManager {
        // This function is called when the manager needs to get all giveaways which are stored in the database.
        async getAllGiveaways() {
            // Get all giveaways from the database. We fetch all documents by passing an empty condition.
            return await giveawayModel.find().lean().exec();
        }

        // Refresh storage method is called when the database is updated on one of the shards
        async refreshStorage() {
            // This should make all shard refreshing their cache with the updated database
            return client.shard.broadcastEval(() => this.giveawaysManager.getAllGiveaways());
        }
    
        // This function is called when a giveaway needs to be saved in the database.
        async saveGiveaway(messageId, giveawayData) {
            // Add the new giveaway to the database
            await giveawayModel.create(giveawayData);
            // Don't forget to return something!
            return this.refreshStorage();
        }
    
        // This function is called when a giveaway needs to be edited in the database.
        async editGiveaway(messageId, giveawayData) {
            // Find by messageId and update it
            await giveawayModel.updateOne({ messageId }, giveawayData, { omitUndefined: true }).exec();
            // Don't forget to return something!
            return this.refreshStorage();
        }
    
        // This function is called when a giveaway needs to be deleted from the database.
        async deleteGiveaway(messageId) {
            // Find by messageId and delete it
            await giveawayModel.deleteOne({ messageId }).exec();
            // Don't forget to return something!
            return this.refreshStorage();
        }
    };
    
    // Create a new instance of your new class
    const manager = new GiveawayManagerWithOwnDatabaseAndWithShardSupport(client, {
        default: {
            botsCanWin: false,
            embedColor: 'Blurple',
            embedColorEnd: '0x2F3136',
            reaction: '🎉'
        },
        endedGiveawaysLifetime: 259200000
    });
    
    // We now have a giveawaysManager property to access the manager everywhere!
    client.giveawaysManager = manager;
    
    //Prerequisites
    client.prerequisites = new Collection()

    for (const file of client.prerequisiteFiles) {
        const prerequisite = require(`${file}`);
        client.prerequisites.set(prerequisite.name, prerequisite)
        prerequisite.run(client);
    }
    
    //Events
    const eventFiles = await globPromise(`${process.cwd()}/events/*.js`);
    eventFiles.map((value) => require(value));
    
    //Slash Commands
    client.slashCommands = new Collection()
    const slashCommands = await globPromise(`${process.cwd()}/SlashCommands/*/*.js`);
    const arrayOfCommands = [];

    slashCommands.map((value) => {
        const file = require(value)
        if (!file?.name) return;

        client.slashCommands.set(file.name, file)

        if (file.reqPerm) file.defaultPermissions = false;
        console.log('Slash Command Loaded ' + file.name)
        arrayOfCommands.push(file)
    });

    client.contextMenus = new Collection()
    const contextMenus = await globPromise(`${process.cwd()}/ContextMenus/*.js`);

    contextMenus.map((value) => {
        const file = require(value)
        if (!file?.name) return;

        client.contextMenus.set(file.name, file)
        
        delete file.description;
        if (file.reqPerm) file.defaultPermissions = false;
        console.log('Context Menu Loaded ' + file.name)
        arrayOfCommands.push(file)
    });

    //Posting commands
    client.on("ready", async () => {
        client.guilds.cache.forEach(async (guild) => {
            try {
                await client.guilds.cache.get(guild.id).commands.set(arrayOfCommands)
            } catch(error) {
            }
        });
    });
};