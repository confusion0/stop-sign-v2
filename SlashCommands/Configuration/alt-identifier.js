const ms = require('ms');
const Schema = require('../../models/altidentifier')
const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: 'alt-identifier',
    type: ApplicationCommandType.ChatInput,
    description: 'Set or delete the alt-identifier channel',
    options: [
        {
            name: 'options',
            description: "The options to set or delete the alt-identifier channel",
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
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
            name: 'channel',
            description: "The alt-identifier channel",
            type: ApplicationCommandOptionType.Channel,
            required: false,
            channelTypes: ['GUILD_TEXT']
        },
        {
            name: 'time',
            description: "The minimum account age",
            type: ApplicationCommandOptionType.String,
            required: false
        }
    ],
    cooldown: 30000,
    reqPerm: "ADMINISTRATOR",
    args: "<options> [channel] [time]",
    
    /**
     * @param {Client} client
     * @param {CommandInteraction} message
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        let guild = interaction.guild
        let [ options, altIdentifierChannel, time ] = args

        if(options === 'Set') {

            if(!altIdentifierChannel) return interaction.editReply({ content: `Please provide a channel.`})

            if(!time) return interaction.editReply({ content: `Please provide a time period.`})
            
            let channel = interaction.guild.channels.cache.get(altIdentifierChannel)

            if(channel.type !== "GUILD_TEXT") {
                return interaction.editReply({ content: `Please choose a text channel.` })
            }

            if(isNaN(ms(time))) {
                return interaction.editReply({ content: `Please provide a valid time period.` })
            }

            if(ms(time) > ms('30 days')) {
                return interaction.editReply({ content: `The time must be under 30 days.` })
            }

            Schema.findOne({ Guild: guild.id }, async (err, data) => {
                if(data) {
                    data.Channel = channel.id
                    data.Time = time
                    await data.save()
                } else {
                    await new Schema({
                        Guild: interaction.guild.id,
                        Channel: channel.id,
                        Time: time
                    }).save()
                }
            })

            interaction.followUp({ content: `Set the alt identifier channel to ${channel}.` })
        } else {
            const data = await Schema.findOne({
                Guild: interaction.guild.id
            })
    
            if(!data) return interaction.editReply({ content: `There is no data to be deleted.`})
    
            Schema.findOne({ Guild: interaction.guild.id }, async(err, data) => {
                if(data) {
                    await Schema.findOneAndDelete({ Guild: interaction.guild.id }, data);
                }
            })

            interaction.followUp({ content: `Successfully deleted the alt identifier channel.` })
        }
    }
}
