const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandOptionType, ApplicationCommandType } = require('discord.js')
const Schema = require('../../models/warns')
const { v4: uuidv4 } = require('uuid');

module.exports = {
    name: 'warns',
    type: ApplicationCommandType.ChatInput,
    description: 'Add, remove, delete, or list the warns from a user!',
    options: [
        {
            name: 'options',
            description: "The options for this command",
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
                    name: 'List',
                    value: 'list'
                }
            ],
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: 'member',
            description: "The member that you want to execute this command on",
            type: ApplicationCommandOptionType.User,
            required: true
        },
        {
            name: 'reason',
            description: "The reason for the warn",
            type: ApplicationCommandOptionType.String,
            required: false
        },
        {
            name: 'warn-id',
            description: "The ID of the warn you want to remove",
            type: ApplicationCommandOptionType.String,
            required: false
        }
    ],
    cooldown: 5000,
    reqPerm: "KICK_MEMBERS",
    args: "<options> <member> [reason]",

    /**
     * @param {Client} client
     * @param {CommandInteraction} message
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        let options = interaction.options.getString('options')
        let member = interaction.options.getMember('member')
        let reason = interaction.options.getString('reason')
        let warnId = interaction.options.getString('warn-id')

        const guildMember = interaction.guild.members.cache.get(member.id)

        if(options === 'add') {

            if(guildMember.roles.highest.position >= interaction.member.roles.highest.position) {
                return interaction.editReply("You cannot warn a member that has a higher or equal role to you.")
            }

            if(!reason) {
                return interaction.editReply("You need to provide a reason for the warn.")
            }

            Schema.findOne({ Guild: interaction.guild.id, User: guildMember.user.id }, async(err, data) => {
                if(data) {
    
                    if(3 <= Object.keys(data.Cases).length) return interaction.editReply({ content: `This user already has 3 warns.`})

                    const id = uuidv4()

                    data.Cases[id] = {
                        Moderator: interaction.user.id,
                        Reason: reason,
                        Date: Math.floor(Date.now()/1000)
                    }

                    await Schema.findOneAndUpdate({ Guild: interaction.guild.id, User: guildMember.user.id }, data)
                } else {
                    const id = uuidv4()

                    await new Schema({
                        Guild: interaction.guild.id,
                        User: guildMember.user.id,
                        Cases: {
                            [id]: {
                                Moderator: interaction.user.id,
                                Reason: reason,
                                Date: Math.floor(Date.now()/1000)
                            }
                        }
                    }).save()
                }

                interaction.followUp({ content: `I have successfully warned ${guildMember.user.username}` })
            })
        } else if(options === 'remove') {
            if(guildMember.roles.highest.position >= interaction.member.roles.highest.position) {
                return interaction.editReply("You cannot remove a warn warn from a member that has a higher or equal role to you.")
            }

            if(!warnId) return interaction.editReply("You need to provide a warn ID.")

            Schema.findOne({ Guild: interaction.guild.id, User: guildMember.user.id }, async(err, data) => {
                if(!data) return interaction.editReply("This user has no warns.")

                if(!data.Cases[warnId]) return interaction.editReply("This warn does not exist.")

                if(Object.keys(data.Cases).length === 1) {
                    await Schema.findOneAndDelete({ Guild: interaction.guild.id, User: guildMember.user.id }, data);
                } else {
                    delete data.Cases[warnId]

                    await Schema.findOneAndUpdate({ Guild: interaction.guild.id, User: guildMember.user.id }, data)
                }

                interaction.followUp({ content: `I have successfully removed the warn from ${guildMember.user.username}.` })
            })
        } else if(options === 'delete') {
            Schema.findOne({ Guild: interaction.guild.id, User: guildMember.user.id }, async(err, data) => {
                if(data) {
                    await Schema.findOneAndDelete({ Guild: interaction.guild.id, User: guildMember.user.id }, data);
                }
            })

            interaction.followUp({ content: `I have successfully deleted all of ${guildMember.user.username}'s warns.` })
        } else {
            Schema.findOne({ Guild: interaction.guild.id, User: guildMember.user.id }, async(err, data) => {
                if(!data) return interaction.editReply("This user has no warns.")

                const embed = new EmbedBuilder()
                .setColor('Blurple')
                
                Object.keys(data.Cases).map((value, index) => {
                    embed.addFields([{
                        name: `Warn #${index + 1}`, 
                        value: `
                        ID: \`${value}\`
                        Moderator: <@${data.Cases[value].Moderator}>
                        Reason: ${data.Cases[value].Reason}
                        Date: <t:${data.Cases[value].Date}>
                        `,
                        inline: true
                    }])
                })

                interaction.followUp({ embeds: [embed]})
            })
        }
    }
}
