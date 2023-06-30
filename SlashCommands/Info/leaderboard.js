const Schema = require('../../models/experience')
const { ChannelPagination, NextPageButton, PreviousPageButton } = require("djs-button-pages");
const { CommandInteraction, Client, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js')
module.exports = {
    name: 'leaderboard',
    type: ApplicationCommandType.ChatInput,
    description: 'Sends the leveling leaderboard!',
    cooldown: 10000,
    reqPerm: "NONE",
    args: "",

    /**
     * @param {Client} client
     * @param {CommandInteraction} message
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        await Schema.findOne({ Guild: interaction.guild.id }, async(err, data) => {
            if(!data || !data.Users) return interaction.editReply({ content: `The server does not have any data.` })

            let levels = []
            Object.values(data.Users).map((val) => {

                levels.push({ level: val[1].Level, id: val[0] })
            })

            levels.sort(function(a, b) {
                return b.level - a.level
            })

            let index = 1
            if(levels.length > 10) {
                const chunks = convertChunk(levels, 10);
                const arry = [];
    
                for (chunk of chunks) {
                    const description = chunk.map((value) => `\`\`${index++}#\`\` <@${value.id}> - Level: ${value.level}`).join('\n')
            
                    arry.push(
                        new EmbedBuilder()
                        .setTitle('Level leaderboard')
                        .setDescription(description)
                        .setColor('Blurple')
                    )
                }

                const buttons = 
                [
                    new PreviousPageButton({custom_id: "prev_page", label: "Previous", style: ButtonStyle.Primary}),
                    new NextPageButton().setStyle({custom_id: "next_page", label: "Next", style: ButtonStyle.Primary}),
                ];
        
                const pagination = new ChannelPagination() //Create pagination.
                    .setButtons(buttons) //Insert buttons.
                    .setEmbeds(arry) //Add embeds.
                    .setTime(60000); //Set time.
        
                await pagination.send(interaction.channel);

                return interaction.followUp({ content: `Here is the level leaderboard.` })
            } else {

                let mapped = levels
                .map((value, index) => {
                    return `\`\`${index + 1}#\`\` <@${value.id}> - Level: ${value.level}`
                }).join('\n')

                const leaderboard = new EmbedBuilder()
                .setTitle('Level leaderboard')
                .setDescription(mapped)
                .setColor('Blurple')
            

                interaction.followUp({ embeds: [leaderboard] })
            }
        })
    }
}

function convertChunk(arr, size) {
    const array = [];
    for (let i = 0; i < arr.length; i+= size) {
        array.push(arr.slice(i, i+size))
    }
    return array;
}