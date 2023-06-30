const { CommandInteraction, ActionRowBuilder, ButtonBuilder, Client, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js')

module.exports = {
    name: 'invite',
    type: ApplicationCommandType.ChatInput,
    description: 'Sends the bot invite link!',
    cooldown: 5000,
    reqPerm: "NONE",
    args: "",

    /**
     * @param {Client} client
     * @param {CommandInteraction} message
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        const button = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
            .setStyle("Link")
            .setURL("https://discord.com/api/oauth2/authorize?client_id=823568726372253716&permissions=8&scope=bot%20applications.commands")
            .setLabel("Invite Link")
        )
        
        interaction.followUp({ content: `Invite me to your server.`, components: [button] });
    }
}