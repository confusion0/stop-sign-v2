const client = require('../index')
const Discord = require('discord.js')
const command_cooldowns = new Map()
const { ApplicationCommandOptionType, EmbedBuilder, Collection, PermissionsBitField } = require('discord.js')

client.on('interactionCreate', async (interaction) => {
    if(interaction.isChatInputCommand()) {
        await interaction.deferReply().catch(() => {})

        const cmd = client.slashCommands.get(interaction.commandName);
        if(!cmd) return interaction.followUp({ content: 'An error has occured'});

        if(!interaction.guild) return

        //Permission requirement
        if(cmd.reqPerm == "BOT_ADMIN" && !client.ADMINS.find(admin => admin.ID === interaction.user.id)) return interaction.editReply({ content: "This command is reserved for bot admins only.", ephemeral: true })
  
        if(cmd.reqPerm != "BOT_ADMIN" && cmd.reqPerm != "NONE" && !interaction.member.permissions.has(cmd.reqPerm)) {
            if(!client.ADMINS.find(admin => admin.ID === interaction.user.id)) return interaction.editReply({ content: `You need the \`${cmd.reqPerm}\` permission(s) to run this command.`, ephemeral: true })
        }
        
        if(cmd.reqPerm != "BOT_ADMIN" && cmd.reqPerm != "NONE" && !interaction.guild.members.me.permissions.has(cmd.reqPerm)) {
            return interaction.editReply({ content: `I do not have the \`${cmd.reqPerm}\` permission(s) which is needed to execute the request.`, ephemeral: true })
        }

        //Cooldowns
        if(cmd.cooldown) {
            if(command_cooldowns.get(`${interaction.user.id}:${interaction.commandName}`)) { 
                const embed = new EmbedBuilder()
                .setTitle('Cooldown Alert')
                .setDescription(`The \`${interaction.commandName}\` command has a \`${cmd.cooldown/1000}s\` cooldown. You still have to wait \`${command_cooldowns.get(`${interaction.user.id}:${interaction.commandName}`)/1000}s\` until you can run the command again.`)
                .setColor('Blurple')

                return interaction.followUp({ embeds: [embed], ephemeral: true })
            } else {
                if(client.ADMINS.find(admin => admin.ID === interaction.user.id)) {
              
                    var cooldown = cmd.cooldown
                    command_cooldowns.set(`${interaction.user.id}:${interaction.commandName}`, cooldown)
        
                    var interval = setInterval(function(){
                        command_cooldowns.set(`${interaction.user.id}:${interaction.commandName}`, cooldown)
                        cooldown -= 100
                    }, 100)
        
                    setTimeout(function(){
                        clearInterval(interval)
                        command_cooldowns.delete(`${interaction.user.id}:${interaction.commandName}`)
                    }, cmd.cooldown)
                }
            }
        }

        const args = [];

        for (let option of interaction.options.data) {
            if (option.type === ApplicationCommandOptionType.Subcommand) {
                if (option.name) args.push(option.name);
                option.options?.forEach((x) => {
                    if (x.value) args.push(x.value);
                });
            } else if (option.value) args.push(option.value);
        }
        
        try {
            cmd.run(client, interaction, args);
        } catch(error) {
        }
    }
    
    //Context Menus
    if (interaction.isContextMenuCommand()) {
        await interaction.deferReply({ ephemeral: true }).catch(() => {});
        const cmd = client.contextMenus.get(interaction.commandName);

        //Permission requirement
        if(cmd.reqPerm == "BOT_ADMIN" && !client.ADMINS.find(admin => admin.ID === interaction.user.id)) return interaction.editReply({ content: "This command is reserved for bot admins only.", ephemeral: true })
  
        if(cmd.reqPerm != "BOT_ADMIN" && cmd.reqPerm != "NONE" && !interaction.member.permissions.has(cmd.reqPerm)) {
            if(!client.ADMINS.find(admin => admin.ID === interaction.user.id)) return interaction.editReply({ content: `You need the \`${cmd.reqPerm}\` permission(s) to run this command.`, ephemeral: true })
        }
        
        if(cmd.reqPerm != "BOT_ADMIN" && cmd.reqPerm != "NONE" && !interaction.guild.members.me.permissions.has(cmd.reqPerm)) {
            return interaction.editReply({ content: `I do not have the \`${cmd.reqPerm}\` permission(s) which is needed to execute the request.`, ephemeral: true })
        }

        //Cooldowns
        if(cmd.cooldown) {
            if(command_cooldowns.get(`${interaction.user.id}:${interaction.commandName}`)) { 
                const embed = new EmbedBuilder()
                .setTitle('Cooldown Alert')
                .setDescription(`The \`${interaction.commandName}\` command has a \`${cmd.cooldown/1000}s\` cooldown. You still have to wait \`${command_cooldowns.get(`${interaction.user.id}:${interaction.commandName}`)/1000}s\` until you can run the command again.`)
                .setColor('Blurple')

                return interaction.followUp({ embeds: [embed], ephemeral: true })
            } else {
                if(client.ADMINS.find(admin => admin.ID === interaction.user.id)) {
              
                    var cooldown = cmd.cooldown
                    command_cooldowns.set(`${interaction.user.id}:${interaction.commandName}`, cooldown)
        
                    var interval = setInterval(function(){
                        command_cooldowns.set(`${interaction.user.id}:${interaction.commandName}`, cooldown)
                        cooldown -= 100
                    }, 100)
        
                    setTimeout(function(){
                        clearInterval(interval)
                        command_cooldowns.delete(`${interaction.user.id}:${interaction.commandName}`)
                    }, cmd.cooldown)
                }
            }
        }

        cmd.run(client, interaction);
    }
});
