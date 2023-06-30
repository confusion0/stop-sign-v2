const { CommandInteraction, Client, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js')
const unorm = require('unorm');
const limax = require('limax');

module.exports = {
    name: 'decancer',
    type: ApplicationCommandType.ChatInput,
    description: 'Decancer a member!',
    options: [
        {
            name: 'member',
            description: "The member that you want to decancer",
            type: ApplicationCommandOptionType.User,
            required: true
        },
    ],
    cooldown: 5000,
    reqPerm: "MANAGE_NICKNAMES",
    args: "<member>",

    /**
     * @param {Client} client
     * @param {CommandInteraction} message
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        let member = interaction.options.getMember('member')

        var dcuser = interaction.guild.members.cache.get(member.id)

        function decancer(text) {
            text = unorm.nfkd(text);
            text = limax(text, {
                replacement: ' ',
                tone: false,
                separateNumbers: false,
                maintainCase: true,
                
            });
            return text;
        }

        var decancered = decancer(dcuser.displayName)
        if (decancered === '') {
            decancered = 'decancered nickname'
        }

        return interaction.followUp({ content: `I have changed \`${dcuser.displayName}\` to \`${decancered}\`.` }).then(dcuser.setNickname(decancered))
    }
}