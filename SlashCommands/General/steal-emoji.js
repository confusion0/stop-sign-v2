const { Util, CommandInteraction, Client, EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js')

module.exports = {
    name: 'steal-emoji',
    type: ApplicationCommandType.ChatInput,
    description: 'Steal emojis from another server!',
    options: [
        {
            name: 'emojis',
            description: 'The emojis that you want to add to the server',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],
    cooldown: 5000,
    reqPerm: "MANAGE_EMOJIS_AND_STICKERS",
    args: "<emojis>",

    /**
     * @param {Client} client
     * @param {CommandInteraction} message
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        let [ emoji ] = args

        let emojis = emoji.split(' ').map(e => e.trim())

        if(emojis.length > 5) return interaction.editReply('You can only steal up to 5 emojis at a time.')

        let i = 0

        for(const rawEmoji of emojis) {
            const parsedEmoji = Util.parseEmoji(rawEmoji)

            if(parsedEmoji.id) {
                if(await interaction.guild.emojis.cache.has(parsedEmoji.id)) return interaction.editReply({ content: `The emoji, \`${parsedEmoji.name}\`, is already in this server.` })

                try {
                    const extension = parsedEmoji.animated ? '.gif' : '.png'
                    const url = `https://cdn.discordapp.com/emojis/${parsedEmoji.id + extension}`

                    interaction.guild.emojis
                    .create(url, parsedEmoji.name)

                    i++
                } catch(error) {
                }
            }
        }

        return interaction.followUp(`Successfully added ${i} of ${emojis.length} emojis to the server!`)
    }
}