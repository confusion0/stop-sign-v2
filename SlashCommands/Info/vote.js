const { SelectMenuBuilder, ActionRowBuilder, ButtonBuilder, EmbedBuilder, Client, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js')
const ms = require('ms')

module.exports = {
    name: 'vote',
    type: ApplicationCommandType.ChatInput,
    description: 'Sends the vote info!',
    cooldown: 5000,
    reqPerm: "NONE",
    args: "",

    /**
     * @param {Client} client
     * @param {CommandInteraction} message
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        const embed = new EmbedBuilder()
        .setTitle('Vote for Stop Sign')
        .setDescription('All votes are appreciated!')
        .setColor('Blurple')

        const date = await client.uData.get(`${interaction.user.id}:top.gg`)

        const row = new ActionRowBuilder()
        if(date && date > Date.now()) {
            row.addComponents(
                new ButtonBuilder()
                .setStyle('Secondary')
                .setCustomId('topgg')
                .setLabel(`Top.gg (${ms(date - Date.now())})`)
                .setDisabled(true),
                new ButtonBuilder()
                .setStyle('Link')
                .setLabel('dbl.com')
                .setURL('https://discordbotlist.com/bots/823568726372253716')
            )
        } else {
            row.addComponents(
                new ButtonBuilder()
                .setStyle('Link')
                .setLabel(`Top.gg`)
                .setURL('https://top.gg/bot/823568726372253716/vote'),
                new ButtonBuilder()
                .setStyle('Link')
                .setLabel('dbl.com')
                .setURL('https://discordbotlist.com/bots/823568726372253716')
            )
        }
        interaction.followUp({ embeds: [embed], components: [row] })
    }
}