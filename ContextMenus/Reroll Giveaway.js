const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: "Reroll Giveaway",
    type: ApplicationCommandType.Message,
    cooldown: 5000,
    reqPerm: "MANAGE_GUILD",
    args: "<message-id>",

    /**
     * @param {Client} client
     * @param {ContextMenuInteraction} message
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        
        const msg = await interaction.channel.messages.fetch({ 
            message: interaction.targetId
        })

        let messageID = msg.id

        let giveaway = client.giveawaysManager.giveaways.find((g) => g.messageId === messageID && g.guildId === interaction.guild.id);

        if(!giveaway) {
            return interaction.editReply({ content: `I was unable to find to find a giveaway with the message ID: \`` + messageID + '\`'  })
        }

        client.giveawaysManager.reroll(giveaway.messageId, {
            messages: {
                congrat: `🎉 New winner(s): ${giveaway.winners}! Congratulations, you won **${giveaway.prize}**!\n${giveaway.messageURL}`,
                error: `No valid participations or no new winner(s) can be chosen!`
            }
        })
        .then(() => {
            // Success message
            interaction.followUp({ content: `The giveaway has been successfully re-rolled.` });
        })
        .catch((e) => {
            if(e.startsWith(`Giveaway with message ID ${giveaway.messageId} is not ended.`)){
                interaction.followUp({ content: `This giveaway has not ended yet. You cannot re-roll a giveaway before it has ended.` });
            } else {
                interaction.followUp({ content: `An error occured while re-rolling the giveaway. \nIt is possible that you tried to re-roll a giveaway before it has ended.` });
            }
        });
    }  
}