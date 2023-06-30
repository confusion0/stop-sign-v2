const Schema = require('../../models/experience')
const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: 'leveling',
    type: ApplicationCommandType.ChatInput,
    description: 'Turn the leveling system on or off!',
    options: [
        {
            name: 'options',
            description: "The options to turn the leveling system on or off",
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
        let [ options ] = args

        if(options === 'On') {
            Schema.findOne({ Guild: interaction.guild.id }, async (err, data) => {
                if(data) {
                    data.Enabled = true
                    
                    data.save()
                } else {
                    await new Schema({
                        Guild: interaction.guild.id,
                        Enabled: true
                    }).save()
                }
            })
            
            return interaction.followUp({ content: `Turned on the leveling system.` })
        } else {
            Schema.findOne({ Guild: interaction.guild.id }, async (err, data) => {
                if(!data) return

                data.Enabled = false
                
                data.save()
            })

            return interaction.followUp({ content: `Turned off the leveling system.` })
        }
    }
}
