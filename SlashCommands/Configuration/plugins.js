const altidentifier = require('../../models/altidentifier')
const blacklistedwords = require('../../models/blacklist')
const experience = require('../../models/experience')
const lockdownchannels = require("../../models/lockdown");
const { ChannelPagination, NextPageButton, PreviousPageButton } = require("djs-button-pages");
const { CommandInteraction, Client, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js')
const ms = require('ms');

var configs = [

    { title: 'Alt-identifier',
      name: 'alt-identifier',
      url: 'https://confusion0.github.io/stop-sign-bot-slash-commands/plugins#alternate-account-identifier',
      args: '<options> [channel] [time]',
      current: async (client, guild) => {
        const data = await altidentifier.findOne({ 
            Guild: guild.id 
        })

        if(data) return `<#${data.Channel}>, ${ms(ms(data.Time), { long: true })}`
        else return 'Off'
      }
    },
  
    //----------------------------------------------------------------------------------------------------------------------
    
    { title: 'Anti-invite',
      name: 'anti-invite',
      url: 'https://confusion0.github.io/stop-sign-bot-slash-commands/plugins#anti-guild-invites',
      args: '<options>',
      current: async (client, guild) => {
        const data = await client.gData.get(`${guild.id}:antiInvite`)

        if(data) return 'On'
        else return 'Off'
      }
    },

    //----------------------------------------------------------------------------------------------------------------------
    
    { title: 'Anti-phish',
      name: 'anti-phish',
      url: 'https://confusion0.github.io/stop-sign-bot-slash-commands/plugins#anti-phishing-links',
      args: '<options>',
      current: async (client, guild) => {
        const data = await client.gData.get(`${guild.id}:antiPhish`)

        if(data) return 'On'
        else return 'Off'
      }
    },

    //----------------------------------------------------------------------------------------------------------------------
    
    { title: 'Anti-raid',
      name: 'anti-raid',
      url: 'https://confusion0.github.io/stop-sign-bot-slash-commands/plugins#anti-raid',
      args: '<options>',
      current: async (client, guild) => {
        const data = await client.gData.get(`${guild.id}:antiRaid`)

        if(data) return 'On'
        else return 'Off'
      }
    },

    //----------------------------------------------------------------------------------------------------------------------
    
    { title: 'Anti-spam',
      name: 'anti-spam',
      url: 'https://confusion0.github.io/stop-sign-bot-slash-commands/plugins#anti-spam',
      args: '<options>',
      current: async (client, guild) => {
        const data = await client.gData.get(`${guild.id}:antiSpam`)

        if(data) return 'On'
        else return 'Off'
      }
    },

    //----------------------------------------------------------------------------------------------------------------------
    
    { title: 'Auto-decancer',
      name: 'auto-decancer',
      url: 'https://confusion0.github.io/stop-sign-bot-slash-commands/plugins#automatic-decancer',
      args: '<options>',
      current: async (client, guild) => {
        const data = await client.gData.get(`${guild.id}:autoDecancer`)

        if(data) return 'On'
        else return 'Off'
      }
    }
    
  ]

  var configs2 = [

    { title: 'Blacklisted-words',
      name: 'blacklisted-words',
      url: 'https://confusion0.github.io/stop-sign-bot-slash-commands/plugins#blacklisted-words',
      args: '<options>',
      current: async (client, guild) => {
        const data = await blacklistedwords.findOne({
            Guild: guild.id
        })

        if(data) return `||${data.Words.join(', ')}||`
        else return 'Off'
      }
    },
  
    //----------------------------------------------------------------------------------------------------------------------
    
    { title: 'Family-friendly',
      name: 'family-friendly',
      url: 'https://confusion0.github.io/stop-sign-bot-slash-commands/plugins#family-friendly-content',
      args: '<options>',
      current: async (client, guild) => {
        const data = await client.gData.get(`${guild.id}:familyFriendly`)

        if(data) return 'On'
        else return 'Off'
      }
    },

    //----------------------------------------------------------------------------------------------------------------------
    
    { title: 'Leveling',
      name: 'leveling',
      url: 'https://confusion0.github.io/stop-sign-bot-slash-commands/plugins#leveling-system',
      args: '<options>',
      current: async (client, guild) => {
        const data = await experience.findOne({
          Guild: guild.id
        })

        if(data && data.Enabled) return 'On'
        else return 'Off'
      }
    },

    //----------------------------------------------------------------------------------------------------------------------
    
    { title: 'Lockdown-channels',
      name: 'lockdown-channels',
      url: 'https://confusion0.github.io/stop-sign-bot-slash-commands/plugins#lockdown-channel-system',
      args: '<options> [channel]',
      current: async (client, guild) => {
        const data = await lockdownchannels.findOne({
          Guild: guild.id
        })

        if(!data) return 'Off'
        var channels = []
        data.Lockdown.Channels.forEach(channel => {
            channels.push("<#" + channel + ">")
        })
        
        return channels.join(', ')
      }
    },

    //----------------------------------------------------------------------------------------------------------------------
    
    { title: 'Mute-role',
      name: 'mute-role',
      url: 'https://confusion0.github.io/stop-sign-bot-slash-commands/plugins#mute-role',
      args: '<options> [role]',
      current: async (client, guild) => {
        const data = await client.gData.get(`${guild.id}:muteRole`)
        
        if(data) return `<@&${data}>`
        else return 'Off'
      }
    },

    //----------------------------------------------------------------------------------------------------------------------
    
    { title: 'Verification',
      name: 'verification',
      url: 'https://confusion0.github.io/stop-sign-bot-slash-commands/plugins#verification-system',
      args: '<options>',
      current: async (client, guild) => {
        const data = await client.gData.get(`${guild.id}:verification`)

        if(data) return 'On'
        else return 'Off'
      }
    },  
      
  ]

module.exports = {
    name: 'plugins',
    type: ApplicationCommandType.ChatInput,
    description: 'Displays server plugins!',
    cooldown: 5000,
    reqPerm: "ADMINISTRATOR",
    args: "",

    /**
     * @param {Client} client
     * @param {CommandInteraction} message
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        const embed = new EmbedBuilder()
        .setTitle('Server Plugins')
        .setThumbnail(client.user.displayAvatarURL())
        .setColor('Blurple')

        let input
        for(config of configs){
          if(input) input += `\n[**${config.title}**](${config.url}) \n<:reply:934534663144357888> **Current: **${(await config.current(client, interaction.guild))} \n\`\`\`/${config.name} ${config.args}\`\`\``
          else input = `[**${config.title}**](${config.url}) \n<:reply:934534663144357888> **Current: **${(await config.current(client, interaction.guild))} \n\`\`\`/${config.name} ${config.args}\`\`\``
        }

        embed.setDescription(input)

        const embed2 = new EmbedBuilder()
        .setTitle('Server Plugins')
        .setThumbnail(client.user.displayAvatarURL())
        .setColor('Blurple')

        let input2
        for(config2 of configs2){
          if(input2) input2 += `\n[**${config2.title}**](${config2.url}) \n<:reply:934534663144357888> **Current: **${(await config2.current(client, interaction.guild))} \n\`\`\`/${config2.name} ${config2.args}\`\`\``
          else input2 = `[**${config2.title}**](${config2.url}) \n<:reply:934534663144357888> **Current: **${(await config2.current(client, interaction.guild))} \n\`\`\`/${config2.name} ${config2.args}\`\`\``
        }

        embed2.setDescription(input2)

        const buttons = 
        [
            new PreviousPageButton({custom_id: "prev_page", label: "Previous", style: ButtonStyle.Primary}),
            new NextPageButton().setStyle({custom_id: "next_page", label: "Next", style: ButtonStyle.Primary}),
        ];

        const pagination = new ChannelPagination() //Create pagination.
            .setButtons(buttons) //Insert buttons.
            .setEmbeds([embed, embed2]) //Add embeds.
            .setTime(60000); //Set time.

        await pagination.send(interaction.channel);

        return interaction.followUp({ content: `Here is the list of server plugins.` })
    }
}