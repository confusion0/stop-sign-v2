const {Client, CommandInteraction, EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js')
const pop = require('popcat-wrapper')

module.exports = {
    name: 'translate',
    type: ApplicationCommandType.ChatInput,
    description: 'Translates a string!',
    options: [
        {
            name: 'language',
            description: 'Language to which the message should be translated',
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: 'string',
            description: 'The string that you want to translate',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],
    cooldown: 5000,
    reqPerm: "NONE",
    args: "<language> <string>",
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
     run: async (client, interaction, args) => {
        let [ language, string ] = args
        
        try {
            const translated = await pop.translate(string, language)
            interaction.followUp({ 
                content: 
                `**Input**: ${string} \n**Output**: ${translated}` 
            });
        } catch(err) {
            interaction.editReply({ content: 'An error occured while trying to translate the string.' })
        }
    },
};