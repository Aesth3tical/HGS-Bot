const Discord = require('discord.js');
const db = require('quick.db');
const { execute } = require('../dev/eval');
const { mod, devs } = require('../../config.json');

module.exports = {
    name: 'custom',
    description: 'Add/remove a custom command',
    async execute (client, message, args) {
        if (!mod.includes(message.author.id)) {
            if (!devs.includes(message.author.id)) return;
        }
        let option = args[0];
        let options = [
            "edit",
            "delete",
            "view"
        ]

        if (!options.includes(option)) {
            let cName = args[0];
            let cCommand = args.slice(1).join(' ');

            await db.push('custom-commands', { name: cName, command: cCommand});
            const added = new Discord.MessageEmbed()
                .setColor('RANDOM')
                .setTitle('Added Command!')
                .addFields(
                    { name: 'Command name:', value: `${cName}`, inline: true},
                    { name: 'Command description', value: `${cCommand}`}
                )
            await message.channel.send(added)
            message.react('✅');
        } else if (option === "edit") {
            let editName = args[1];
            let newCommand = args.slice(2).join(' ');
            let commands = db.get('custom-commands');
            let exists = await commands.find(c => c.name === editName);
            if (!exists) {
                const couldNotFind = new Discord.MessageEmbed()
                    .setColor('RED')
                    .setDescription(`There is no command with that name which exists!`)
                return message.channel.send(couldNotFind)
            } else if (exists) {
                let getCmds = db.fetch(`custom-commands`);
                let filterCmds = getCmds.filter(c => c.name !== editName);
                await db.set(`custom-commands`, filterCmds);
                await db.push(`custom-commands`, { name: editName, command: newCommand });

                const edited = new Discord.MessageEmbed()
                    .setColor('GREEN')
                    .setTitle('Command edited successfully!')
                    .addFields(
                        { name: 'Command name:', value: `${editName}`, inline: true },
                        { name: 'Command description:', value: `${newCommand}`, inline: true }
                    )
                return message.channel.send(edited)
            }
        } else if (option === "delete") {
            let delName = args[1];
            let commands = db.get('custom-commands');
            let exists = await commands.find(c => c.name === delName);
            if (!exists) {
                const couldNotFind = new Discord.MessageEmbed()
                    .setColor('RED')
                    .setDescription(`There is no command with that name which exists!`)
                return message.channel.send(couldNotFind)
            } else if (exists) {
                let getCmds = db.fetch(`custom-commands`);
                let filterCmds = getCmds.filter(c => c.name !== delName);
                await db.set(`custom-commands`, filterCmds);
                
                const deleted = new Discord.MessageEmbed()
                    .setColor('GREEN')
                    .setDescription('Command deleted successfully!')
                return message.channel.send(deleted)
            }
        } else if (option === "view") {
            let commands = db.get('custom-commands');
            let cmdMap = commands.map(c => c.name).join('\n');
            const cmdEmbed = new Discord.MessageEmbed()
                .setColor('RANDOM')
                .setDescription(cmdMap)
            return message.channel.send(cmdEmbed)
        }
    }
}
