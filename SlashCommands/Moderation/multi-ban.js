const { CommandInteraction, Client, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js')

module.exports = {
    name: 'multi-ban',
    type: ApplicationCommandType.ChatInput,
    description: 'Ban multiple members!',
    options: [
        {
            name: 'members',
            description: "The members that you want to ban",
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: 'days',
            description: "The amount of days you want to ban the members for",
            type: ApplicationCommandOptionType.Number,
            required: false
        },
        {
            name: 'reason',
            description: "The reason for the ban(s)",
            type: ApplicationCommandOptionType.String,
            required: false
        }
    ],
    cooldown: 5000,
    reqPerm: "BAN_MEMBERS",
    args: "<member(s)> [days] [reason]",

    /**
     * @param {Client} client
     * @param {CommandInteraction} message
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        let members = interaction.options.getString('members')
        let days = interaction.options.getString('days')
        let reason = interaction.options.getString('reason')

        let users = []

        members.split(' ').forEach(member => {
            users.push(member)
        })

        let i = 0

        users.forEach(async (user) => {
            try {
                let guildMember = interaction.guild.members.cache.get(user) || interaction.guild.members.cache.find(member => member.user.username === user) || interaction.guild.members.cache.find(member => member.user.id === user.slice(3, user.length - 1))

                if(!guildMember) return

                if(guildMember.roles.highest.position >= interaction.member.roles.highest.position) return 
            
                if(guildMember.roles.highest.position >= interaction.guild.members.me.roles.highest.position) return
            
                interaction.guild.members.ban(guildMember, { reason: (reason ? reason : 'Unspecified'), days: days ? days : 0 })

                i++
            } catch (err) {
                console.log(err)
            }
        })

        interaction.followUp({ content: `I have successfully banned ${i} out of ${users.length} members for ${days ? days : 'unlimited'} days.` })
    }
}
