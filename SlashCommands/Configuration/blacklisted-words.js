const { CommandInteraction, Client, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js')
const { blacklistedWords } = require('../../collections/blacklist');
const Schema = require('../../models/blacklist');
const { ComponentType, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: 'blacklisted-words',
    type: ApplicationCommandType.ChatInput,
    description: 'Add, remove, delete or display the blacklisted words!',
    options: [
        {
            name: 'options',
            description: "The options to add, remove, delete or display the blacklisted words",
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
                },
                {
                    name: 'Punishment',
                    value: 'Punishment'
                }
            ]
        },
        {
            name: 'word',
            description: "The word you want to add or remove",
            type: ApplicationCommandOptionType.String,
            required: false
        }
    ],
    cooldown: 5000,
    reqPerm: "ADMINISTRATOR",
    args: "<options> [word]",

    /**
     * @param {Client} client
     * @param {CommandInteraction} message
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        let [ options, word ] = args 
        const getblacklistedWords = blacklistedWords.get(interaction.guild.id);
        const guild = { Guild: interaction.guild.id }

        if (options.toLowerCase() === 'add') {
            if(!word) return interaction.editReply({ content: `Please provide a word.` })

            if(getblacklistedWords && getblacklistedWords.length == 15) return interaction.editReply({ content: `You can only have 15 or less blacklisted words` })

            Schema.findOne(guild, async (err, data) => {
                if(data) {
                    if(data.Words.includes(word)) return interaction.editReply({ content: `That word already exists in the database.` })
                    data.Words.push(word)
                    await data.save()
                    blacklistedWords.set(interaction.guild.id, [word])
                } else {
                    await new Schema({
                        Guild: interaction.guild.id,
                        Words: word
                    }).save()
                    blacklistedWords.set(interaction.guild.id, [word])
                }
            })

            interaction.followUp({ content: `${client.emotes.add} ${word} is now blacklisted.` })
        } else if(options.toLowerCase() === 'remove') {
            if(!word) return interaction.editReply({ content: `Please provide a word.` })

            Schema.findOne(guild, async (err, data) => {
                if(!data) return interaction.editReply({ content: `There are no blacklisted words to remove.` })

                if(!data.Words.includes(word)) return interaction.editReply({ content: `That word does not exist in the database.` })

                const filtered = data.Words.filter((target) => target !== word)

                if(getblacklistedWords && getblacklistedWords.length == 1) {
                    await Schema.findOneAndDelete({ Guild: interaction.guild.id }, data)

                    blacklistedWords.delete(interaction.guild.id)
                } else {
                    await Schema.findOneAndUpdate({
                        Guild: interaction.guild.id,
                        Words: filtered
                    })
                    blacklistedWords.set(interaction.guild.id, filtered)
                }
            })

            interaction.followUp({ content: `${client.emotes.remove} I have removed ${word} from the database.` })
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
    
            interaction.followUp({ content: `I have successfully deleted the current blacklisted words data.`})
        } else if(options.toLowerCase() === 'display') {
            Schema.findOne(guild, async (err, data) => {
                if (!data) return interaction.editReply({ content: `There is no data to be displayed.` })
                
                const embed = new EmbedBuilder()
                .setColor('Blurple')
                .setTitle('Blacklisted Words')
                .setDescription(`||${data.Words.join(', ')}||`)

                interaction.followUp({ embeds: [embed] })
            })
        } else {
            Schema.findOne({ Guild: interaction.guild.id }, async(err, data) => {

                if(!data) return interaction.editReply({ content: `There is no data yet.` })

                const row = new ActionRowBuilder()
                row.addComponents(
                    new ButtonBuilder()
                    .setCustomId('Delete')
                    .setLabel('Delete')
                    .setStyle('Primary'),
                    new ButtonBuilder()
                    .setCustomId('Timeout')
                    .setLabel('Timeout')
                    .setStyle('Primary'),
                    new ButtonBuilder()
                    .setCustomId('Kick')
                    .setLabel('Kick')
                    .setStyle('Primary'),
                    new ButtonBuilder()
                    .setCustomId('Ban')
                    .setLabel('Ban')
                    .setStyle('Primary')
                )
                interaction.followUp({ 
                    content: `Please select the button with the punishment that you want to be executed when a blacklisted word has been said.`, 
                    components: [row]
                }).then((msg) => {

                    const row2 = new ActionRowBuilder()
                    row2.addComponents(
                        new ButtonBuilder()
                        .setCustomId('Delete')
                        .setLabel('Delete')
                        .setStyle('Primary')
                        .setDisabled(true),
                        new ButtonBuilder()
                        .setCustomId('Timeout')
                        .setLabel('Timeout')
                        .setStyle('Primary')
                        .setDisabled(true),
                        new ButtonBuilder()
                        .setCustomId('Kick')
                        .setLabel('Kick')
                        .setStyle('Primary')
                        .setDisabled(true),
                        new ButtonBuilder()
                        .setCustomId('Ban')
                        .setLabel('Ban')
                        .setStyle('Primary')
                        .setDisabled(true)
                    )
                
                    msg.awaitMessageComponent({ 
                        componentType: ComponentType.Button,
                        time: 30000,
                        filter: (i) => {
                            if(i.user.id === interaction.user.id) return true;
                            else return i.reply({
                                content: `Only **${interaction.user.tag}** can use these buttons.`,
                                ephemeral: true
                            }).catch(() => {});
                        }, 
                     })
                    .then(async i => {
                        
                        data.Punishment = i.customId

                        data.save()

                        msg.edit({ content: 'Interaction ended.', components: [row2] })
                        
                        i.reply({ content: `I have successfully set the punishment to ${i.customId.toLowerCase()}.` })
                    })
                    .catch((err) => {
                        console.log(err) 

                        msg.edit({ content: 'Interaction ended.', components: [row2] })

                        interaction.channel.send({ content: `You took too long to select a punishment.` })
                    })
                })
            })
        }
    }
}