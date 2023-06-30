const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: 'giveaway-end',
    type: ApplicationCommandType.ChatInput,
    description: 'End an active giveaway from the server!',
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
