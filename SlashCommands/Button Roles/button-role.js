const { Util } = require("discord.js")
const Schema = require('../../models/buttonroles')
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandOptionType, ApplicationCommandType } = require('discord.js')

module.exports = {
    name: 'button-role',
    type: ApplicationCommandType.ChatInput,
    description: 'Set, delete, or send the button roles!',
    options: [
        {
            name: 'options',
            description: 'The options for configuring the button roles',
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
            description: "The channel you want to send the panel",
            type: ApplicationCommandOptionType.Channel,
            required: false,
            channelTypes: ['GUILD_TEXT']
        },
        {
            name: 'role',
            description: "The role for the button role",
            type: ApplicationCommandOptionType.Role,
            required: false
        },
        {
            name: 'emoji',
            description: "The emoji for the button role",
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
        let [ options ] = args
        let buttonRoleChannel = interaction.options.getChannel('channel') || false
        let buttonRole = interaction.options.getRole('role') || false
        let emoji = interaction.options.getString('emoji') || false

        if(options === 'add') {
            if(!buttonRole || !emoji) return interaction.editReply({ content: 'You need to specify a role and emoji.' })
             
            let role = interaction.guild.roles.cache.get(buttonRole.id)

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
    
                    if(5 <= ids.length) return interaction.editReply({ content: `You may only have 5 button roles.`})
    
                    if(ids.includes(role.id)) return interaction.editReply({ content: `The button roles already has that role.` })
    
                    if(emojis.includes(emoji)) return interaction.editReply({ content: `The button roles already has that emoji.` })
    
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
    
                interaction.followUp({ content: `${client.emotes.add} I have successfully added a button role ${role.name} for ${emoji}! Use the slash command called \`button-role-panel\` in the channel you want the button role to be in.` })
            })
        } else if(options === 'remove') {
            if(!buttonRole) return interaction.editReply({ content: `Please provide a role.`})
            
            let role = interaction.guild.roles.cache.get(buttonRole.id)

            if(!role) return interaction.editReply({ content: `Please provide an existing button role.` })

            Schema.findOne({ Guild: interaction.guild.id }, async(err, data) => {
                if(!data) return interaction.editReply({ content: `There are no button roles yet. Use the \`button-role\` command to add some button roles.` })

                let array = []
                Object.keys(data.Roles).map((value, index) => {
                    const buttonRole = interaction.guild.roles.cache.get(data.Roles[value][0])
                    
                    array.push({ id: buttonRole, emoji: value })
                })

                if(array.find(r => r.id === role)) {
                    if(Object.keys(data.Roles).length === 1) {
                        await Schema.findOneAndDelete({ Guild: interaction.guild.id }, data);
                    } else {
                        delete data.Roles[array.find(r => r.id === role).emoji]

                        await Schema.findOneAndUpdate({ Guild: interaction.guild.id }, data).then(() => {
                            try {
                                interaction.guild.channels.cache.get(data.Channel).messages.fetch(data.Message)
                                .then(message => {
                                    
                                    if(data.Channel) {
                                        const mapped = Object.keys(data.Roles)
                                        .map((value, index) => {
                                            const role = interaction.guild.roles.cache.get(data.Roles[value][0])
                            
                                            return `${index + 1}) Click ${data.Roles[value][1].raw} to receive the ${role} role.`;
                                        }).join("\n\n");
                                        
                                        const embed = new EmbedBuilder().setTitle('Button Roles').setColor('Blurple').setDescription(mapped)
                    
                                        const row = new ActionRowBuilder()
                        
                                        Object.values(data.Roles).map((val) => {
                                            row.addComponents(
                                                new ButtonBuilder()
                                                .setCustomId(val[0])
                                                .setLabel(interaction.guild.roles.cache.get(val[0]).name)
                                                .setStyle('Primary')
                                                .setEmoji(val[1].id ?? val[1].raw)
                                            )
                                        })
                            
                                        message.edit({ embeds: [embed], components: [row] })
                                    }

                                    const row2 = new ActionRowBuilder()
                                    row2.addComponents(
                                        new ButtonBuilder()
                                        .setStyle('Link')
                                        .setLabel(`View Message`)
                                        .setURL(message.url)
                                    )
                                    
                                    interaction.followUp({ content: `I have successfully removed the button role for the ${role.name} role.`, components: [row2] })
                                })
                            } catch(err) {
                            }
                        })
                    }
                } else return interaction.editReply({ content: `That button role does not exist.`})
            })
        } else if(options === 'delete') {
            Schema.findOne({ Guild: interaction.guild.id }, async(err, data) => {
                if(data) {
                    await Schema.findOneAndDelete({ Guild: interaction.guild.id }, data);
                }
            })
    
            interaction.followUp({ content: `I have successfully deleted the current button roles.`})
        } else if(options === 'panel') {
            if(!buttonRoleChannel) return interaction.editReply('You need to specify a channel.')

            const channel = interaction.guild.channels.cache.get(buttonRoleChannel.id)
        
            if(channel.type == "GUILD_VOICE") {
                return interaction.editReply({ content: `Please choose a text channel.` })
            }
    
            try {
                Schema.findOne({ Guild: interaction.guild.id }, async(err, data) => {
                    if(!data) return interaction.editReply({ content: `There are no button roles yet. Use the \`button-role\` command to add some button roles.` })
                    const mapped = Object.keys(data.Roles)
                    .map((value, index) => {
                        const role = interaction.guild.roles.cache.get(data.Roles[value][0])
        
                        return `${index + 1}) Click ${data.Roles[value][1].raw} to receive the ${role} role.`;
                    }).join("\n\n");
    
                    const embed = new EmbedBuilder().setTitle('Button Roles').setColor('Blurple').setDescription(mapped)
    
                    const row = new ActionRowBuilder()
    
                    Object.values(data.Roles).map((val) => {
                        row.addComponents(
                            new ButtonBuilder()
                            .setCustomId(val[0])
                            .setLabel(interaction.guild.roles.cache.get(val[0]).name)
                            .setStyle('Primary')
                            .setEmoji(val[1].id ?? val[1].raw)
                        )
                    })
        
                    channel.send({ embeds: [embed], components: [row] })
                    .then((msg) => {
                        data.Message = msg.id
                        data.Channel = msg.channel.id
                        data.save()

                        const row2 = new ActionRowBuilder()
                        row2.addComponents(
                            new ButtonBuilder()
                            .setStyle('Link')
                            .setLabel(`View Message`)
                            .setURL(msg.url)
                        )

                        interaction.followUp({ content: `I have sent the button roles.`, components: [row2] })
                    })
                })
            } catch(error) {
                console.log(error)
                interaction.followUp({ content: `An error occured while runnning this command! ERROR: \`\`\`${error}\`\`\`` })
            }
        } else {
            Schema.findOne({ Guild: interaction.guild.id }, async(err, data) => {
                if(!data) return interaction.editReply({ content: `There are no button roles yet. Use the \`button-role\` command to add some reaction roles.` })

                if(!data.Channel) return interaction.editReply({ content: `An error occured while updating the button role message.` })

                try {
                    interaction.guild.channels.cache.get(data.Channel).messages.fetch(data.Message)
                    .then(message => {
                        
                        const mapped = Object.keys(data.Roles)
                        .map((value, index) => {
                            const role = interaction.guild.roles.cache.get(data.Roles[value][0])
            
                            return `${index + 1}) Click ${data.Roles[value][1].raw} to receive the ${role} role.`;
                        }).join("\n\n");
                        
                        const embed = new EmbedBuilder().setTitle('Button Roles').setColor('Blurple').setDescription(mapped)
    
                        const row = new ActionRowBuilder()
        
                        Object.values(data.Roles).map((val) => {
                            row.addComponents(
                                new ButtonBuilder()
                                .setCustomId(val[0])
                                .setLabel(interaction.guild.roles.cache.get(val[0]).name)
                                .setStyle('Primary')
                                .setEmoji(val[1].id ?? val[1].raw)
                            )
                        })
            
                        message.edit({ embeds: [embed], components: [row] })

                        const row2 = new ActionRowBuilder()
                        row2.addComponents(
                            new ButtonBuilder()
                            .setStyle('Link')
                            .setLabel(`View Message`)
                            .setURL(message.url)
                        )

                        interaction.followUp({ content: `I have edited the button roles.`, components: [row2] })
                    })
                } catch(err) {
                    interaction.editReply({ content: `I couldn't find the button role message.` })
                }
            })
        }
    }
}
