const { CommandInteraction, Client, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js')

module.exports = {
    name: 'un-mute',
    type: ApplicationCommandType.ChatInput,
    description: 'Unmute a member!',
    options: [
        {
            name: 'member',
            description: "The member that you want to unmute",
            type: ApplicationCommandOptionType.User,
            required: true
        },
    ],
    cooldown: 5000,
    reqPerm: "KICK_MEMBERS",
    args: "<member>",

    /**
     * @param {Client} client
     * @param {CommandInteraction} message
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        let member = interaction.options.getMember('member')

        const muteRole = interaction.guild.roles.cache.get(await client.gData.get(`${interaction.guild.id}:muteRole`))
        const guildMember =  interaction.guild.members.cache.get(member.id)

        if(!muteRole) return interaction.editReply({ content: `The server doesn't have a mute role yet.` })

        if(!(guildMember.roles.cache.get(muteRole.id))){
            return interaction.editReply({ content: `The member you want to unmute does is not muted.` });
        }

        if(muteRole.position >= interaction.guild.members.me.roles.highest.position) {
            return interaction.editReply("I cannot unmute a member with a role that has a higher or equal position to me.")
        }

        guildMember.roles.remove(muteRole.id)
        interaction.followUp({ content: `I have successfully unmuted ${guildMember}.`})
    }
}