const { CommandInteraction, Client, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js')

module.exports = {
    name: 'un-ban',
    type: ApplicationCommandType.ChatInput,
    description: 'Unban a user!',
    options: [
        {
            name: 'user',
            description: "The id of the user that you want to unban",
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: 'reason',
            description: 'The reason that you want to ban this member',
            type: ApplicationCommandOptionType.String,
            required: false
        }
    ],
    cooldown: 5000,
    reqPerm: "BAN_MEMBERS",
    args: "<user> [reason]",

    /**
     * @param {Client} client
     * @param {CommandInteraction} message
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {

        let rawMember = interaction.options.getString('string')
        let reason = interaction.options.getString('reason') || false

        const user = interaction.guild.bans.fetch(rawMember)

        if(!user) return interaction.editReply({ content: `Either that user has not been banned or it is not a valid user id.` })

        interaction.guild.bans.remove(rawMember, { reason: (reason ? reason : 'Unspecified') }).then(() => {
            interaction.followUp({ content: `I have successfully un-banned that user for the reason of: ${(reason ? reason : 'Unspecified')}` })
        })
    }
}