const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: 'giveaway-pause',
    type: ApplicationCommandType.ChatInput,
    description: 'Pause a giveaway on the server!',
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

        client.giveawaysManager.pause(giveaway.messageId)
        .then(() => {
            // Success message
            interaction.followUp({ content: `The giveaway has been successfully paused.` });
        })
        .catch((e) => {
            interaction.followUp({ content: `An error occured while pausing the giveaway. \nIt is possible that you tried to pause a giveaway that has already ended.` });
        });
    }
}
