let main = require('./../index.js');
const localData = require('quick.db');

exports.deleteLog = async function (message, Discord) {
    let modlogs = main.client.channels.cache.get('813961513382576148');
    localData.set(`${message.channel.id}.snipe.content`, message.content);
    localData.set(`${message.channel.id}.snipe.authorName`, message.author.tag);
    localData.set(`${message.channel.id}.snipe.authorIcon`, message.author.displayAvatarURL({ format: 'png', dynamic: true }));

    const delEmbed = new Discord.MessageEmbed()
        .setColor('RED')
        .setTitle('Message Deleted')
        .setThumbnail(`${message.author.displayAvatarURL({ format: 'png', dynamic: true })}`)
        .addFields(
            { name: 'Author + Channel:', value: `${message.author.tag} | ${message.channel}`, inline: false },
            { name: 'Message', value: `${message.content}`, inline: false }
        )
        .setFooter(`${message.author.id}`, `${main.client.user.displayAvatarURL({ format: 'png', dynamic: true })}`)
        .setTimestamp()
    
    const w = await main.client.guilds.cache.get("811513626799243274").fetchWebhooks()
    let newExists = w.find(c => c.name === "HGS Modlogs")
        newExists.send('', {
            username: "HGS Modlogs",
            avatarURL: `${main.client.user.displayAvatarURL({ format: 'png', dynamic: true })}`,
            embeds: [delEmbed],
        })
};
