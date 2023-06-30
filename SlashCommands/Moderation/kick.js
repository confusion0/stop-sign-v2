const { CommandInteraction, Client, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js')

module.exports = {
    name: 'kick',
    type: ApplicationCommandType.ChatInput,
    description: 'Kick a member!',
    options: [
        {
            name: 'member',
            description: "The member that you want to kick",
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

        const guildMember = interaction.guild.members.cache.get(member.id)

        if(guildMember.roles.highest.position >= interaction.member.roles.highest.position) {
            return interaction.editReply("You cannot ban a member that has a higher or equal role to you.")
        }

        if(guildMember.roles.highest.position >= interaction.guild.members.me.roles.highest.position) {
            return interaction.editReply("I cannot ban a member that has a higher or equal role to me.")
        }

        if(guildMember.id === interaction.member.id) return interaction.editReply({ content: `Why are you trying to kick yourself?` })

        if(!guildMember.kickable) return interaction.editReply({ content: `I cannot kick this member.` })

        interaction.guild.members.kick(guildMember)
        
        interaction.followUp({ content: `I have successfully kicked ${guildMember.user.tag} \`\`ID: ${guildMember.id}\`\` for: ${reason || 'Unspecified'}.` })
    }
}