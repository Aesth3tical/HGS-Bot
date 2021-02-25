const Discord = require('discord.js');

module.exports = {
    name: 'ping',
    description: 'ping the bot server',
    async execute (client, message, args) {
        let pingEmbed = new Discord.MessageEmbed()
            .setColor('GREEN')
            .setDescription('Pinging the bot server . . .')

        let botMsg = await message.channel.send(pingEmbed)
        botMsg.edit({ embed: {
            color: 'GREEN',
            description: `Ping: \`\`${botMsg.createdAt - message.createdAt}ms\`\``
        }}).catch(() => botMsg.edit({ embed: {
            color: 'RED',
            description: 'Welp, I ran into an error. Try again in a bit!'
        }}))
    },
};
