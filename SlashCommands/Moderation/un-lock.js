const { CommandInteraction, Client, Permissions, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js')

module.exports = {
    name: 'un-lock',
    type: ApplicationCommandType.ChatInput,
    description: 'Unlock a channel!',
    options: [
        {
            name: 'channel',
            description: "The channel that you want to unlock",
            type: ApplicationCommandOptionType.Channel,
            required: false,
            channelTypes: ['GUILD_TEXT']
        },
        {
            name: 'role',
            description: "The role you want to lock",
            type: ApplicationCommandOptionType.Role,
            required: false
        }
    ],
    cooldown: 5000,
    reqPerm: "MANAGE_CHANNELS",
    args: "[role]",

    /**
     * @param {Client} client
     * @param {CommandInteraction} message
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        let role = interaction.options.getRole('role') || interaction.guild.roles.everyone
        let channel = interaction.options.getChannel('channel') || interaction.channel

        const unlockChannel = interaction.guild.channels.cache.get(channel.id)
        const unlockRole = interaction.guild.roles.cache.get(role.id)

        if(unlockChannel.type == 'GUILD_VOICE'){
            return interaction.editReply({ content: `Please choose a text channel.` })
        }

        unlockChannel.permissionOverwrites.edit(unlockRole, {
            SendMessages: null
        })

        interaction.followUp({ content: `I have successfully unlocked ${unlockChannel} for the ${unlockRole} role.`})
    }
}
