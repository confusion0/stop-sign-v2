const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: "End Giveaway",
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
        
        client.giveawaysManager.edit(giveaway.messageId, {
            setEndTimestamp: Date.now()
        })
        .then(() => {
            interaction.followUp({ content: 'The giveaway will end in less than a few seconds.' });
        })
        .catch((e) => {
            if(e.startsWith(`Giveaway with message ID ${giveaway.messageId} has already ended.`)){
                interaction.followUp({ content: `This giveaway has already ended. You cannot end a giveaway after it has ended.` });
            } else {
                interaction.followUp({ content: `An error occured while ending the giveaway. \nIt is possible that you tried to end a giveaway that has already ended.` });
            }
        });
    }  
}