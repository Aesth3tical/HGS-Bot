const Discord = require('discord.js');
const bankDB = require('quick.db');
const acctNumber = require('generate-password');

module.exports = {
    name: 'bank',
    description: 'bank options',
    async execute (client, message, args) {
        let user = message.author.id;
        console.log(user)
        let member = message.guild.members.cache.get(user);
        let userBankAct = bankDB.get(`${user}.bank`);
        let option = args[0];
        if (!option) return;

        if (option === 'setup') {
            if (userBankAct) {
                const alreadyExists = new Discord.MessageEmbed()
                    .setColor('RED')
                    .setDescription('You already have a bank! Run ``.bank view`` to view it')
                return message.channel.send(alreadyExists)
            } else if (!userBankAct) {
                // ready up bank variables
                let pin;
                let name;

                // ready up collection variables
                const filter = msg => msg.author.id === message.author.id;
                const options = {
                    max: 1,
                    time: 30000,
                    errors: ['time']
                }

                // name embed
                const embed = new Discord.MessageEmbed()
                    .setColor('GREEN')
                    .setFooter('Prompt will expire in 30 seconds')

                const embed2 = new Discord.MessageEmbed()
                    .setColor('GREEN')
                
                const pc = new Discord.MessageEmbed()
				    .setColor('RED')
				    .setDescription('Promt cancelled')

                let xd = await member.send(embed.setDescription('Please give a name to be attached to your account!'));
                message.react('📨');
                let collector = await message.author.dmChannel.awaitMessages(filter, options).catch(nameCollector => xd.channel.send(pc));
                name = collector.first().content
                console.log(name)
                await message.author.dmChannel.send(embed2.addField('Account Name:', name, false));

                let xd2 = await member.send(embed.setDescription('Please give a PIN to be attached to your account (something you\'ll remember)!'));
                let collector2 = await message.author.dmChannel.awaitMessages(filter, options).catch(pinCollector => message.channel.send(pc));
                pin = collector2.first().content;
                console.log(pin)
                let sendMsg = await message.author.dmChannel.send(embed2.addField('PIN:', pin, false));

                let botMsg = await xd.channel.send({ embed: {
                    color: 'GREEN',
                    description: 'Creating account...\nContacting bank'
                }});
                let number = await acctNumber.generate({
                    length: 10,
                    numbers: true,
                    lowercase: false,
                    uppercase: false
                })
                botMsg.edit({ embed: {
                    color: 'GREEN',
                    description: 'Creating account...\nAssigning account number'
                }})
                sendMsg.edit({ embed: {
                    color: 'GREEN',
                    fields: [
                        { name: 'Account Name:', value: name, inline: false },
                        { name: 'PIN:', value: pin, inline: false },
                        { name: 'Account Number:', value: number, inline: false}
                    ]
                }})
                botMsg.edit({ embed: {
                    color: 'GREEN',
                    description: 'Creating account...\nAssigning credentials'
                }})
                botMsg.edit({ embed: {
                    color: 'GREEN',
                    description: 'Account created!'
                }});
                await bankDB.push(`${user}.bank.credentials`, { name: name, PIN: pin, number: number });
            }
        
        // Delete Account
        } else if (option === 'delete') {
            const confirm = new Discord.MessageEmbed()
                .setColor('GREEN')
                .setDescription('Please react below to confirm the deletion')
                .setFooter('This prompt will expire in 10 seconds')
    
            const confError = new Discord.MessageEmbed()
                .setColor('RED')
                .setDescription('Prompt expired')
    
            let botMsg = await message.channel.send(confirm);
            botMsg.react('👍')
    
            const filter = (reaction, user) => {
                return reaction.emoji.name === '👍' && user.id === message.author.id;
            };
            const options = {
                max: 1,
                time: 10000,
                errors: ['time']
            }
    
            botMsg.awaitReactions(filter, options)
                .then(collected => {
                    if (collected.size === 1) {
                        bankDB.delete(`${user}.bank`);
                        return botMsg.edit({ embed: {
                            color: 'GREEN',
                            description: 'Account deleted successfully!'
                        }})
                    } else if (collected.size !== 1) {
                        return message.channel.send(confError)
                    }
                });
        
        // View account
        } else if (option === "view") {   
            if (!userBankAct) {
                const noView = new Discord.MessageEmbed()
                    .setColor('RED')
                    .setDescription(`You don't have a bank account yet! Run \`\`.bank setup\`\` to create one!`)
                return message.channel.send(noView)
            } else if (userBankAct) {
                let credentials = bankDB.get(`${user}.bank.credentials`)[0];
                const view = new Discord.MessageEmbed()
                    .setColor('GREEN')
                    .setTitle(`${member.user.tag}'s Bank`)
                    .addFields(
                        { name: "Name:", value: `${credentials.name}`, inline: false },
                        { name: 'Account PIN:', value: `${credentials.PIN}`, inline: false },
                        { name: "Account Number:", value: `${credentials.number}`, inline: false }
                    )
                member.send(view)
                message.react('📨');
            }
        }
    }
}