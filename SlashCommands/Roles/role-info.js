const { CommandInteracion, Client, EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    name: "role-info",
    type: ApplicationCommandType.ChatInput,
    description: "See information about a role",
    category: "Information",
    options: [
        {
            name: "role",
            description: "The role you want information about",
            type: ApplicationCommandOptionType.Role,
            required: true
        },
    ],
    cooldown: 5000,
    reqPerm: "MANAGE_ROLES",
    args: "<role>",
    
    /**
     * @param {Client} client
     * @param {CommandInteraction} message
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        let providedRole = interaction.options.getRole('role')

        let role = interaction.guild.roles.cache.get(providedRole)

        let ishoist = role.hoist ? "Yes" : "No";
        let hex = role.hexColor.split("").slice(1).join("");

        const embed = new EmbedBuilder()
        .setColor(role.color)
        .setThumbnail(`https://singlecolorimage.com/get/${hex}/400x400`)
        .addFields([
            {
                name: "Mention & ID",
                value: `${role}\nID: \`${role.id}\``,
            },
            {
                name: "Name",
                value: role.name,
                inline: true,
            },
            {
                name: "Color",
                value: `${role.hexColor}`,
                inline: true,
            },
            {
                name: "Position",
                value: `${role.position}`,
            },
            {
                name: `Hoisted`,
                value: `${ishoist}`,
                inline: true,
            },
            {
                name: "Mentionable",
                value: `${role.mentionable}`,
                inline: true,
            },
            {
                name: "Permissions",
                value: `\`${role.permissions.toArray().join("\`, \`")}\``,
            },
        ]);
        return interaction.editReply({ embeds: [embed] });
    },
};