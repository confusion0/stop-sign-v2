const { CommandInteracion, Client, EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    name: "role-all",
    type: ApplicationCommandType.ChatInput,
    description: "Give or remove a role from everyone",
    options: [
        {
            name: 'options',
            description: "The options to either add or remove a role from everyone",
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
            name: 'role',
            description: "The role you want to give or remove from everyone",
            type: ApplicationCommandOptionType.Role,
            required: true
        }
    ],
    cooldown: 5000,
    reqPerm: "MANAGE_ROLES",
    args: "<options> <role>",

    /**
     * @param {Client} client
     * @param {CommandInteraction} message
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        
        let options = interaction.options.getString('options')
        let role = interaction.options.getRole('role')
        
        const giveRole = interaction.guild.roles.cache.get(role)

        if(interaction.guild.members.me.roles.highest.position <= giveRole.position) {
            return interaction.editReply({ content: `The role you provided has a higher position than my highest role.` })
        }

        if(options.toLowerCase() === 'add') {
            interaction.guild.members.cache
            .filter(m => !m.user.bot)
            .map(member => {
                if(member.roles.highest.position <= giveRole.position) {
                    member.roles.add(giveRole)
                }
            })

            interaction.followUp({ content: `I have given the ${giveRole.name} role to everyone.` })
        } else {  
            interaction.guild.members.cache
            .filter(m => !m.user.bot)
            .map(member => {
                if(member.roles.highest.position <= giveRole.position) {
                    member.roles.remove(giveRole)
                }
            })

            interaction.followUp({ content: `I have removed the ${giveRole.name} role from everyone.` })
        }
    }
};