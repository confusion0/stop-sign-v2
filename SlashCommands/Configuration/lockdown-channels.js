const Schema = require("../../models/lockdown");
const { MessageCollector, EmbedBuilder } = require('discord.js')
const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: 'lockdown-channels',
    type: ApplicationCommandType.ChatInput,
    description: 'Add, remove, delete or display the lockdown channels',
    options: [
        {
            name: 'options',
            description: "The options to add, remove, delete or display the lockdown channels",
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
                },
                {
                    name: 'Delete',
                    value: 'Delete'
                },
                {
                    name: 'Display',
                    value: 'Display'
                }
            ]
        },
        {
            name: 'channel',
            description: "The lockdown channel you want to remove",
            type: ApplicationCommandOptionType.Channel,
            required: false,
            channelTypes: ['GUILD_TEXT']
        }
    ],
    cooldown: 5000,
    reqPerm: "ADMINISTRATOR",
    args: "<options> [channel]",
    
    /**
     * @param {Client} client
     * @param {CommandInteraction} message
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        let [ options, lockdownChannel ] = args

        let channel = interaction.guild.channels.cache.get(lockdownChannel)

        if(options.toLowerCase() === 'add') {
    
            const data = await Schema.findOne({
                Guild: interaction.guild.id,
            });
        
            if(data && 25 <= data.Lockdown.Channels.length) return interaction.editReply({ content: `You already have 25 or more channels in the lockdown data.` })
            
            const filter = m => m.author.id === interaction.user.id
            let collector = new MessageCollector(interaction.channel, filter, { time: 120000})
            let channelIDs, messages
            let steps = 2
            let step = 0
            let cancelled = true 

            interaction.followUp({ content: `(Step ${step+1} out of ${steps})  Please respond to this message with some channel mentions.` })

            collector.on("collect", async (msg) => {
                if(msg.author.id !== interaction.user.id) return

                if(msg.content.toLowerCase() === 'cancel') {
                    return collector.stop()
                }

                if(step == 0) {
                    channelIDs = msg.mentions.channels.filter(x => x.type == 'GUILD_TEXT').map(e => e.id);

                    if(!msg.mentions.channels.first()) return interaction.channel.send({ content: `Please provide a valid channel.` })

                    if(!channelIDs[0]) return interaction.channel.send({ content: `I was unable to find any valid channels.` })

                    await interaction.channel.send({ content: `(Step ${step+2} out of ${steps}) Please respond to this message the message you want to send to each of the channel you listed when you are locking these channels.\n\nYou can respond with \`none\` if you would not like a message.` })
                }
                if(step == 1) {
                    messages = (msg.content).trim()

                    if(!messages) return interaction.channel.send({ content: `Please provide a message.` })

                    if(messages > 2000) return interaction.channel.send({ content: `Please provide a message that is less than 2000 characters.` })

                    if(messages.toLowerCase() === 'none') messages = false
                }

                step += 1

                if(step >= steps) {
                    cancelled = false
                    return collector.stop()
                }

                collector.on('end', async collected => {
                    if(cancelled) return interaction.channel.send({ content: `The lockdown channel setup was cancelled.` })

                    const data = await Schema.findOne({
                        Guild: interaction.guild.id,
                    });
        
                    if(!data) {
                        await new Schema({
                            Guild: interaction.guild.id,
                            Lockdown: {
                                Enabled: false,
                                Channels: channelIDs,
                            }
                        }).save();

                        
                        await Schema.findOne({ Guild: interaction.guild.id }).then(async (data) => {
                            if(messages) data.Lockdown.Message = messages

                            data.save()

                            interaction.channel.send({ content: `Successfully saved all channels to lock when lockdown command is run! There are ${data.Lockdown.Channels.length} channels.` });
                        })
                    } else if(data) {
                        for (const channelID of channelIDs) {
                            if(data.Lockdown.Channels.includes(channelID)) return interaction.channel.send({ content: `That channel already exist in the database.` })
    
                            data.Lockdown.Channels.push(channelID)
                        }
                        
                        if(messages) data.Lockdown.Message = messages
                        
                        await data.save();
                        interaction.channel.send({ content: `Successfully set all the provided channels to lock when lockdown command is run! There are ${data.Lockdown.Channels.length} lockdown configurated channels.` });
                    }
                })
            })
        } else if(options.toLowerCase() === 'remove') {
            if(!channel) return interaction.editReply({ content: `Please provide a text channel.` })

            if(channel.type == "GUILD_VOICE") {
                return interaction.editReply({ content: `Please choose a text channel.` })
            }
    
            const data = await Schema.findOne({
                Guild: interaction.guild.id,
            });
    
            if(!data) return interaction.editReply({ content: `There is no lockdown channel data.` })
    
            if(!data.Lockdown.Channels.includes(channel.id)) return interaction.editReply({ content: `That channel does not exist in the lockdown channel data.` })
    
            if(data.Lockdown.Channels.length == 1) {
    
                Schema.findOne({ Guild: interaction.guild.id }, async(err, data) => {
                    if(data) {
                        await Schema.findOneAndDelete({ Guild: interaction.guild.id }, data);
                    }
                })
            } else {
      
                const filtered = data.Lockdown.Channels.filter((target) => target !== channel.id);
                const enabled = data.Lockdown.Enabled
                const Message = data.Lockdown.Message
      
                await Schema.findOneAndUpdate({
                    Guild: interaction.guild.id,
                    Lockdown: {
                        Enabled: enabled,
                        Channels: filtered,
                        Message: Message
                    }
                })
            }
            return interaction.followUp({ content: `I have successfully deleted ${channel} from the lockdown channel data.` })
        } else if(options.toLowerCase() === 'delete') {
            const data = await Schema.findOne({
                Guild: interaction.guild.id
            })
    
            if(!data) return interaction.editReply({ content: `There is no data to be deleted.`})
    
            Schema.findOne({ Guild: interaction.guild.id }, async(err, data) => {
                if(data) {
                    await Schema.findOneAndDelete({ Guild: interaction.guild.id }, data);
                }
            })
    
            interaction.followUp({ content: `I have successfully deleted the current lockdown channel data.`})
        } else {
            const data = await Schema.findOne({
                Guild: interaction.guild.id,
            });
      
            if(!data) return interaction.editReply({ content: `There is no lockdown channel data to be displayed.` })
      
            var channels = ""
            data.Lockdown.Channels.forEach(channel => {
                channels += ( "<#" + channel + ">, ")
            })
    
            channels.substring(0, channels.length-2)
      
             
            const embed = new EmbedBuilder()
            .setTitle('Lockdown channels')
            .setDescription(channels)
            .setColor('Blurple')
    
            interaction.followUp({ embeds: [embed] })
        }
    }
}
