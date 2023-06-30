const { EmbedBuilder, CommandInteraction, Client, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js')

module.exports = {
    name: 'invites',
    type: ApplicationCommandType.ChatInput,
    description: 'View the invites of a user!',
    options: [
        {
            name: 'user',
            type: ApplicationCommandOptionType.User,
            description: 'The user that you want to see the invites of',
            required: false
        }
    ],
    cooldown: 5000,
    reqPerm: "NONE",
    args: "[user]",

    /**
     * @param {Client} client
     * @param {CommandInteraction} message
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        let [ member ] = args;
        const user = interaction.guild.members.cache.get(member) || interaction.member

        let invites = await interaction.guild.invites.fetch();
        let userInv = invites.filter(u => u.inviter && u.inviter.id === user.id)

        if (userInv.size <= 0) {
            return interaction.followUp({ content: `${user} has \`0\` invites ` })
        }

        let invCodes = userInv.map(x => x.code).join(', ')
        let i = 0;
        userInv.forEach(inv => i += inv.uses);

        const tackerEmbed = new EmbedBuilder()
            .setTitle(`Invites of ${user.user.tag}`)
            .addFields([
                { name: 'User Invite', value: `${i}`},
                { name: 'Invite Codes:', value: `${invCodes}` }
            ])
            .setColor('Blurple')

        interaction.followUp({ embeds: [tackerEmbed] });
    }
}
