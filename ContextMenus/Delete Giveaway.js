const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: "Delete Giveaway",
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
        
        client.giveawaysManager.delete(giveaway.messageId)
        .then(() => {
            interaction.followUp({ content: `The giveaway has been deleted.`});
        })
        .catch((error) => {
            interaction.followUp({ content: `An error occured while deleting this giveaway. \nIt is possible that you tried to delete a giveaway that has already ended.` })
        });
    }  
}