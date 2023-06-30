const { CommandInteraction, Client, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js')

const ms = require('ms')

module.exports = {
    name: 'mute',
    type: ApplicationCommandType.ChatInput,
    description: 'Mute a member!',
    options: [
        {
            name: 'member',
            description: "The member that you want to mute",
            type: ApplicationCommandOptionType.User,
            required: true
        },
        {
            name: 'time',
            description: "The amount of time you want to mute the member for",
            type: ApplicationCommandOptionType.String,
            required: false
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

        const muteRole = interaction.guild.roles.cache.get(await client.gData.get(`${interaction.guild.id}:muteRole`))
        const guildMember = interaction.guild.members.cache.get(member.id)

        if(!muteRole) return interaction.editReply({ content: `The server doesn't have a mute role yet.` })

        if(guildMember.roles.highest.position >= interaction.member.roles.highest.position) {
            return interaction.editReply("You cannot mute a member that has a higher or equal role to you.")
        }

        if(guildMember.roles.highest.position >= interaction.guild.members.me.roles.highest.position) {
            return interaction.editReply("I cannot mute a member that has a higher or equal role to me.")
        }

        if(guildMember.roles.cache.has(muteRole.id)) {
            return interaction.editReply("That member is already muted.")
        }

        if(muteRole.position >= interaction.guild.members.me.roles.highest.position) {
            return interaction.editReply("I cannot mute a member with a role that has a higher or equal position to me.")
        }

        if(time && (isNaN(ms(time)) || ms(time) > ms('24 hours') || ms(time) < ms('1 second'))) {
            return interaction.editReply({ content: `Please provide a valid time period that is less than 24 hours.`})
        }

        guildMember.roles.add(muteRole.id)
        
        if(time) {
            interaction.followUp({ content: `I have successfully muted ${guildMember} for ${ms(ms(time), {long: true})}.` })
            setTimeout(function(){
                guildMember.roles.remove(muteRole.id)
      
            }, ms(time));
        } else {
            interaction.followUp({ content: `I have successfully muted ${guildMember}.` })
        }
    }
}
