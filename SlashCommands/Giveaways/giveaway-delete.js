const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: 'giveaway-delete',
    type: ApplicationCommandType.ChatInput,
    description: 'Delete an active giveaway from the server!',
    options: [
        {
            name: 'message-id',
            description: "The giveaway message ID",
            type: ApplicationCommandOptionType.String,
            required: true
        },
    ],
    cooldown: 10000,
    reqPerm: "MANAGE_GUILD",
    args: "<message-id>",
    
    /**
     * @param {Client} client
     * @param {CommandInteraction} message
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {

        let [ messageID ] = args

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
