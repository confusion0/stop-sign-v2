const Schema = require('../../models/lockdown');
const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: 'server',
    type: ApplicationCommandType.ChatInput,
    description: 'Lockdown or unlockdown the server!',
    options: [
        {
            name: 'options',
            description: "The options to either lockdown or unlockdown the server",
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                {
                    name: 'Lockdown',
                    value: 'Lockdown'
                },
                {
                    name: 'Unlockdown',
                    value: 'Unlockdown'
                }
            ]
        },
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
        let options = interaction.options.getString('options')

        const data = await Schema.findOne({
            Guild: interaction.guild.id,
        });

        if(!data) return interaction.editReply({ content: `You do not have any lockdown channel data yet.`})


        if(options === 'Lockdown') {
            if(data.Lockdown.Enabled) return interaction.editReply({ content: `The server is already locked.` })

            data.Lockdown.Enabled = true;

			const channels = interaction.guild.channels.cache.filter(x => data.Lockdown.Channels.includes(x.id));

			channels.forEach((channel) => {
				if(!channel.manageable) return;
                if(channel.type !== 'GUILD_VOICE') {
				    channel.permissionOverwrites.edit(interaction.guild.id, {
					    SendMessages: false,
				    });
                }
                channel.send(data.Lockdown.Message);
		    });

            interaction.followUp({ content: `I have locked up the server.`})
            await data.save()
        } else {
            if(!data.Lockdown.Enabled) return interaction.editReply({ content: `The server is already unlocked.` })

            data.Lockdown.Enabled = false;
		    const channels = interaction.guild.channels.cache.filter(x => data.Lockdown.Channels.includes(x.id));

		    channels.forEach((channel) => {
			    if(!channel.manageable) return;
                if(channel.type !== 'GUILD_VOICE') {
			        channel.permissionOverwrites.edit(interaction.guild.id, {
				        SendMessages: true,
				    });
                }
			});

            interaction.followUp({ content: `I have unlocked the server.`})
            await data.save()
        }
    }
}
