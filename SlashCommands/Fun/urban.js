const { EmbedBuilder, CommandInteraction, Client, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js')
const axios = require('axios')

module.exports = {
    name: 'urban',
    type: ApplicationCommandType.ChatInput,
    description: 'Use this command to search terms, phrases or words in the urban dictionary!',
    options: [
        {
            name: 'word',
            description: "The term, prase, or word that you want to search in the urban dictionary",
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],
    cooldown: 10000,
    reqPerm: "NONE",
    args: "<word>",

    /**
     * @param {Client} client
     * @param {CommandInteraction} message
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        let [ query ] = args;

        query = encodeURIComponent(query)
   
        const { data: {list} } = await axios.get(`https://api.urbandictionary.com/v0/define?term=${query}`).catch(error => {})

        const [answer] = list

        if (!answer) return interaction.editReply({ content: 'No results found.' })

        const embed = new EmbedBuilder()
        .setTitle(answer.word)
        .setURL(answer.permalink)
        .setColor('Blurple')
        .addFields([
            { name: 'Definition', value: trim(answer.definition) },
            { name: 'Example', value: trim(answer.example)}
        ])
        .setFooter({ text: `👍 ${answer.thumbs_up} 👎 ${answer.thumbs_down}` })
        .setTimestamp()

        interaction.followUp({ embeds: [embed] })
    }
}

function trim(input) {
    return input.length > 1024 ? `${input.slice(0, 1024)} ... ` : input;
}