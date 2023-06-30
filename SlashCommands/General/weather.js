const { CommandInteraction, Client, EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js')
const weather = require('weather-js')

module.exports = {
    name: 'weather',
    type: ApplicationCommandType.ChatInput,
    description: 'The weather forecast!',
    options: [
        {
            name: 'degree',
            description: 'The option to choose between a degree type',
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                {
                    name: 'Celsius',
                    value: 'C'
                },
                {
                    name: 'Farenheit',
                    value: 'F'
                }
            ]
        },
        {
            name: 'location',
            description: 'The location you want the weather forecast for',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],
    cooldown: 5000,
    reqPerm: "NONE",
    args: "<degree> <location>",

    /**
     * @param {Client} client
     * @param {CommandInteraction} message
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        let [ degree, location ] = args

        weather.find({ search: location, degreeType: degree }, function(error, result) {

            if(result === undefined || result.length === 0) return interaction.editReply({ content: `The location you provided is not a valid location.` })

            if(error) return interaction.editReply({ content: `An error occurred! ERROR: \`\`\`${error}\`\`\`` })

            var current = result[0].current;
            var location = result[0].location;

            const embed = new EmbedBuilder()
            .setDescription(`**${current.skytext}**`)
            .setTitle(`Weather forecast for ${current.observationpoint}`)
            .setThumbnail(current.imageUrl)
            .setColor('Blurple')
            .addFields([
                { name: 'Timezone', value: `UTC${location.timezone}`, inline: true },
                { name: 'Degree Type', value: degree, inline: true },
                { name: 'Temperature', value: `${current.temperature}°`, inline: true },
                { name: 'Wind', value: current.winddisplay, inline: true },
                { name: 'Feels like', value: `${current.feelslike}°`, inline: true },
                { name: 'Humidity', value: `${current.humidity}%`, inline: true },
            ])

            return interaction.followUp({ embeds: [embed] })
        })
    }
}