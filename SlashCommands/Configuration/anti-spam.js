const ms = require('ms');
const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: 'anti-spam',
    type: ApplicationCommandType.ChatInput,
    description: 'Turn the anti-spam on or off!',
    options: [
        {
            name: 'options',
            description: "The options to turn the anti-spam on or off",
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
            name: 'time',
            description: "The maximum time difference between two messages",
            type: ApplicationCommandOptionType.String,
            required: false
        }
    ],
    cooldown: 10000,
    reqPerm: "ADMINISTRATOR",
    args: "<options> [time]",
    
    /**
     * @param {Client} client
     * @param {CommandInteraction} message
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        let guild = interaction.guild
        let [ options, time ] = args
        const muteRole = await client.gData.get(`${interaction.guild.id}:muteRole`)

        if(options.toLowerCase() === 'on') {
            if(!muteRole) return interaction.editReply({ content: `The server does not have a mute role yet.` })

            if(!time) return interaction.editReply({ content: `You did not provide a valid time period.` })

            if(isNaN(ms(time)) || ms(time) > ms('10 seconds') || ms(time) < ms('1 second')) {
                return interaction.editReply({ content: `Please provide a valid time period between 1 and 10 seconds.` })
            }
            
            client.gData.set(`${guild.id}:antiSpam`, ms(time))
            interaction.followUp({ content: `I have set the anti-spam to ${ms(ms(time), {long: true})}` })
        } else {
            client.gData.delete(`${guild.id}:antiSpam`)
            interaction.followUp({ content: `I have successfully turned off the anti-spam` })
        }
    }
}
