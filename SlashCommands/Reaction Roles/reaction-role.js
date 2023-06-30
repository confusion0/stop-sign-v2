const { Util } = require("discord.js")
const Schema = require('../../models/reactionroles')
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js')

module.exports = {
    name: 'reaction-role',
    type: ApplicationCommandType.ChatInput,
    description: 'Set, delete, update, or send the reaction roles!',
    options: [
        {
            name: 'options',
            description: 'The options for configuring the reaction roles',
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                {
                    name: 'Add',
                    value: 'add'
                },
                {
                    name: 'Remove',
                    value: 'remove'
                },
                {
                    name: 'Delete',
                    value: 'delete'
                },
                {
                    name: 'Panel',
                    value: 'panel'
                },
                {
                    name: 'Update',
                    value: 'update'
                }
            ]
        },
        {
            name: 'channel',
            description: "The channel you want to send the panel to or to fetch a message from",
            type: ApplicationCommandOptionType.Channel,
            required: false,
            channelTypes: ['GUILD_TEXT']
        },
        {
            name: 'message-id',
            description: "The message you want to add the reaction roles to",
            type: ApplicationCommandOptionType.String,
            required: false
        },
        {
            name: 'role',
            description: "The role for the reaction role",
            type: ApplicationCommandOptionType.Role,
            required: false
        },
        {
            name: 'emoji',
            description: "The emoji for the reaction role",
            type: ApplicationCommandOptionType.String,
            required: false
        }
    ],
    cooldown: 10000,
    reqPerm: "ADMINISTRATOR",
    args: "<channel> [message-id]",
    
    /**
     * @param {Client} client
     * @param {CommandInteraction} message
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        let options = interaction.options.getString('options') 
        let reactionRoleChannel = interaction.options.getChannel('channel') || false
        let reactionRoleMessage = interaction.options.getString('message-id') || false
        let reactionRole = interaction.options.getRole('role') || false
        let emoji = interaction.options.getString('emoji') || false

        if(options === 'add') {
            if(!reactionRole || !emoji) return interaction.editReply({ content: `Please provide a role and emoji.`})

            let role = interaction.guild.roles.cache.get(reactionRole.id)

            if(role.position >= interaction.guild.members.me.roles.highest.position) return interaction.editReply({ content: `The role you provided is higher than your my highest role.`})

            const parsedEmoji = Util.parseEmoji(emoji)
    
            if(!parsedEmoji) return interaction.editReply({ content: `That is not a valid emoji.` })
    
            Schema.findOne({ Guild: interaction.guild.id }, async(err, data) => {
                if(data) {
                    let ids = []
                    let emojis = []
                    Object.keys(data.Roles).map((value, index) => {
                        const role = interaction.guild.roles.cache.get(data.Roles[value][0])
                    
                        emojis.push(data.Roles[value][1].raw);
                        ids.push(role.id);
                    })
    
                    if(10 <= ids.length) return interaction.editReply({ content: `You may only have 20 reaction roles.`})
    
                    if(ids.includes(role.id)) return interaction.editReply({ content: `The reaction roles already has that role.` })
    
                    if(emojis.includes(emoji)) return interaction.editReply({ content: `The reaction roles already has that emoji.` })
    
                    data.Roles[parsedEmoji.name] = [
                        role.id,
                        {
                            id: parsedEmoji.id,
                            raw: emoji
                        }
                    ]
    
                    await Schema.findOneAndUpdate({ Guild: interaction.guild.id }, data);
                } else {
                    
                    await new Schema({
                        Guild: interaction.guild.id,
                        Message: 0,
                        Roles: {
                            [parsedEmoji.name]: [
                                role.id,
                                {
                                    id: parsedEmoji.id,
                                    raw: emoji,
                                }
                            ]
                        }
                    }).save();
                }
    
                interaction.followUp({ content: `${client.emotes.add} I have successfully added a reaction role ${role.name} for ${emoji}. Use the slash command called \`reaction-role-panel\` in the channel you want the reaction role to be in.` })
            })
        } else if(options === 'remove') {
            if(!reactionRole) return interaction.editReply({ content: `Please provide a role.`})

            let role = interaction.guild.roles.cache.get(reactionRole.id)

            if(!role) return interaction.editReply({ content: `Please provide an existing reaction role.` })

            Schema.findOne({ Guild: interaction.guild.id }, async(err, data) => {
                if(!data) return interaction.editReply({ content: `There are no reaction roles yet. Use the \`reaction-role\` command to add some reaction roles.` })

                let array = []
                Object.keys(data.Roles).map((value, index) => {
                    const role = interaction.guild.roles.cache.get(data.Roles[value][0])
                    
                    array.push({ id: role, emoji: value })
                })

                if(array.find(r => r.id === role)) {

                    if(Object.keys(data.Roles).length === 1) {
                        await Schema.findOneAndDelete({ Guild: interaction.guild.id }, data);
                    } else {
                        delete data.Roles[array.find(r => r.id === role).emoji]

                        await Schema.findOneAndUpdate({ Guild: interaction.guild.id }, data)
                    }

                    interaction.followUp({ content: `I have successfully removed the reaction role for the ${reactionRole.name} role.` })
                } else return interaction.editReply({ content: `That reaction role doesn't exist.` })
            })
        } else if(options === 'delete') {
            Schema.findOne({ Guild: interaction.guild.id }, async(err, data) => {
                if(data) {
                    await Schema.findOneAndDelete({ Guild: interaction.guild.id }, data);
                }
            })
    
            interaction.followUp({ content: `I have successfully deleted the current reaction roles.`})
        } else if(options === 'panel') {
            if(!reactionRoleChannel) return interaction.editReply({ content: `Please provide a channel.`})

            const channel = interaction.guild.channels.cache.get(reactionRoleChannel.id)
        
            if(channel.type == "GUILD_VOICE") {
                return interaction.editReply({ content: `Please choose a text channel.` })
            }
    
            if(!reactionRoleMessage) {

                try {
                    Schema.findOne({ Guild: interaction.guild.id }, async(err, data) => {
                        if(!data) return interaction.editReply({ content: `There are no reaction roles yet. Use the \`reaction-role\` command to add some reaction roles.` })
                        const mapped = Object.keys(data.Roles)
                        .map((value, index) => {
                            const role = interaction.guild.roles.cache.get(data.Roles[value][0])
        
                            return `${index + 1}) React with ${data.Roles[value][1].raw} to receive the ${role} role.`;
                        }).join("\n\n");
    
                        const embed = new EmbedBuilder().setTitle('Reaction roles').setColor('Blurple').setDescription(mapped)
        
                        channel.send({ embeds: [embed] })
                        .then((msg) => {
                            data.Message = msg.id
                            data.Channel = msg.channel.id
                            data.save()
        
                            const reactions = Object.values(data.Roles).map((val) => val[1].id ?? val[1].raw)
                        
                            reactions.map((emoji) => msg.react(emoji));

                            const row = new ActionRowBuilder()
                            row.addComponents(
                                new ButtonBuilder()
                                .setStyle('Link')
                                .setLabel(`View Message`)
                                .setURL(msg.url)
                            )

                            interaction.followUp({ content: `I have sent the reaction roles.`, components: [row] })
                        })
                    })
                } catch(error) {
                    interaction.followUp({ content: `An error occured while runnning this command! ERROR: \`\`\`${error}\`\`\`` })
                }
            } else {
                
                try {
                    Schema.findOne({ Guild: interaction.guild.id }, async(err, data) => {
                        if(!data) return interaction.editReply({ content: `There are no reaction roles yet. Use the \`reaction-role\` command to add some reaction roles.` })
    
                        await channel.messages.fetch(reactionRoleMessage).then(message => {
                            if(!message) return interaction.editReply({ content: `I couldn't find a message with the ID you provided.` })
    
                            data.Message = message.id
                            data.Channel = message.channel.id
                            data.save()
        
                            const reactions = Object.values(data.Roles).map((val) => val[1].id ?? val[1].raw)
                        
                            reactions.map((emoji) => message.react(emoji));
                            
                            const row = new ActionRowBuilder()
                            row.addComponents(
                                new ButtonBuilder()
                                .setStyle('Link')
                                .setLabel(`View Message`)
                                .setURL(message.url)
                            )

                            interaction.followUp({ content: `I have applied the reaction roles to that message.`, components: [row] })
                        })
                    })
                } catch(error) {
                    interaction.followUp({ content: `An error occured while runnning this command! ERROR: \`\`\`${error}\`\`\`` })
                }
            }
        } else {
            Schema.findOne({ Guild: interaction.guild.id }, async(err, data) => {
                if(!data) return interaction.editReply({ content: `There are no reaction roles yet. Use the \`reaction-role\` command to add some reaction roles.` })

                if(!data.Channel) return interaction.editReply({ content: `An error occured while updating the reaction role message.` })
                try {
                    interaction.guild.channels.cache.get(data.Channel).messages.fetch(data.Message)
                    .then(message => {

                        const mapped = Object.keys(data.Roles)
                        .map((value, index) => {
                            const role = interaction.guild.roles.cache.get(data.Roles[value][0])
        
                            return `${index + 1}) React with ${data.Roles[value][1].raw} to receive the ${role} role.`;
                        }).join("\n\n");

                        if(message.embeds) {
                            const embed = new EmbedBuilder().setTitle('Reaction roles').setColor('Blurple').setDescription(mapped)

                            message.edit({ embeds: [embed] })
                        }

                        message.reactions.removeAll().catch(() => {});
                        
                        const reactions = Object.values(data.Roles).map((val) => val[1].id ?? val[1].raw)
                            
                        reactions.map((emoji) => message.react(emoji));

                        const row = new ActionRowBuilder()
                        row.addComponents(
                            new ButtonBuilder()
                            .setStyle('Link')
                            .setLabel(`View Message`)
                            .setURL(message.url)
                        )

                        interaction.followUp({ content: `I have updated the reaction roles to that message.`, components: [row] })
                    })
                } catch(err) {
                    interaction.editReply({ content: `I couldn't find the reaction role message.` })
                }
            })
        }
    }
}
