const { ComponentType, SelectMenuBuilder, ActionRowBuilder, ButtonBuilder, EmbedBuilder, Client, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js')

const path = require('path')

const ms = require('ms')

const client = require('../../index.js');

module.exports = {
    name: 'help',
    type: ApplicationCommandType.ChatInput,
    description: 'Sends the help embed!',
    options: [
        {
            name: 'slash-command',
            description: "Get info on a certain slash command",
            type: ApplicationCommandOptionType.String,
            required: false,
        }
    ],
    cooldown: 5000,
    reqPerm: "NONE",
    args: "[slash-command]",

    /**
     * @param {Client} client
     * @param {CommandInteraction} message
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        
        let [ slashCommand ] = args;

        let input = "NONE"
        let links = '📩 [Invite](https://discord.com/api/oauth2/authorize?client_id=823568726372253716&permissions=8&scope=applications.commands%20bot)'
        + '\n💻 [Website Link](https://stopsign.glitch.me/)'
        + '\n📃 [GitHub Link](https://github.com/confusion0/stop-sign-bot-slash-commands)'
        + '\n❓ [Support Server Invite Link](https://discord.gg/e4fxq8vCfM)'
        + '\n📄 [Documentation Link](https://confusion0.github.io/stop-sign-bot-slash-commands/introduction)'
        + '\n📮 [Vote Link](https://top.gg/bot/823568726372253716/vote)'

        const home = new EmbedBuilder()
        .setColor('Blurple')
        .setTitle('Help panel')
        .setDescription(`\`\`\`- [] = optional argument\n- <> = required argument\nYou can use this slash command to find more info on specific commands!\`\`\``)
        .addFields([
            { 
                name: 'Categories', 
                value: '```All Commands\nButton Role Commands\nConfiguration Commands\nFun Commands\nGeneral Commands\nInfo Commands\nModeration Commands\nReaction Role Commands\nRole Commands```',
                inline: true
            },
            { 
                name: 'Links', 
                value: links,
                inline: true
            },
            {
                name: 'Usage',
                value: '• You can use the slash command, `/help [slash-command]`, to view information on certain commands.\n• You can use the select menu below to view categories of commands.\n• If you find bugs or need help, feel free to join our support server.\n'
            },
        ])
        .setTimestamp()

        const row = new ActionRowBuilder().addComponents(
            new SelectMenuBuilder()
            .setCustomId('help')
            .setPlaceholder('Help sections')
            .setDisabled(false)
            .addOptions([
                {
                    label: 'All',
                    value: 'All',
                    description: 'Shows all the available commands',
                    emoji: '📋'
                },
                {
                    label: 'Button Roles',
                    value: 'Button Roles',
                    description: "Shows the button role commands",
                    emoji: "👆"
                },
                {
                    label: 'Configuration',
                    value: 'Configuration',
                    description: "Shows the configuration commands",
                    emoji: "🔧"
                },
                {
                    label: 'Fun',
                    value: 'Fun',
                    description: "Shows the fun commands",
                    emoji: "😃"
                },
                {
                    label: 'General',
                    value: 'General',
                    description: "Shows the general commands",
                    emoji: "👀"
                },
                {
                    label: 'Giveaways',
                    value: 'Giveaways',
                    description: "Shows the giveaway commands",
                    emoji: "🎉"
                },
                {
                    label: 'Info',
                    value: 'Info',
                    description: "Shows the info commands",
                    emoji: "📌"
                },
                {
                    label: 'Moderation',
                    value: 'Moderation',
                    description: "Shows the moderation commands",
                    emoji: "🛠"
                },
                {
                    label: 'Reaction Roles',
                    value: 'Reaction Roles',
                    description: "Shows the reaction role commands",
                    emoji: "🌟"
                },
                {
                    label: 'Roles',
                    value: 'Roles',
                    description: "Shows the role commands",
                    emoji: "🎭"
                }
            ])
        )

        const button = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
            .setStyle("Link")
            .setURL("https://discord.com/api/oauth2/authorize?client_id=823568726372253716&permissions=8&scope=applications.commands%20bot")
            .setLabel("Invite Link"),
            new ButtonBuilder()
            .setStyle("Link")
            .setURL("https://discord.gg/e4fxq8vCfM")
            .setLabel("Support Server Link"),
            new ButtonBuilder()
            .setStyle("Link")
            .setURL("https://stopsign.glitch.me/")
            .setLabel("Website Link"),
            new ButtonBuilder()
            .setStyle("Link")
            .setURL("https://top.gg/bot/823568726372253716/vote")
            .setLabel("Vote link"),
            new ButtonBuilder()
            .setStyle("Link")
            .setURL("https://teamseas.org/")
            .setLabel("Help Our Oceans"),
        )

        if(!slashCommand) {
            
            const msg = await interaction.followUp({ embeds: [home], components: [row] })

            const collector = interaction.channel.createMessageComponentCollector({ 
                componentType: ComponentType.SelectMenu, 
                max: 10, 
                time: 60000, 
                filter: (i) => {
                    if(i.user.id === interaction.user.id) return true;
                    else return i.reply({
                        content: `Only **${interaction.user.tag}** can use this select menu.`,
                        ephemeral: true
                    }).catch(() => {});
                }, 
            })

            collector.on("collect", async i => {
                try {

                    await i.deferUpdate().catch((err) => console.log(err));

                    if(!(i.message.id === msg.id)) return
                
                    const value = i.values[0]

                    const embed2 = new EmbedBuilder()
                    .setColor('Blurple')
                    .setTitle(`${value} Commands`)
                    .setDescription(`\`\`\`- [] = optional argument\n- <> = required argument\nYou can use this slash command to find more info on specific commands!\`\`\``)
                    
                    if(value === 'All') {
                        let array = []
                        client.slashCommands.forEach(slashCommand => {
                            
                            array.push(`\`\`${slashCommand.name}\`\``)
                        })
                        embed2.setFields([{ name: 'Available Commands', value: array = [] ? `${array.join(', ')}` : 'No commands available to show' }])
                    } else {
                        let array = []
                        client.slashCommands.forEach(slashCommand => {
                            const filepath = client.slashCommandFiles.find(filepath => filepath.includes(slashCommand.name))
                            if(!filepath) return
                
                            const module = getModuleFromPath(filepath)
                        
                            if(module !== value) return

                            let input = `\`${slashCommand.name}`

                            for (let i = 0; i < 24 - slashCommand.name.length; i++) {
                                input += ' '
                            }
                            input += `:\` ${slashCommand.description.length > 48 ? slashCommand.description.substring(0, 48) + '...' : slashCommand.description}`

                            array.push(input)
                        })
                        
                        embed2.setFields({ name: value, value: array = [] ? array.join('\n') : 'No commands in this category'})
                    }
                    
                    await interaction.editReply({ embeds: [embed2], components: [button, row] })
                } catch(err) {
                    console.log(err)
                }
            })


        } else {
            var command = client.slashCommands.get(slashCommand.toLowerCase())

            if(!command) return interaction.editReply(`I could not find a slash command with that name.`)

            const embed = new EmbedBuilder()
            embed.setColor('Blurple')
            embed.setTitle(`Slash Command Information - ${command.name}`)
            embed.setDescription("```- [] = optional argument\n- <> = required argument```")
            if(command.description) embed.addFields([{ name: "Description: ", value: `${command.description}` }])
            if(command.args) embed.addFields([{ name: "Usage: ", value: `\`\`\`/${command.name} ${command.args}\`\`\`` }])
            if(command.reqPerm && !command.reqPerm === "NONE" && !command.reqPerm === "BOT_ADMIN") embeds([{ name: "Required Permissions: ", value: `\`\`\`${command.reqPerm.join(', ')}\`\`\`` }])
            if(command.cooldown) embed.addFields([{ name: 'Cooldown: ', value: `\`\`\`${ms(ms(command.cooldown), { long: true })}\`\`\`` }])
            
            interaction.followUp({ embeds: [embed], components: [button] })
        }
    }
}

const getModuleFromPath = (filepath) => {
    const splited = filepath.split(path.sep)
    return splited[splited.length-2]
}