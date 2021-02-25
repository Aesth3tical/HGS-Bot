const Discord = require('discord.js');
const db = require('quick.db');

module.exports = {
    name: 'snipe',
    description: 'snipe the last deleted message',
    execute (client, message, args) {
        let content = db.get(`${message.channel.id}.snipe.content`);
        let authorIcon = db.get(`${message.channel.id}.snipe.authorIcon`);
        let authorName = db.get(`${message.channel.id}.snipe.authorName`);

        if (!content || content === null || content === undefined) {
            const noID = new Discord.MessageEmbed()
                .setColor('RANDOM')
                .setDescription('There are no messages to snipe in this channel!')
            return message.channel.send(noID)
        }

        const snipeEmbed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setAuthor(authorName, authorIcon)
            .setDescription(content)
            .setTimestamp()
        message.channel.send(snipeEmbed)
    }
}
