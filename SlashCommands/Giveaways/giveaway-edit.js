const ms = require('ms')
const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: 'giveaway-edit',
    type: ApplicationCommandType.ChatInput,
    description: 'Edit an active giveaway on the server!',
    options: [
        {
            name: 'message-id',
            description: "The giveaway message ID",
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: 'giveaway-prize',
            description: 'The new giveaway prize for the giveaway',
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: 'time',
            description: 'The amount of time you want to add to the giveaway duration',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],
    cooldown: 20000,
    reqPerm: "MANAGE_GUILD",
    args: "<message-id> <giveaway-prize> <time>",

    /**
     * @param {Client} client
     * @param {CommandInteraction} message
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {

        let [ messageID, giveawayPrize, giveawayDuration ] = args

        let giveaway = client.giveawaysManager.giveaways.find((g) => g.messageId === messageID && g.guildId === interaction.guild.id);

        if(!giveaway) {
            return interaction.editReply({ content: `I was unable to find to find a giveaway with the message ID: \`` + messageID + '\`'  })
        }

        if(isNaN(ms(giveawayDuration))) {
            return interaction.editReply({ content: `You have to specify a valid duration.` })
        }

        client.giveawaysManager.edit(giveaway.messageId, {
            addTime: parseInt(ms(giveawayDuration)),
            newPrize: giveawayPrize
        })
        .then(() => {
            interaction.followUp({ content: `The giveaway has been edited successfully.`});
        })
        .catch((error) => {
            if(e.startsWith(`Giveaway with message ID ${giveaway.messageId} has already ended.`)){
                interaction.followUp({ content: `This giveaway has already ended. You cannot edit a giveaway after it has ended.` });
            } else {
                interaction.followUp({ content: `An error occured while editing this giveaway. \nIt is possible that you tried to edit a giveaway that has already ended.` })
            }
        });
    }
}
