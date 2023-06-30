const { CommandInteraction, Client, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js')

module.exports = {
    name: 'ban',
    type: ApplicationCommandType.ChatInput,
    description: 'Ban a member!',
    options: [
        {
            name: 'type',
            description: "The type of ban that you want to use",
            choices: [
                {
                    name: 'Normal',
                    value: 'normal'
                },
                {
                    name: 'Soft',
                    value: 'soft'
                }
            ],
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: 'member',
            description: "The member that you want to ban",
            type: ApplicationCommandOptionType.User,
            required: true
        },
        {
            name: 'days',
            description: "The amount of days you want to ban the member for",
            type: ApplicationCommandOptionType.Number,
            required: false
        },
        {
            name: 'reason',
            description: "The reason for the ban",
            type: ApplicationCommandOptionType.String,
            required: false
        }
    ],
    cooldown: 5000,
    reqPerm: "BAN_MEMBERS",
    args: "<member> [days] [reason]",

    /**
     * @param {Client} client
     * @param {CommandInteraction} message
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        let type = interaction.options.getString('type')
        let member = interaction.options.getMember('member')
        let days = interaction.options.getString('days')
        let reason = interaction.options.getString('reason')

        const guildMember = interaction.guild.members.cache.get(member.id)
        
        if(guildMember.roles.highest.position >= interaction.member.roles.highest.position) {
            return interaction.editReply("You cannot ban a member that has a higher or equal role to you.")
        }

        if(guildMember.roles.highest.position >= interaction.guild.members.me.roles.highest.position) {
            return interaction.editReply("I cannot ban a member that has a higher or equal role to me.")
        }

        if(guildMember.id === interaction.member.id) return interaction.editReply({ content: `Why are you trying to ban yourself?` })

        if(!guildMember.bannable) return interaction.editReply({ content: `I cannot ban this member.` })
        
        if(type === 'normal') {
            interaction.guild.members.ban(guildMember, { reason: (reason ? reason : 'Unspecified'), days: days ? days : 0 })
        } else {
            interaction.guild.members.ban(guildMember, { reason: (reason ? reason : 'Unspecified') }).then(() => {
                interaction.guild.bans.remove(guildMember.id)
            })
        }

        interaction.followUp({ content: `I have successfully banned ${guildMember.user.tag} (\`\`ID: ${guildMember.id}\`\`) for the reason: ${reason || 'Unspecified'}.` })
    }
}
