const Discord = require('discord.js');

module.exports = {
    name: 'av',
    description: 'get a users\' avatar',
    async execute (client, message, args) {
        let member = message.mentions.users.first();

        if (!member) {
            let userID = args[0];
            let findUser = await message.guild.members.cache.get(`${userID}`);
            if (!findUser) {
                const notInServer = new Discord.MessageEmbed()
                    .setColor('RED')
                    .setDescription(`The given user is not in the server, or it may be an invalid user/userID. If you feel this is a bug, please ping <@559200051629654026>\n\`\`\`.av <mention/userID>\`\`\``)
                return message.channel.send(notInServer)
            } else if (findUser) {
                member = findUser;
            }
        } else if (member) {
            let getUser = await message.guild.members.cache.get(`${member.id}`)
            member = getUser;
        }
        
        const avEmbed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setTitle(`${member.user.tag}'s Avatar`)
            .setImage(member.user.displayAvatarURL({ format: 'png', dynamic: true }))
        return message.channel.send(avEmbed)
    }
}