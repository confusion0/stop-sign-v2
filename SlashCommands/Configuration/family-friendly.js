const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: 'family-friendly',
    type: ApplicationCommandType.ChatInput,
    description: 'Turn the family friendly filter on or off!',
    options: [
        {
            name: 'options',
            description: "The options to turn the family friendly filter on or off",
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

            client.gData.set(`${interaction.guild.id}:familyFriendly`, punishment)
            
            return interaction.followUp({ content: `Turned on the family friendly filter.` })
        } else {
            client.gData.delete(`${interaction.guild.id}:familyFriendly`)

            return interaction.followUp({ content: `Turned off the family friendly filter.` })
        }
    }
}