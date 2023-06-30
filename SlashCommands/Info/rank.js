const { AttachmentBuilder, CommandInteraction, Client, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js')
const Schema = require('../../models/experience')
const canvacord = require('canvacord')

module.exports = {
    name: 'rank',
    type: ApplicationCommandType.ChatInput,
    description: 'Displays a member\'s level!',
    options: [
        {
            name: 'member',
            description: 'The user to get the rank of',
            type: ApplicationCommandOptionType.User,
            required: false
        }
    ],
    cooldown: 5000,
    reqPerm: "NONE",
    args: "[member]",

    /**
     * @param {Client} client
     * @param {CommandInteraction} message
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        let member = interaction.options.getMember('member') || interaction.user

        const guildMember = interaction.guild.members.cache.get(member.id)

        await Schema.findOne({ Guild: interaction.guild.id }, async(err, data) => {
            
            if(!data || !data.Users || !Object.keys(data.Users).includes(guildMember.user.id)) return interaction.editReply({ content: `You do not have any experience yet. You can get experience from sending messages in this server.` })

            let levels = []
            Object.values(data.Users).map((val) => {
                levels.push({ level: val[1].Level, id: val[0] })
            })

            levels.sort(function(a, b) {
                return b.level - a.level
            })
            
            let rank;

            levels.map((value, index) => {
                if(value.id === guildMember.user.id) return rank = index+1
            })

            const rankCard = new canvacord.Rank()
            .setAvatar(guildMember.user.displayAvatarURL({ format: "jpg" }))
            .setCurrentXP(data.Users[guildMember.user.id][1].Experience)
            .setRequiredXP(data.Users[guildMember.user.id][1].NextLevel)
            .setProgressBar("#5865F2", "COLOR")
            .setUsername(guildMember.user.username)
            .setDiscriminator(guildMember.user.discriminator)
            .setRank(rank)
            .setLevel(data.Users[guildMember.user.id][1].Level);

            rankCard.build().then((data) => {
                const attachment = new AttachmentBuilder(data, 'rank.png');
                interaction.followUp({ files: [attachment] })
            })
        })
    }
} 
