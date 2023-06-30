const { CommandInteraction, Client, Permissions, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js')

module.exports = {
    name: 'lock',
    type: ApplicationCommandType.ChatInput,
    description: 'Lock a channel!',
    options: [
        {
            name: 'channel',
            description: "The channel that you want to lock",
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
    args: "[channel] [role]",

    /**
     * @param {Client} client
     * @param {CommandInteraction} message
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        let role = interaction.options.getRole('role') || interaction.guild.roles.everyone
        let channel = interaction.options.getChannel('channel') || interaction.channel

        const lockChannel = interaction.guild.channels.cache.get(channel.id)
        const lockRole = interaction.guild.roles.cache.get(role.id)

        if(lockChannel.type == 'GUILD_VOICE'){
            return interaction.editReply({ content: `Please choose a text channel.` })
        }

        lockChannel.permissionOverwrites.edit(lockRole, {
            SendMessages: false
        })

        interaction.followUp({ content: `I have successfully locked ${lockChannel} for the ${lockRole} role.`})
    }
}
