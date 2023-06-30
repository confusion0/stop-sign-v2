const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: 'anti-invite',
    type: ApplicationCommandType.ChatInput,
    description: 'Turn the anti-invite on or off!',
    options: [
        {
            name: 'options',
            description: "The options to turn the anti-invite on or off",
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                {
                    name: 'On',
                    value: 'On'
                },
                {
                    name: 'Off',
                    value: 'Off'
                }
            ]
        },
        {
            name: 'punishment',
            description: 'The punishment for sending an invite',
            type: ApplicationCommandOptionType.String,
            required: false,
            choices: [
                {
                    name: 'Delete',
                    value: 'delete'
                },
                {
                    name: 'Timeout',
                    value: 'timeout'
                },
                {
                    name: 'Kick',
                    value: 'kick'
                }
            ]
        }
    ],
    cooldown: 60000,
    reqPerm: "ADMINISTRATOR",
    args: "<options>",
    
    /**
     * @param {Client} client
     * @param {CommandInteraction} message
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        let [ options, punishment ] = args

        if(options === 'On') {
            if(!punishment) return interaction.editReply(`You need to specify a punishment!`)

            client.gData.set(`${interaction.guild.id}:antiInvite`, punishment)
            
            return interaction.followUp({ content: `Turned on the anti-invite.` })
        } else {
            client.gData.delete(`${interaction.guild.id}:antiInvite`)

            return interaction.followUp({ content: `Turned off the anti-invite.` })
        }
    }
}