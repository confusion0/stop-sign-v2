const { ComponentType, CommandInteraction, Client, Permissions, ActionRowBuilder, ButtonBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js')
const lock = require('./lock')

module.exports = {
    name: 'nuke',
    type: ApplicationCommandType.ChatInput,
    description: 'Nuke a channel!',
    options: [
        {
            name: 'channel',
            description: "The channel that you want to nuke",
            type: ApplicationCommandOptionType.Channel,
            required: false,
            channelTypes: ['GUILD_TEXT']
        }
    ],
    cooldown: 5000,
    reqPerm: "MANAGE_CHANNELS",
    args: "[channel]",

    /**
     * @param {Client} client
     * @param {CommandInteraction} message
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        let channel = interaction.options.getChannel('channel') || interaction.channel

        const lockChannel = interaction.guild.channels.cache.get(channel.id)

        const row = new ActionRowBuilder()
        row.addComponents(
            new ButtonBuilder()
            .setCustomId('confirm')
            .setLabel('Confirm')
            .setStyle('Success'),
            new ButtonBuilder()
            .setCustomId('cancel')
            .setLabel('Cancel')
            .setStyle('Danger'),
        )
        interaction.followUp({ 
            content: `Are you sure you want to nuke ${lockChannel}?`, 
            components: [row]
        }).then((msg) => {

            const row2 = new ActionRowBuilder()
            row2.addComponents(
                new ButtonBuilder()
                .setCustomId('confirm')
                .setLabel('Confirm')
                .setStyle('Success')
                .setDisabled(true),
                new ButtonBuilder()
                .setCustomId('cancel')
                .setLabel('Cancel')
                .setStyle('Danger')
                .setDisabled(true),
            )
        
            msg.awaitMessageComponent({ 
                componentType: ComponentType.Button, 
                time: 30000,
                filter: (i) => {
                    if(i.user.id === interaction.user.id) return true;
                    else return i.reply({
                        content: `Only **${interaction.user.tag}** can use these buttons.`,
                        ephemeral: true
                    }).catch(() => {});
                },
            })
            .then(async i => {

                if(i.customId.toLowerCase() === 'confirm') {
                    lockChannel.clone().then(channel => {
                        try {
                            channel.setParent(lockChannel.parent.id)
            
                            channel.setPosition(lockChannel.position)
            
                            if(lockChannel.id === interaction.channel.id) {
                                i.reply({ content: `This channel will be nuked in 5 seconds` })
                            } else {
                                i.reply({ content: `${lockChannel} will be nuked in 5 seconds` })
                                lockChannel.send({ content: `This channel will be nuked in 5 seconds` })
                            }
            
                            const success = setTimeout(function(){
                                lockChannel.delete()
                  
                            }, 5000);
            
                            channel.send({ content: `This channel has been nuked.` })
                        } catch(err) {
                            i.reply({ content: `Something went wrong while nuking this channel.` })

                            msg.edit({ content: 'Interaction ended.', components: [row2] })
                        }
                    })
                } else {
                    msg.edit({ content: 'Interaction ended.', components: [row2] })

                    i.reply({ content: `Nuke action was cancelled successfully.` })
                }
            })
            .catch((err) => {
                console.log(err)

                msg.edit({ content: 'Interaction ended.', components: [row2] })

                interaction.channel.send({ content: `You took too long to select a your response.` })
            })
        })
    }
}