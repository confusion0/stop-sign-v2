const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require('discord.js')
const client = require('../index')

client.giveawaysManager.on('giveawayEnded', (giveaway, winners) => {

    const winnerEmbed = new EmbedBuilder()
    .setColor('GREEN')
    .setTitle('You Won!')
    .setURL(giveaway.messageURL)
    .setDescription(`🎉 Congratulations! You won the giveaway for **${giveaway.prize}**!`)
    .setTimestamp()

    const hostEmbed = new EmbedBuilder()
    .setColor('Blurple')
    .setTitle(`Your giveaway for ${giveaway.prize} has ended!`)
    .setURL(giveaway.messageURL)
    .setDescription(
        `You have ${giveaway.winnerCount} winner(s) for your giveaway!
        ${winners.map(winner => `\`${winners.indexOf(winner)+1}\` <@${winner.id}> (${winner.id})`).join('\n')}`
    )

    const row = new ActionRowBuilder()
    row.addComponents(
        new ButtonBuilder()
        .setStyle('LINK')
        .setLabel(`View Message`)
        .setURL(giveaway.messageURL)
    )

    winners.forEach(winner => {
        winner.send({ embeds: [winnerEmbed], components: [row] }).catch(() => {});
    })

    client.users.cache.get(giveaway.extraData.host).send({ embeds: [hostEmbed], components: [row] }).catch(() => {});
})
