const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: 'mute-role',
    type: ApplicationCommandType.ChatInput,
    description: 'Set or delete the mute role!',
    options: [
        {
            name: 'options',
            description: "The options to either set or delete the mute role",
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                {
                    name: 'Create',
                    value: 'Create'
                },
                {
                    name: 'Set',
                    value: 'Set'
                },
                {
                    name: 'Delete',
                    value: 'Delete'
                }
            ]
        },
        {
            name: 'role',
            description: "The mute role. (This argument is only needed when setting the mute role)",
            type: ApplicationCommandOptionType.Role,
            required: false
        }
    ],
    cooldown: 60000,
    reqPerm: "ADMINISTRATOR",
    args: "<options> [role]",
    
    /**
     * @param {Client} client
     * @param {CommandInteraction} message
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        let [ options, role ] = args 

        if(options.toLowerCase() === 'create') {

            let muteRole = interaction.guild.roles.create({
                name: 'Muted'
            })

            const channels = interaction.guild.channels.cache.filter(x => x.type !== 'GUILD_VOICE');

			channels.forEach((channel) => {
				if(!channel.manageable) return;
                    
				channel.permissionOverwrites.edit(muteRole.id, {
					SendMessages: false,
				})
            })

            client.gData.set(`${interaction.guild.id}:muteRole`, muteRole.id)

            interaction.followUp({ content: `I have successfully created the muted role.` })
        } else if(options.toLowerCase() === 'set') {

            if(!role) return interaction.editReply({ content: `You must provide a role.`})
        
            let muteRole = interaction.guild.roles.cache.get(role)

            if(!muteRole) return interaction.editReply({ content: `You must provide a valid role.`})

            client.gData.set(`${interaction.guild.id}:muteRole`, muteRole.id)
            interaction.followUp(`Successfully set the mute role to ${muteRole.name}.`)
        } else {
            client.gData.delete(`${interaction.guild.id}:muteRole`)
            interaction.followUp(`Successfully deleted the mute role.`)
        }
    }
}