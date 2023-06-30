const {Client, CommandInteraction, EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js')
const fetch = require('node-fetch')

module.exports = {
    name: 'npm',
    type: ApplicationCommandType.ChatInput,
    description: 'Search for a npm package!',
    options: [
        {
            name: 'name',
            description: 'The name of the npm package you want to search for',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],
    cooldown: 5000,
    reqPerm: "NONE",
    args: "<name>",
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
     run: async (client, interaction, args) => {
        let [ name ] = args

        try {
            await fetch(`https://api.popcat.xyz/npm?q=${name}`)
            .then(res => res.json())
            .then(json => {
                if(json.error) return interaction.editReply({ content: 'This npm package does not exist.' })

                let date = new Date(json.last_published).getTime()
    
                const embed = new EmbedBuilder()
                .setTitle(json.name)
                .setURL(`https://www.npmjs.com/package/${json.name}`)
                .setColor(`Blurple`)
                .setDescription(`${json.description}`)
                .addFields([
                    { name: 'Author', value: json.author, inline: true },
                    { name: 'Maintainers', value: json.maintainers, inline: true },
                    { name: 'Version', value: json.version, inline: true },
                    { name: 'Repository', value: json.repository, inline: true },
                    { name: 'Downloads', value: json.downloads_this_year, inline: true },
                    { name: 'Last published', value: `<t:${Math.floor(date/1000)}>`, inline: true },
                ])
    
                interaction.followUp({ embeds: [embed] })
            })
        } catch(err) {
            interaction.editReply('An error occured while trying to search for the npm package.')
        }
    },
};