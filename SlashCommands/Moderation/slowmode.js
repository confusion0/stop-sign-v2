const { CommandInteraction, Client, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js')

const ms = require('ms')

module.exports = {
    name: 'slowmode',
    type: ApplicationCommandType.ChatInput,
    description: 'Set the slowmode for the channel!',
    options: [
        {
            name: 'time',
            description: 'The time for the slowmode',
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: 'channel',
            description: 'The channel you want to set the slowmode in',
            type: ApplicationCommandOptionType.Channel,
            required: false,
            channelTypes: ['GUILD_TEXT']
        }
    ],
    cooldown: 15000,
    reqPerm: "MANAGE_CHANNELS",
    args: "<time>",

    /**
     * @param {Client} client
     * @param {CommandInteraction} message
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
       
        let time = interaction.options.getString('time')
        let channel = interaction.options.getChannel('channel') || interaction.channel

        const slowmodeChannel = interaction.guild.channels.cache.get(channel) || interaction.channel

        if(isNaN(ms(time)) || parseInt(ms(time)) <= 0 || ms(time) > 21600000) {
            return interaction.editReply({ content: `Please provide a valid number between 1 second and ${ms(ms(21600000), { long: true })}.`})
        }

        if(slowmodeChannel.type == 'GUILD_VOICE'){
            return interaction.editReply({ content: `Please choose a text channel.` })
        }

        slowmodeChannel.setRateLimitPerUser(ms(time)/1000)
        interaction.followUp({ content: `I have set the slowmode time to ${ms(ms(time), { long: true })}.` })
    }
}
