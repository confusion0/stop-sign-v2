const { EmbedBuilder, CommandInteraction, Client, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js')
const got = require('got')

module.exports = {
    name: 'meme',
    type: ApplicationCommandType.ChatInput,
    description: 'Sends a meme!',
    cooldown: 10000,
    reqPerm: "NONE",
    args: "",

    /**
     * @param {Client} client
     * @param {CommandInteraction} message
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        const embed = new EmbedBuilder()
        
        got('https://www.reddit.com/r/memes/random/.json').then(response => {
            if(!response) return interaction.editReply('Something went wrong.')
            let content = JSON.parse(response.body);
            let permalink = content[0].data.children[0].data.permalink;
            let memeUrl = `https://reddit.com${permalink}`;
            let memeImage = content[0].data.children[0].data.url;
            let memeTitle = content[0].data.children[0].data.title;
            let memeUpvotes = content[0].data.children[0].data.ups;
            let memeDownvotes = content[0].data.children[0].data.downs;
            let memeNumComments = content[0].data.children[0].data.num_comments;
            embed.setTitle(`${memeTitle}`)
            embed.setURL(`${memeUrl}`)
            embed.setImage(memeImage)
            embed.setColor('Blurple')
            embed.setFooter({ text: `👍 ${memeUpvotes} 👎 ${memeDownvotes} 💬 ${memeNumComments}` })
            
            interaction.followUp({ embeds: [embed] })
        }).catch(error => {
            console.log(error)

            return interaction.editReply('Something went wrong while sending the meme.')
        })
    }
}
