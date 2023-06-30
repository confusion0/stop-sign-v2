const { CommandInteraction, EmbedBuilder, Client, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js')
const fetch = require('node-fetch')

module.exports = {
    name: 'screenshot',
    type: ApplicationCommandType.ChatInput,
    description: 'Send a screenshot of a website through a malicious link!',
    options: [
        {
            name: 'url',
            description: "The url of the website you want to screenshot",
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],
    cooldown: 10000,
    reqPerm: "NONE",
    args: "[url]",

    /**
     * @param {Client} client
     * @param {CommandInteraction} message
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        
        let url = interaction.options.getString('url')
        
        const site = /^(https?:\/\/)/i.test(url) ? url : `http://${url}`;

        if(!interaction.channel.nsfw && !client.ADMINS.find(admin => admin.ID === interaction.user.id)) return interaction.editReply({ content: 'This command is marked as NSFW. Please use this command in a NSFW channel.' })
        
        try {
            const embed = new EmbedBuilder()
            .setTitle('Screenshot')
            .setColor(`Blurple`)
            .setImage(`https://api.popcat.xyz/screenshot?url=${site}`)

            interaction.followUp({ embeds: [embed] })
        } catch(err) {
            interaction.editReply('An error occured while trying to send the screenshot.')
        }
    }
}