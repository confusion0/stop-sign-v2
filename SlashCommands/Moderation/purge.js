const { CommandInteraction, Client, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js')
const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

module.exports = {
    name: 'purge',
    type: ApplicationCommandType.ChatInput,
    description: 'Purge some messages!',
    options: [
        {
            name: 'options',
            description: 'The options for the purge command',
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                {
                    name: 'All',
                    value: 'all'
                },
                {
                    name: 'Bots',
                    value: 'bots'
                },
                {
                    name: 'Users',
                    value: 'users'
                },
                {
                    name: 'Embeds',
                    value: 'embeds'
                },
                {
                    name: 'Files',
                    value: 'files'
                },
                {
                    name: 'Mentions',
                    value: 'mentions'
                }
            ]
        },
        {
            name: 'amount',
            description: "The amount of messages that you want to delete",
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: 'channel',
            description: "The channel that you want to purge messages in",
            type: ApplicationCommandOptionType.Channel,
            required: false,
            channelTypes: ['GUILD_TEXT']
        }
    ],
    cooldown: 10000,
    reqPerm: "MANAGE_MESSAGES",
    args: "[options] <amount> [channel]",

    /**
     * @param {Client} client
     * @param {CommandInteraction} message
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        let [ options, amount, channel ] = args 

        let purgeChannel = interaction.guild.channels.cache.get(channel) || interaction.channel

        if(isNaN(amount) || parseInt(amount) > 100 || parseInt(amount) <= 0) return interaction.editReply({ content: `You must provide a number value from between 1 and 100`})

        if(purgeChannel.type == 'GUILD_VOICE'){
            return interaction.editReply({ content: `Please choose a text channel.` })
        }

        try {
            let messages = await purgeChannel.messages.fetch({
                limit: amount
            });

            let data = []
            if(options === 'all') {
                messages.forEach(async (message) => {
                    data.push(message)
                })
            } else if(options === 'bots') {
                messages.forEach(async (message) => {
                    if(message.author.bot) data.push(message)
                })
            } else if(options === 'users') {
                messages.forEach(async (message) => {
                    if(!message.author.bot) data.push(message)
                })
            } else if(options === 'embeds') {
                messages.forEach(async (message) => {
                    if(message.embeds.length) data.push(message)
                })
            } else if(options === 'files') {
                messages.forEach(async (message) => {
                    if(message.attachments.first()) data.push(message)
                })
            } else {
                messages.forEach(async (message) => {
                    if(message.mentions.members.first() || message.mentions.users.first() || message.mentions.roles.first()) data.push(message)
                })
            }
            
            let deletedMessages = await purgeChannel.bulkDelete(data, true);

            let results = {}
            for (const [, deleted] of deletedMessages) {
                const user = `${deleted.author.username}#${deleted.author.discriminator}`;
                if (!results[user]) results[user] = 0;
                results[user]++;
            }

            const userMessageMap = Object.entries(results);
            const finalResult = `${deletedMessages.size} message${deletedMessages.size > 1 ? 's' : ''} were removed.\n\n${userMessageMap.map(([user, messages]) => `**${user}** : ${messages}`).join('\n')}`;

            await interaction.channel.send({ content: finalResult }).then(async (msg) => {
                await sleep(7500)

                await msg.delete()
            })
        } catch(err) {
            if (String(err).includes('Unknown Message')) return console.log('ERROR: Unknown Message');
        }
    }
}
