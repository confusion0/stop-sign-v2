const { Client, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js')
const fetch = require('node-fetch')

module.exports = {
    name: 'tweet',
    type: ApplicationCommandType.ChatInput,
    description: 'Tweet something on twitter!',
    options: [
        {
            name: 'message',
            description: "The message that you want the bot to say",
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],
    cooldown: 5000,
    reqPerm: "NONE",
    args: "<message>",

    /**
     * @param {Client} client
     * @param {CommandInteraction} message
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        let [ message ] = args

        fetch(`https://nekobot.xyz/api/imagegen?type=tweet&username=${interaction.user.username}&text=${message}`)
        .then((res) => res.json())
        .then((data) => {
            interaction.followUp({ files: [data.message] })
        })
    }
}