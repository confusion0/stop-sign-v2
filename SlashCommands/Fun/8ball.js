const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js')

module.exports = {
    name: '8ball',
    type: ApplicationCommandType.ChatInput,
    description: 'Ask the magic 8ball a question!',
    options: [
        {
            name: 'question',
            description: "The question that you want to ask the magic 8ball",
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],
    cooldown: 5000,
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
        
        let replies = [
            "I think so",
            "Yes",
            "I guess",
            "Yeah absolutely",
            "Maybe",
            "Possibly",
            "No",
            "Most likely",
            "No Way!",
            "I dont know",
            "Without a doubt",
            "Indeed",
            "For sure",
        ];
      
        let result = Math.floor(Math.random() * replies.length);
        
        const embed = new EmbedBuilder()
        .setColor('Blurple')
        .setTitle('🎱 **Magic 8ball** ✨')
        .addFields([
            { name: 'Your question...', value: question },
            { name: 'The 8ball\'s answer...', value: replies[result]}
        ])
          
        interaction.followUp({
            embeds: [embed]
        })
    }
}