const Discord = require('discord.js');
const { mod, clerk } = require('./../../config.json');

module.exports = {
    name: 'jail',
    description: 'jail a user',
    async execute (client, message, args) {
        let clerkRole = message.guild.roles.cache.get(clerk);
        let modRole = message.guild.roles.cache.get(mod);
        if (!message.member.roles.cache.find(r => r.id === modRole.id) && !message.member.roles.cache.find(r => r.id === clerkRole.id)) return;

        let option = args[0];

        jails = [
            "1",
            "2"
        ]

        if (!jails.includes(option)) {
            const chooseJail = new Discord.MessageEmbed()
                .setColor('RED')
                .setDescription('You must choose a jail to put them into! Options: ``1``, ``2``')
            return message.channel.send(chooseJail)
        }

        if (option === "1") {
            let jailRole = message.guild.roles.cache.find(r => r.id === "813552690624724992");
            let citizenRole = message.guild.roles.cache.find(r => r.id === "811517339005747211");

            let member = message.mentions.users.first();

            if (!member) {
                let userID = args[0];
                let findUser = await message.guild.members.cache.get(`${userID}`);
                if (!findUser) {
                    const notInServer = new Discord.MessageEmbed()
                        .setColor('RED')
                        .setDescription(`The given user is not in the server, or it may be an invalid user/userID. If you feel this is a bug, please ping <@559200051629654026>\n\`\`\`.jail <mention/userID>\`\`\``)
                    return message.channel.send(notInServer)
                } else if (findUser) {
                    member = findUser;
                }
            } else if (member) {
                let getUser = await message.guild.members.cache.get(`${member.id}`)
                member = getUser;
            }

            let jailed = new Discord.MessageEmbed()
                .setColor('GREEN')
                .setDescription(`Successfully jailed ***${member.user.tag}***!`)

            let jailError = new Discord.MessageEmbed()
                .setColor('RED')
                .setDescription(`I couldn't jail that user! It could be because they are above me in the role hierarchy, or simply because I lack permissions`)

            try {
                member.roles.add(jailRole.id);
                member.roles.remove(citizenRole.id);
                message.channel.send(jailed);
            } catch (error) {
                message.channel.send(me);
                console.log(error.stack);
            }
        } else if (option === "2") {
            let jailRole = message.guild.roles.cache.find(r => r.id === "814204753407770754");
            let citizenRole = message.guild.roles.cache.find(r => r.id === "811517339005747211");

            let member = message.mentions.users.first();

            if (!member) {
                let userID = args[0];
                let findUser = await message.guild.members.cache.get(`${userID}`);
                if (!findUser) {
                    const notInServer = new Discord.MessageEmbed()
                        .setColor('RED')
                        .setDescription(`The given user is not in the server, or it may be an invalid user/userID. If you feel this is a bug, please ping <@559200051629654026>\n\`\`\`.jail <mention/userID>\`\`\``)
                    return message.channel.send(notInServer)
                } else if (findUser) {
                    member = findUser;
                }
            } else if (member) {
                let getUser = await message.guild.members.cache.get(`${member.id}`)
                member = getUser;
            }

            let jailed = new Discord.MessageEmbed()
                .setColor('GREEN')
                .setDescription(`Successfully jailed ***${member.user.tag}***!`)

            let jailError = new Discord.MessageEmbed()
                .setColor('RED')
                .setDescription(`I couldn't jail that user! It could be because they are above me in the role hierarchy, or simply because I lack permissions`)

            try {
                member.roles.add(jailRole.id);
                member.roles.remove(citizenRole.id);
                message.channel.send(jailed);
            } catch (error) {
                message.channel.send(me);
                console.log(error.stack);
            }
        }
    }
}
