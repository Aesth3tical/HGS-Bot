const Discord = require('discord.js');
const bankDB = require('quick.db');
const itemNumber = require('generate-password');

module.exports = {
    name: 'item',
    description: 'item options',
    async execute (client, message, args) {
        let items = bankDB.get('items');
        let option = args[0];
        if (!option) return;
        if (option === 'create') {
            // ready up item variables
            let name;
            let price;
            let description;
            let exists;

            // ready up collection variables
            const filter = msg => msg.author.id === message.author.id;

            const options = {
                max: 1,
                time: 30000,
                errors: ['time']
            }

            const embed = new Discord.MessageEmbed()
                .setColor('GREEN')
                .setFooter('Prompt will expire in 30 seconds')

            const embed2 = new Discord.MessageEmbed()
                .setColor('GREEN')

            const pc = new Discord.MessageEmbed()
        	    .setColor('RED')
        	    .setDescription('Promt cancelled')

            let xd = await message.channel.send(embed.setDescription('Please give a name for the item!'));
            let collector = await message.channel.awaitMessages(filter, options).catch(nameCollector => xd.channel.send(pc));
            name = collector.first().content;
            console.log(name)
            if (items) {
                exists = items.find(i => i.name === name);
                
                if (exists) {
                    const alreadyExists = new Discord.MessageEmbed()
                        .setColor('RED')
                        .setDescription('That item already exists! Prompt cancelled')
                    return message.channel.send(alreadyExists)
                }
            }
            await message.channel.send(embed2.addField('Item Name:', name, false));

            let xd2 = await message.channel.send(embed.setDescription('Please give a price for the item!'));
            let collector2 = await message.channel.awaitMessages(filter, options).catch(priceCollector => message.channel.send(pc));
            price = collector2.first().content;
            console.log(price)
            if (isNaN(price)) {
                const NaN = new Discord.MessageEmbed()
                    .setColor('RED')
                    .setDescription('The given price is not a valid number! Prompt cancelled')
                return message.channel.send(NaN)
            }
            await message.channel.send(embed2.addField('Price:', price, false));

            let xd3 = await message.channel.send(embed.setDescription('Please give a description for the item!'));
            let collector3 = await message.channel.awaitMessages(filter, options).catch(descriptionCollector => message.channel.send(pc));
            description = collector3.first().content;
            console.log(description)
            await message.channel.send(embed2.addField('Description:', description, false));

            let botMsg = await message.channel.send({ embed: {
                color: 'GREEN',
                description: 'Creating Item...\nContacting factory'
            }});
            
            await bankDB.push(`items`, { name: name, price: price, description: description });

            botMsg.edit({ embed: {
                color: 'GREEN',
                description: 'Item created!'
            }});
        
        // View an item
        } else if (option === "view") {
            let name;
            console.log(items)

            let suboption = args.slice(1).join(' ');
            if (!suboption) {
                let itemsMap = items.map(i => i.name).join(('\n'));
                if (itemsMap.length === 0) {
                    const notExist = new Discord.MessageEmbed()
                        .setColor('RED')
                        .setDescription('The shop appears to be empty as of now! Have a clerk or mod run ``.item create`` to add to it')
                    return message.channel.send(notExist)
                }
                const itemsEmbed = new Discord.MessageEmbed()
                    .setColor('GREEN')
                    .setTitle('Items in shop:')
                    .setDescription(`Run \`\`.item view <item name>\`\` to view an item!`)
                    .addField('Items:', itemsMap, false)
                return message.channel.send(itemsEmbed)
            } else if (suboption) {
                let exists = items.find(i => i.name === suboption);
                console.log(exists)
                if (!items || !exists) {
                    const notExist = new Discord.MessageEmbed()
                        .setColor('RED')
                        .setDescription('That item does not exist! Make sure you have correct capitalization, as the bot can\'t detect otherwise as of now >_<')
                    return message.channel.send(notExist)
                } else if (exists) {
                    const info = new Discord.MessageEmbed()
                        .setColor('GREEN')
                        .setTitle(`Item info - ${exists.name}`)
                        .addFields(
                            { name: 'Item name:', value: exists.name, inline: true },
                            { name: 'Price:', value: exists.price, inline: true },
                            { name: 'Description:', value: exists.description, inline: true }
                        )
                    return message.channel.send(info)
                }
            }
        
        // Delete
        } else if (option === "delete") {
            let delName = args.slice(1).join(' ');
            let exists = items.find(c => c.name === delName);
            if (!exists) {
            } else if (exists) {
                let getItems = bankDB.fetch(`items`);
                let filterItems = getItems.filter(i => i.name !== delName);
                bankDB.set(`items`, filterItems);
                
                const deleted = new Discord.MessageEmbed()
                    .setColor('GREEN')
                    .setDescription('Item deleted successfully!')
                return message.channel.send(deleted)
            }
        }
    }
}