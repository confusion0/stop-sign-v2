const { EmbedBuilder } = require('discord.js')
const client = require('../index')

client.giveawaysManager.on('giveawayReactionAdded', (giveaway, member, reaction) => {
    if(giveaway.extraData.roleRequirement && !member.roles.cache.get(giveaway.extraData.roleRequirement)) {
        reaction.users.remove(member.user)

        const denied = new EmbedBuilder()
        .setColor('RED')
        .setTitle('You cannot join this giveaway')
        .setDescription(`❌ You need the ${reaction.message.guild.roles.cache.get(giveaway.extraData.roleRequirement).name} role to join this giveaway.`)
        .setTimestamp()

        member.send({ embeds: [denied] }).catch(() => {});
    } else {
        
        const approved = new EmbedBuilder()
        .setColor('GREEN')
        .setTitle('You have joined the giveaway')
        .setDescription(`🎉 Your entry into this giveaway has been approved!`)
        .setTimestamp()

        member.send({ embeds: [approved] }).catch(() => {});
    }
})