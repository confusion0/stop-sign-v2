const client = require("../index");
const { AutoPoster } = require('topgg-autoposter')

client.on("ready", async () => {
    console.log(`${client.user.tag} is up and ready to go.`)
    
    //Top.gg statistics poster
    const autoposter = new AutoPoster(client.config.topggToken, client)

    autoposter.on('posted', () => {
        console.log('Posted statistics to Top.gg')
    })

    //Client status
    status(client)
});

function status(client){

    try {
        const promises = [
            client.shard.fetchClientValues('guilds.cache.size'),
            client.shard.broadcastEval(client  => client.guilds.cache.reduce((acc, guild) => acc + guild.members.memberCount, 0))
        ];
        return Promise.all(promises)
            .then(results => {
                const totalGuilds = results[0].reduce((acc, guildCount) => acc + guildCount, 0);
                const totalMembers = results[1].reduce((acc, memberCount) => acc + memberCount, 0);

                for(const shard of client.shard.ids) {
                    client.user.setPresence({
                        activities: [{ name: `#TeamSeas | #${shard} Shard` }],
                        status: 'dnd',
                        shardId: shard
                    })
                }                
            })
    } catch (e) {
        client.user.setPresence({
            activities: [{ name: `#TeamSeas | #0 Shard` }],
            status: 'dnd',
            shardId: 0
        })
    }
}
