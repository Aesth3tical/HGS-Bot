const Discord = require('discord.js');
const modDB = require('quick.db');
const config = require('./../../config.json');
const idGen = require('generate-password');

module.exports = {
    name: 'delwarn',
    description: 'delete a warning for a user',
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
                .setDescription(`You must give the mention or userID of someone to delete a warn from!`)
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
                    .setDescription(`The given user is not in the server, or it may be an invalid user/userID. If you feel this is a bug, please ping <@559200051629654026>\n\`\`\`.delwarn <mention/userID> <warnID>\`\`\``)
                return message.channel.send(notInServer)
            } else if (findUser) {
                member = findUser;
            }
        } else if (member) {
            let getUser = await message.guild.members.cache.get(`${member.id}`)
            member = getUser;
        }

        let wID = args.slice(1);

        let w2 = new Discord.MessageEmbed()
            .setColor('GREEN')
            .setDescription(`Successfully deleted warning \`\`${wID}\`\` for ***${member.user.tag}***!`)
        
        let we = new Discord.MessageEmbed()
            .setColor('RED')
            .setDescription(`I couldn't delete that warning! I most likely lack permissions, otherwise it's a bug`)

        let warnings = modDB.get(`${member.id}.warnings`);
        console.log(warnings);
        let getWarn = await warnings.find(w => w.ID === `${wID}`);

        if (getWarn) {
            let getWarns = modDB.fetch(`${member.id}.warnings`);
            let filterWarns = getWarns.filter(w => w.ID !== `${wID}`);
            await modDB.set(`${member.id}.warnings`, filterWarns);

            return message.channel.send(w2);
        } else if (!getWarn) {
            return message.channel.send(we);
        }
    }
}