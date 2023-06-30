const { CommandInteracion, Client, EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    name: "user-role",
    type: ApplicationCommandType.ChatInput,
    description: "Give or remove a role from a user",
    options: [
        {
            name: 'options',
            description: "The options to either add or remove a role from a member",
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                {
                    name: 'Add',
                    value: 'Add'
                },
                {
                    name: 'Remove',
                    value: 'Remove'
                }
            ]
        },
        {
            name: 'member',
            description: "The member that you want to give the role to",
            type: ApplicationCommandOptionType.User,
            required: true
        },
        {
            name: 'role',
            description: "The role you want to give to the member",
            type: ApplicationCommandOptionType.Role,
            required: true
        }
    ],
    cooldown: 5000,
    reqPerm: "MANAGE_ROLES",
    args: "<options> <member> <role>",
    
    /**
     * @param {Client} client
     * @param {CommandInteraction} message
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        
        let options = interaction.options.getString('options')
        let member = interaction.options.getMember('member')
        let role = interaction.options.getRole('role')

        const guildMember = interaction.guild.members.cache.get(member)
        const giveRole = interaction.guild.roles.cache.get(role)

        if(interaction.guild.members.me.roles.highest.position <= giveRole.position) {
            return interaction.editReply({ content: `The role you provided has a higher position than my highest role.` })
        }

        if(options.toLowerCase() === 'add') {
            guildMember.roles.add(giveRole.id)

            interaction.followUp({ content: `I have given the ${giveRole.name} role to ${guildMember}.` })
        } else {
            guildMember.roles.remove(giveRole.id)

            interaction.followUp({ content: `I have removed the ${giveRole.name} role from ${guildMember}.` })
        }
    }
};