const fetch = require('node-fetch')
const client = require('../index')
/*
process.on("unhandledRejection", (reason, p) => {
    console.log(" [antiCrash] :: Unhandled Rejection/Catch");
    fetch('https://discord.com/api/webhooks/850439776162807838/ezfZ1N-VDnuy6lH5lVENTeMp6jhrMrtSjI4MqSNbdHPMtNUH60e8QfBSPv4qbUGrWuY9', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({
            embeds: [
                {
                    title: 'Slash Commands - Unhandled Rejection/Catch',
                    description: `\`\`\`Reason: ${reason}\n${p}\`\`\``,
                    color: '16711680'
                }
            ]
        })
    })
    .catch(() => {})
});
process.on("uncaughtException", (err, origin) => {
    console.log(" [antiCrash] :: Uncaught Exception/Catch");
    fetch('https://discord.com/api/webhooks/850439776162807838/ezfZ1N-VDnuy6lH5lVENTeMp6jhrMrtSjI4MqSNbdHPMtNUH60e8QfBSPv4qbUGrWuY9', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({
            embeds: [
                {
                    title: 'Slash Commands - Uncaught Exception/Catch',
                    description: `\`\`\`Error: ${err}\nOrigin: ${origin}\`\`\``,
                    color: '16711680'
                }
            ]
        })
    })
    .catch(() => {})
});
process.on("uncaughtExceptionMonitor", (err, origin) => {
    console.log(" [antiCrash] :: Uncaught Exception/Catch (MONITOR)");
    fetch('https://discord.com/api/webhooks/850439776162807838/ezfZ1N-VDnuy6lH5lVENTeMp6jhrMrtSjI4MqSNbdHPMtNUH60e8QfBSPv4qbUGrWuY9', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({
            embeds: [
                {
                    title: 'Slash Commands - Uncaught Exception/Catch (MONITOR)',
                    description: `\`\`\`Error: ${err}\nOrigin: ${origin}\`\`\``,
                    color: '16711680'
                }
            ]
        })
    })
    .catch(() => {})
});
process.on("multipleResolves", (type, promise, reason) => {
    console.log(" [antiCrash] :: Multiple Resolves");
    fetch('https://discord.com/api/webhooks/850439776162807838/ezfZ1N-VDnuy6lH5lVENTeMp6jhrMrtSjI4MqSNbdHPMtNUH60e8QfBSPv4qbUGrWuY9', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({
            embeds: [
                {
                    title: 'Slash Commands - Multiple Resolves',
                    description: `\`\`\`Type: ${type}\n${promise}\nReason: ${reason}\`\`\``,
                    color: '16711680'
                }
            ]
        })
    })
    .catch(() => {})
});
*/