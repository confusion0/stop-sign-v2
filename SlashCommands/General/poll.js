const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js')

module.exports = {
    name: 'poll',
    type: ApplicationCommandType.ChatInput,
    description: 'Create a poll!',
    options: [
        {
            name: 'question',
            description: "The question for the poll",
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],
    cooldown: 20000,
    reqPerm: "NONE",
    args: "<question>",

    /**
     * @param {Client} client
     * @param {CommandInteraction} message
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        let [ question ] = args
        if(!question.endsWith("?")) question = question+="?"

        let embedPoll = new EmbedBuilder()
        .setTitle(':bar_chart: Poll Time!')
        .setDescription(`► Question: ${question}`)
        .setColor('Blurple')
        .setTimestamp()

        let interactionEmbed = await interaction.followUp({ embeds: [embedPoll] });
        await interactionEmbed.react('🔼')
        await interactionEmbed.react('🔽')
    }
}