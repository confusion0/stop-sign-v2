const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js')
const nekoClient = require('nekos.life');
let neko = new nekoClient();

module.exports = {
    name: 'woof',
    type: ApplicationCommandType.ChatInput,
    description: 'Shows a random image of a dog!',
    cooldown: 5000,
    reqPerm: "NONE",
    args: "",
    
    /**
     * @param {Client} client
     * @param {CommandInteraction} message
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {

        let img = (await neko.sfw.woof()).url;

        const embed = new EmbedBuilder()
        .setColor('Blurple')
        .setImage(img)

        interaction.followUp({ embeds: [embed] })
    }
}