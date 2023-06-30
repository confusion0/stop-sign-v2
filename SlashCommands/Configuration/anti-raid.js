const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: 'anti-raid',
    type: ApplicationCommandType.ChatInput,
    description: 'Turn the anti-raid on or off!',
    options: [
        {
            name: 'options',
            description: "The options to turn the anti-raid on or off",
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
            client.gData.set(`${interaction.guild.id}:antiRaid`, 'On')
            
            return interaction.followUp({ content: `Turned on the anti-raid.` })
        } else {
            client.gData.delete(`${interaction.guild.id}:antiRaid`)

            return interaction.followUp({ content: `Turned off the anti-raid.` })
        }
    }
}