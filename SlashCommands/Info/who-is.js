const { EmbedBuilder, CommandInteraction, Client, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js')
const moment = require('moment')

module.exports = {
    name: 'who-is',
    type: ApplicationCommandType.ChatInput,
    description: 'Shows info on a member!',
    options: [
        {
            name: 'member',
            description: 'The member you want the info on',
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
        let [ user ] = args
        var permissions = [];
        var acknowledgements = 'None';

        const member =  interaction.guild.members.cache.get(user) || interaction.member

        const roles = member.roles.cache.filter(r => r.id !== interaction.guild.id).map(roles => `<@&${roles.id }>`).join(" **|** ") || "No Roles"

        if(member.permissions.has("KICK_MEMBERS")){
            permissions.push("Kick Members");
        }
        
        if(member.permissions.has("BAN_MEMBERS")){
            permissions.push("Ban Members");
        }
        
        if(member.permissions.has("ADMINISTRATOR")){
            permissions.push("Administrator");
        }
    
        if(member.permissions.has("MANAGE_MESSAGES")){
            permissions.push("Manage Messages");
        }
        
        if(member.permissions.has("MANAGE_CHANNELS")){
            permissions.push("Manage Channels");
        }
        
        if(member.permissions.has("MENTION_EVERYONE")){
            permissions.push("Mention Everyone");
        }
    
        if(member.permissions.has("MANAGE_NICKNAMES")){
            permissions.push("Manage Nicknames");
        }
    
        if(member.permissions.has("MANAGE_ROLES")){
            permissions.push("Manage Roles");
        }
    
        if(member.permissions.has("MANAGE_WEBHOOKS")){
            permissions.push("Manage Webhooks");
        }
    
        if(member.permissions.has("MANAGE_EMOJIS_AND_STICKERS")){
            permissions.push("Manage Emojis and Stickers");
        }
    
        if(permissions.length == 0){
            permissions.push("No Key Permissions Found");
        }
    
        if(member.user.id == interaction.guild.fetchOwner().id){
            acknowledgements = 'Server Owner';
        }
    
        const embed = new EmbedBuilder()
        .setColor('Blurple')
        .setFooter({ text: `User Info`, iconURL: member.user.avatarURL({ dynamic: true }) })
        .setThumbnail(member.user.displayAvatarURL())
        .setTimestamp()
        .addFields([
            { name: '**User** ', value: `<@${member.user.id}>`, inline: true },
            { name: '**User ID** ', value: `${member.user.id}`, inline: true },
            { name: '**Joined At** ', value: `<t:${Math.floor(new Date(member.joinedAt).getTime()/1000)}> (<t:${Math.floor(new Date(member.joinedAt).getTime()/1000)}:R>)` },
            { name: '**Created On**', value: `<t:${Math.floor(new Date(member.user.createdAt).getTime()/1000)}> (<t:${Math.floor(new Date(member.user.createdAt).getTime()/1000)}:R>)`, inline: true },
            { name: `\n**Roles [${member.roles.cache.filter(r => r.id !== interaction.guild.id).map(roles => `\`${roles.name}\``).length}]**`, value: roles.length > 1024 ? "Too many roles to show" : roles },
            { name: "\n**Acknowledgements** ", value: `${acknowledgements}` },
            { name: "\n**Permissions** ", value: `${permissions.join(`, `)}`, inline: true }
        ])

        interaction.followUp({ embeds: [embed] })
    }
}