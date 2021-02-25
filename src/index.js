// Declare Vars
const Discord = require('discord.js');
const client = new Discord.Client()
const fs = require('fs');
const localData = require('quick.db');
const config = require('./config.json');

// Export Client
exports.client = client;

// Setup Command Handler
client.commands = new Map();
const cooldowns = new Discord.Collection();

fs.readdirSync(__dirname + `/commands`).forEach(folder => {
    fs.readdirSync(__dirname + `/commands/${folder}`).forEach(file => {
        const command = require(__dirname + `/commands/${folder}/${file}`);
        client.commands.set(command.name, command);
    })
})

// Ready up bot
client.on('ready', () => {
    console.log(`Ready! Logged in as ${client.user.tag}`);
    client.user.setActivity('HistoricalGovSim', { type: 'PLAYING' });
    client.user.setStatus('dnd');
})

// Message Event
client.on('message', async (message) => {
    if (!message.guild) return;
    let prefix = localData.get('prefix');
    if (prefix === null || !prefix) prefix = config.default_prefix;
    
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    let args = message.content.slice(prefix.length).trim().split(/ +/);

    function go() {
        let commandName = args.shift().toLowerCase();
        const command = client.commands.get(commandName);
        if (!command) return;
        if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Discord.Collection());
        }
        const now = Date.now();
        const timestamps = cooldowns.get(command.name);
        const cooldownAmount = Math.floor(command.cooldown) * 60000;
        let user = message.author;
        if (localData.has(`${user}.cooldown`)) {
            const expirationTime = localData.get(`${user}.cooldown`) + cooldownAmount;
            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 60000;
                const cooldownEmbed = new Discord.MessageEmbed()
                    .setColor('RED')
                    .setDescription(`You must wait ${timeLeft.toFixed()} minutes before using that command again!\n\n(If it says zero that just means less than 1 minute)`)
                return message.channel.send(cooldownEmbed)
            }
        }
        localData.set(`${user}.cooldown`, now);
        setTimeout(() => localData.delete(`${user}.cooldown`), cooldownAmount);
        command.execute(client, message, args);
    }

    let customs = localData.get(`custom-commands`);
    if (!customs) {
        return go()
    }
    let custom = await customs.find(c => c.name === `${args}`);
    if (custom) {
        message.channel.send(custom.command);
    } else if (!custom) {
        go()
    }
});

// Logging
var delLogs = require('./logging-stuff/deleteMessage.js');
client.on('messageDelete', async (message) => {
    delLogs.deleteLog(message, Discord);
})

var editLogs = require('./logging-stuff/editMessage.js');
client.on('messageUpdate', async (oldMessage, newMessage) => {
    editLogs.editLog(oldMessage, newMessage, Discord)
})

client.login(config.token)
