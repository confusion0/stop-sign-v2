const { CommandInteraction, Client, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js')
const axios = require('axios')

module.exports = {
    name: 'documents',
    type: ApplicationCommandType.ChatInput,
    description: 'Search the Discord.js documentation!',
    options: [
        {
            name: 'options',
            description: 'The option to search the stable or master documentation',
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                {
                    name: 'Stable',
                    value: 'stable'
                },
                {
                    name: 'Master',
                    value: 'master'
                }
            ]
        },
        {
            name: 'query',
            description: 'The argument that you want to search for in the documentation',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],
    cooldown: 5000,
    reqPerm: "NONE",
    args: "<options> <query>",

    /**
     * @param {Client} client
     * @param {CommandInteraction} message
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        let [ options, query ] = args

        const uri = `https://djsdocs.sorta.moe/v2/embed?src=${options}&q=${encodeURIComponent(query)}`

        axios
        .get(uri)
        .then((embed) => {
            const { data } = embed

            if(data && !data.error) {
                interaction.followUp({ embeds: [data] })
            } else {
                interaction.followUp({ content: `I could not find that documentation.` })
            }
        }).catch((err) => {
            interaction.followUp({ content: `There was an error sending this documentation.` })
        })
    }
}