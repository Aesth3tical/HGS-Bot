const { Util, MessageEmbed } = require('discord.js');
const modDB = require('quick.db');
const config = require('../../config.json');

module.exports = {
    name: 'warnings',
    description: 'get warnings for a user',
    async execute (client, message, args) {
        if (!message.member.hasPermission("MANAGE_ROLES") || !message.guild.me.hasPermission("MANAGE_ROLES")) {
            const noPerms = new Discord.MessageEmbed()
                .setColor('RED')
                .setDescription(`Either you or I don't have perms to use that command!`)
            return message.channel.send(noPerms)
        }

        if (!args.length) {
            const noUser = new MessageEmbed()
                .setColor('RED')
                .setDescription(`You must give the mention or userID of someone to see their warnings!`)
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
                    .setDescription(`The given user is not in the server, or it may be an invalid user/userID. If you feel this is a bug, please ping <@559200051629654026>\n\`\`\`.warnings <mention/userID>\`\`\``)
                return message.channel.send(notInServer)
            } else if (findUser) {
                member = findUser;
            }
        } else if (member) {
            let getUser = await message.guild.members.cache.get(`${member.id}`)
            member = getUser;
        }

        let warnings = modDB.get(`${member.id}.warnings`);
        if (!warnings) {
            const noWarnings = new MessageEmbed()
                .setColor('RED')
                .setDescription(`${config.redx} There are no warnings to show for that user!`)
            return message.channel.send(noWarnings);
        }
        let warnArray = warnings.map(w => `**${w.ID} -**\n${w.Reason}`).join('\n');
        const [first, ...rest] = Util.splitMessage(warnArray, { maxLength: 1000 });

        const embed1 = new MessageEmbed()
            .setColor('RANDOM')
            .setDescription(first);

        const embed2 = new MessageEmbed()
            .setColor(embed1.color)

        if (!rest.length) {
            return message.channel.send(embed1)
        }

        for (const text of rest) {
            embed2.setDescription(text)
            await message.channel.send(embed1)
            await message.channel.send(embed2)
        }
    }
}