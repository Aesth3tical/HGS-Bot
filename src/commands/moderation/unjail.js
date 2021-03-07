const Discord = require('discord.js');
const { mod, clerk } = require('./../../config.json');

module.exports = {
    name: 'unjail',
    description: 'unjail a user',
    async execute (client, message, args) {
        let jail1 = message.guild.roles.cache.find(r => r.id === "813552690624724992") // first
        let jail2 = message.guild.roles.cache.find(r => r.id === "814204753407770754") // second

        let jailRole = 0;
        let citizenRole = message.guild.roles.cache.find(r => r.id === "811517339005747211");

        let member = message.mentions.users.first();

        if (!member) {
            let userID = args[0];
            let findUser = await message.guild.members.cache.get(`${userID}`);
            if (!findUser) {
                const notInServer = new Discord.MessageEmbed()
                    .setColor('RED')
                    .setDescription(`The given user is not in the server, or it may be an invalid user/userID. If you feel this is a bug, please ping <@559200051629654026>\n\`\`\`.unjail <mention/userID>\`\`\``)
                return message.channel.send(notInServer)
            } else if (findUser) {
                member = findUser;
            }
        } else if (member) {
            let getUser = await message.guild.members.cache.get(`${member.id}`)
            member = getUser;
        }

        if (!member.roles.cache.find(r => r.id === jail1.id) && !member.roles.cache.find(r => r.id === jail2.id)) {
            const notJailed = new Discord.MessageEmbed()
                .setColor('RED')
                .setDescription(`That user isn't jailed!`)
        } else if (member.roles.cache.find(r => r.id === jail1.id)) {
            jailRole = jail1;
        } else if (member.roles.cache.find(r => r.id === jail2.id)) {
            jailRole = jail2;
        }

        let unJailed = new Discord.MessageEmbed()
            .setColor('GREEN')
            .setDescription(`Successfully unjailed ***${member.user.tag}***!`)

        let unJailError = new Discord.MessageEmbed()
            .setColor('RED')
            .setDescription(`I couldn't unjail that user! It could be because they are above me in the role hierarchy, or simply because I lack permissions`)

        try {
            member.roles.remove(jailRole.id);
            member.roles.add(citizenRole.id);
            message.channel.send(unJailed);
        } catch (error) {
            message.channel.send(unJailError);
            console.log(error.stack);
        }
    }
}
