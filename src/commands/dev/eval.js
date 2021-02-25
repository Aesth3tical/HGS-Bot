const Discord = require('discord.js');
const { devs } = require('./../../config.json');

module.exports ={
    name: 'eval',
    description: 'eval a bit of code',
    async execute (client, message, args) {
        if (!devs.includes(message.author.id)) {
            const noToken = new Discord.MessageEmbed()
                .setColor('RANDOM')
                .setDescription('You don\'t have permission to use this command\n\n*back off...*')
            return message.channel.send(noToken)
        }

        if (message.content.includes('message.channel.send(client.token)')) return message.channel.send('I can\'t send my token, sorry man')

        var result = message.content.split(" ").slice(1).join(" ")
        let evaled = await eval(result);

        if (typeof evaled === "object") evaled = JSON.stringify(evaled);

        if (typeof evaled !== "number" && typeof evaled !== "string" && typeof evaled !== "boolean") evaled = `Output could not be converted to text (output was of type: ${typeof evaled}).`;

        const evalEmbed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .addFields(
                { name: '**Input:**', value: `\`\`\`js\n${args}\`\`\``, inline: false },
                { name: '**Output:**', value: `\`\`\`js\n${evaled}\`\`\``, inline: false }
            );
        message.channel.send(evalEmbed)
    },
}
