const { CommandInteraction, Client, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js')
const ms = require('ms')

module.exports = {
    name: 'timeout',
    type: ApplicationCommandType.ChatInput,
    description: 'Timeout a member!',
    options: [
        {
            name: 'member',
            description: "The member that you want to timeout",
            type: ApplicationCommandOptionType.User,
            required: true
        },
        {
            name: 'time',
            description: "The amount of time you want to timeout the member for",
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],
    cooldown: 5000,
    reqPerm: "KICK_MEMBERS",
    args: "<member> <time>",

    /**
     * @param {Client} client
     * @param {CommandInteraction} message
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        let member = interaction.options.getMember('member')
        let time = interaction.options.getString('time')

        const guildMember = interaction.guild.members.cache.get(member.id)

        if(guildMember.roles.highest.position >= interaction.member.roles.highest.position) {
            return interaction.editReply("You cannot timeout a member that has a higher or equal role to you.")
        }

        if(guildMember.roles.highest.position >= interaction.guild.members.me.roles.highest.position) {
            return interaction.editReply("I cannot timeout a member that has a higher or equal role to me.")
        }

        if(isNaN(ms(time)) || !ms(time) || ms(time) < 0) {
            return interaction.editReply({ content: `Please provide a valid time period.`})
        }

        guildMember.timeout(ms(time))
        interaction.followUp({ content: `I have successfully timed out ${guildMember} for ${ms(ms(time), { long: true })}.` })
    }
}
