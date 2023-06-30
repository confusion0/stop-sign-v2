const ms = require('ms')
const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: 'giveaway-start',
    type: ApplicationCommandType.ChatInput,
    description: 'Start a giveaway!',
    options: [
        {
            name: 'channel',
            description: "The giveaway channel",
            type: ApplicationCommandOptionType.Channel,
            required: true,
            channelTypes: ['GUILD_TEXT']
        },
        {
            name: 'duration',
            description: "The giveaway duration",
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: 'winners',
            description: "The number of winners",
            type: ApplicationCommandOptionType.Integer,
            required: true
        },
        {
            name: 'prize',
            description: "The giveaway prize",
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: 'required-role',
            description: "The required role for the giveaway",
            type: ApplicationCommandOptionType.Role,
            required: false
        },
        {
            name: 'bonus-role',
            description: "The bonus role for the giveaway",
            type: ApplicationCommandOptionType.Role,
            required: false
        },
        {
            name: 'bonus-entries',
            description: "The bonus entries for the giveaway",
            type: ApplicationCommandOptionType.Integer,
            required: false
        }
    ],
    cooldown: 20000,
    reqPerm: "MANAGE_GUILD",
    args: "<channel> <duration> <winners> <prize> [required-role] [bonus-role] [bonus-entries]",

    /**
     * @param {Client} client
     * @param {CommandInteraction} message
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        
        let [ channel, giveawayDuration, giveawayNumberWinners, giveawayPrize ] = args

        let giveawayChannel = interaction.guild.channels.cache.get(channel)
        let requiredRole = interaction.guild.roles.cache.get(interaction.options.getRole('required-role')?.id)
        let bonusRole = interaction.guild.roles.cache.get(interaction.options.getRole('bonus-role')?.id)
        let bonusEntries = interaction.options.getInteger('bonus-entries')  || 2

        if(isNaN(ms(giveawayDuration))) {
            return interaction.editReply({ content: `Please specify a valid duration.`})
        }

        if(isNaN(giveawayNumberWinners) || parseInt(giveawayNumberWinners) <= 0) {
            return interaction.editReply({ content: `Please specify a valid number of winners.` })
        }

        if(isNaN(bonusEntries) || parseInt(bonusEntries) <= 1 || parseInt(bonusEntries) > 2) {
            return interaction.editReply({ content: `Please specify a valid number of bonus entries that is above the number 1 and is 2 or below.` })
        }

        let inviteToParticipate = `React with 🎉 to participate!`

        if(bonusRole) inviteToParticipate += `\n\n**Bonus Entries:**\n${bonusRole} - **${bonusEntries}x** entries`
        if(requiredRole) inviteToParticipate += `\n\nMust have the role: ${requiredRole}`

        client.giveawaysManager.start(giveawayChannel, {
            // The giveaway duration
            duration: parseInt(ms(giveawayDuration)),
            // The giveaway prize
            prize: giveawayPrize,
            // The giveaway winner count
            winnerCount: parseInt(giveawayNumberWinners),
            // Who hosts this giveaway
            hostedBy: interaction.user,
            // Required role
            exemptMembers: requiredRole ? new Function('member', `return !member.roles.cache.some((r) => r.id === \'${requiredRole?.id}\')`) : null,
            // Bonus entry role
            bonusEntries: 
                bonusRole ? 
                [
                    {
                        bonus: new Function('member', `return member.roles.cache.some((r) => r.id === \'${bonusRole.id}\') ? ${parseInt(bonusEntries)} : null`),
                        cumulative: false
                    }
                ] 
                : null,
            // Messages
            lastChance: {
                enabled: true,
                content: '⚠️ **LAST CHANCE TO ENTER !** ⚠️',
                threshold: 30000,
                embedColor: 'YELLOW'
            },
            pauseOptions: {
                isPaused: false,
                content: '⚠️ **THIS GIVEAWAY IS PAUSED !** ⚠️',
                unPauseAfter: null,
                embedColor: 'YELLOW'
            },
            messages: {
                giveaway: '🎉🎉 **GIVEAWAY** 🎉🎉',
                giveawayEnded: '🎉🎉 **GIVEAWAY ENDED** 🎉🎉',
                drawing: 'Ends {timestamp}',
                dropMessage: inviteToParticipate,
                inviteToParticipate: inviteToParticipate,
                winMessage: 'Congratulations, {winners}! You won **{this.prize}**!\n{this.messageURL}',
                embedFooter: '{this.winnerCount} winner(s)',
                noWinner: 'Giveaway cancelled, no valid participations.',
                hostedBy: 'Hosted by: {this.hostedBy}',
                winners: 'Winner(s):',
                endedAt: 'Ended at',
            },
            extraData: {
                roleRequirement: requiredRole ? requiredRole.id : null,
                host: interaction.user.id
            }
        });

        interaction.followUp({ content: `A giveaway has started in ${giveawayChannel}.` })
    }
}
