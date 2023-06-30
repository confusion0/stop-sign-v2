const { Client, CommandInteraction, EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js')
const fetch = require('node-fetch')

module.exports = {
    name : 'github',
    type: ApplicationCommandType.ChatInput,
    description : 'Search for profile on github!',
    options: [
        {
            name: 'username',
            description: 'The username of the github profile you want to search for',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],
    cooldown: 5000,
    reqPerm: "NONE",
    args: "<username>",
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
     run: async (client, interaction, args) => {
        let [ username ] = args

        try {
            await fetch(`https://api.popcat.xyz/github/${username}`)
            .then(res => res.json())
            .then(json => {
                if(json.error) return interaction.editReply({ content: 'This github profile does not exist.' })

                let date = new Date(json.created_at).getTime()
    
                const embed = new EmbedBuilder()
                .setTitle(json.name)
                .setURL(json.url)
                .setThumbnail(json.avatar)
                .setColor(`Blurple`)
                .setDescription(`${json.bio}`)
                .addFields([
                    { name: 'Followers', value: json.followers, inline: true },
                    { name: 'Following', value: json.following, inline: true },
                    { name: 'Gists', value: json.public_gists, inline: true },
                    { name: 'Repositories', value: json.public_repos, inline: true },
                    { name: 'Location', value: json.company, inline: true },
                    { name: 'Company', value: json.company, inline: true },
                    { name: 'Created at', value: `<t:${Math.floor(date/1000)}>`, inline: true },
                ])
    
                interaction.followUp({ embeds: [embed] })
            })
        } catch(err) {
            interaction.editReply('An error occured while trying to search for the profile.')
        }
    },
};