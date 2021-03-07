let main = require('./../index.js');

exports.editLog = async function (oldMessage, newMessage, Discord) {
    if (oldMessage.channel.id === "813551754745872404") return
    if (oldMessage.content === newMessage.content) return;
    
    let modlogs = main.client.channels.cache.get('813961513382576148');

    const editEmbed = new Discord.MessageEmbed()
        .setColor('GREEN')
        .setTitle('Message Edited')
        .setThumbnail(`${oldMessage.author.displayAvatarURL({ format: 'png', dynamic: true })}`)
        .addFields(
            { name: 'Author/Channel:', value: `${oldMessage.author.tag} | ${oldMessage.channel}`, inline: false },
            { name: 'Before:', value: `${oldMessage.content}`, inline: false },
            { name: 'After:', value: `${newMessage.content}`, inline: false }
        )
        .setFooter(`${oldMessage.author.id}`, `${main.client.user.displayAvatarURL({ format: 'png', dynamic: true })}`)
        .setTimestamp()
    
    const w = await main.client.guilds.cache.get("811513626799243274").fetchWebhooks()
    let newExists = w.find(c => c.name === "HGS Modlogs")
        newExists.send('', {
            username: "HGS Modlogs",
            avatarURL: `${main.client.user.displayAvatarURL({ format: 'png', dynamic: true })}`,
            embeds: [editEmbed],
        })
};
