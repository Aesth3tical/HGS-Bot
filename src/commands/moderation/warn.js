const Discord = require('discord.js');
const modDB = require('quick.db');
let config = require('./../../config.json');
const idGen = require('generate-password');

module.exports = {
    name: 'warn',
    description: 'warn a user',
    async execute (client, message, args) {
        if (!message.member.hasPermission("MANAGE_ROLES") || !message.guild.me.hasPermission("MANAGE_ROLES")) {
            const noPerms = new Discord.MessageEmbed()
                .setColor('RED')
                .setDescription(`Either you or I don't have perms to use that command!`)
            return message.channel.send(noPerms)
        }

        if (!args.length) {
            const noUser = new Discord.MessageEmbed()
                .setColor('RED')
                .setDescription(`You must give the mention or userID of someone to warn!`)
            return message.channel.send(noUser)
        }

        let member = message.mentions.users.first();

        if (!member) {
            let userID = args[0];
            let findUser = await message.guild.members.cache.get(`${userID}`);
            console.log(findUser);
            if (!findUser) {
                const notInServer = new Discord.MessageEmbed()
                    .setColor('RED')
                    .setDescription(`${config.redx} The given user is not in the server, or it may be an invalid user/userID. If you feel this is a bug, please ping <@559200051629654026>\n\`\`\`.warn <mention/userID> <reason>\`\`\``)
                return message.channel.send(notInServer)
            } else if (findUser) {
                member = findUser;
            }
        } else if (member) {
            let getUser = await message.guild.members.cache.get(`${member.id}`)
            member = getUser;
        }

        let reason = args.slice(1).join(' ');
        console.log(reason);

        let w = new Discord.MessageEmbed()
        let userRoles = member.roles.cache.map(r => r.toString()).join(', ');
        
        w.setColor('RED')
        w.setTitle('Member Warned')
        w.setThumbnail(`${member.user.displayAvatarURL({ format: 'png', dynamic: true })}`)
        w.addFields(
            { name: 'User Warned:', value: `${member.user.tag}`, inline: true },
            { name: 'UserID:', value: `${member.user.id}`, inline: true },
            { name: 'Warned By:', value: `${message.author.tag}`, inline: true },
            { name: 'Reason:', value: `${reason}`, inline: true }
        )
        w.addField('Roles:', `${userRoles}`, false)
        w.setTimestamp()
        w.setFooter(`${message.author.tag}`, `${message.author.displayAvatarURL({ format: 'png', dynamic: true })}`)

        let w2 = new Discord.MessageEmbed()
            .setColor('GREEN')
            .setDescription(`Successfully warned ***${member.user.tag}***! | ${reason}`)
        
        let we = new Discord.MessageEmbed()
            .setColor('RED')
            .setDescription(`I couldn't warn that user! It could be because they are above me in the role hierarchy, or simply because I lack permissions`)

        let wID = idGen.generate({
            length: 5,
            numbers: true
        });


        await modDB.push(`${member.id}.warnings`, { ID: wID, Reason: reason });

        const webhooks = await client.guilds.cache.get("811513626799243274").fetchWebhooks()
        let newExists = webhooks.find(c => c.name === "HGS Modlogs")
        newExists.send('', {
            username: "HGS Modlogs",
            avatarURL: `${client.user.displayAvatarURL({ format: 'png', dynamic: true })}`,
            embeds: [w],
        })
        
        message.channel.send(w2);
    }
}