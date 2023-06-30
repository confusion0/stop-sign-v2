const { CommandInteraction, Client, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js')

module.exports = {
    name: 'ping',
    type: ApplicationCommandType.ChatInput,
    description: 'Sends the bot ping!',
    cooldown: 5000,
    reqPerm: "NONE",
    args: "",

    /**
     * @param {Client} client
     * @param {CommandInteraction} message
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        interaction.followUp({ content: `My ping is ${client.ws.ping}ms` });
    }
}