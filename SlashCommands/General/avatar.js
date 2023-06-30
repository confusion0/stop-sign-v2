const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js')

module.exports = {
    name: 'avatar',
    type: ApplicationCommandType.ChatInput,
    description: 'Displays the avatar of a user!',
    options: [
        {
          name: 'format',
          description: "The format for the avatar to display in!",
          type: ApplicationCommandOptionType.String,
          required: true,
          choices: [
            {
              name: 'PNG',
              value: "png"
            },
            {
              name: 'GIF',
              value: "gif"
            },
            {
              name: 'JPG',
              value: "jpg"
            },
            {
              name: 'WEBP',
              value: "webp"
            }
          ]
        },
        {
          name: 'user',
          description: "The user that you want to display the avatar of",
          type: ApplicationCommandOptionType.User,
          required: false
        }
    ],
    cooldown: 5000,
    reqPerm: "NONE",
    args: "<format> [user]",

    /**
     * @param {Client} client
     * @param {CommandInteraction} message
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        const [ format, member ] = args

        const guildMember =  interaction.guild.members.cache.get(member) || interaction.member
        const embed = new EmbedBuilder()
          .setColor('Blurple')
          .setTitle(`${guildMember.user.username}'s Avatar`)
          .setDescription(
            `[Avatar Link](${guildMember.user.displayAvatarURL({
              size: 2048,
              dynamic: true,
              format: format,
            })})`
          )
          .setImage(guildMember.user.avatarURL({ size: 2048, dynamic: true, format: format }));

        const row = new ActionRowBuilder().addComponents([
            new ButtonBuilder()
            .setURL(guildMember.user.displayAvatarURL({ size: 2048, dynamic: true, format: "gif"}))
            .setLabel("Download")
            .setStyle("Link")
        ])
    
        interaction.editReply({ embeds: [embed], components: [row] });
    }
}