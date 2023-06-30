const { EmbedBuilder, CommandInteraction, Client, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js')
const axios = require('axios');

module.exports = {
    name: 'dogfact',
    type: ApplicationCommandType.ChatInput,
    description: 'Sends a dog fact and an image!',
    cooldown: 10000,
    reqPerm: "NONE",
    args: "",

    /**
     * @param {Client} client
     * @param {CommandInteraction} message
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        const url = "https://some-random-api.ml/img/dog";
        const facts = "https://some-random-api.ml/facts/dog"

        let image, response;
        let fact, responses;
        try {
            response = await axios.get(url);
            image = response.data;

            responses = await axios.get(facts)
            fact = responses.data

        } catch (e) {
            return interaction.editReply({ content: `An error occured, please try again.` })
        }

        const embed = new EmbedBuilder()
        .setTitle(`Random Dog, Image, and Fact`)
        .setColor('Blurple')
        .setDescription(fact.fact)
        .setImage(image.link)

        interaction.followUp({ 
            embeds: [embed]
        });
    }
}