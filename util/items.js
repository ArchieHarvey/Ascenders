const Array = [
    {
        name: 'Common Leaf',
        id: 'common_leaf',
        description: 'A leaf which can be found very easily!',
        canUse: false,
        canBuy: false,
        displayOnShop: false,
        sellAmount: 10,
        price: 0,
        keep: true,
        run: async (bot, message, args) => {

        }
    },
    {
        name: 'Uncommon Leaf',
        id: 'uncommon_leaf',
        description: 'A leaf which cannot be found easily!',
        canUse: false,
        canBuy: false,
        displayOnShop: false,
        sellAmount: 20,
        price: 0,
        keep: true,
        run: async (bot, message, args) => {
            
        }
    },
    {
        name: 'Rare Leaf',
        id: 'rare_leaf',
        description: 'A leaf which can be found rarely!',
        canUse: false,
        canBuy: false,
        displayOnShop: false,
        sellAmount: 30,
        price: 0,
        keep: true,
        run: async (bot, message, args) => {
            
        }
    },
    {
        name: 'Legendary Leaf',
        id: 'legendary_leaf',
        description: 'A leaf which can be found very rarely!',
        canUse: false,
        canBuy: false,
        displayOnShop: false,
        sellAmount: 50,
        price: 0,
        keep: true,
        run: async (bot, message, args) => {
            
        }
    },
    {
        name: 'Short Stick',
        id: 'short_stick',
        description: 'A stick which is short in size and short in price too!',
        canUse: false,
        canBuy: false,
        displayOnShop: false,
        sellAmount: 10,
        price: 0,
        keep: true,
        run: async (bot, message, args) => {
            
        }
    },
    {
        name: 'Medium Long Stick',
        id: 'medium_long_stick',
        description: 'A stick which is long and strong! *not to be used for fighting purposes*',
        canUse: false,
        canBuy: false,
        displayOnShop: false,
        sellAmount: 20,
        price: 0,
        keep: true,
        run: async (bot, message, args) => {
            
        }
    },
    {
        name: 'Long Stick',
        id: 'long_stick',
        description: 'A stick which is as long as your arm! *no dont measure it*',
        canUse: false,
        canBuy: false,
        displayOnShop: false,
        sellAmount: 30,
        price: 0,
        keep: true,
        run: async (bot, message, args) => {
            
        }
    },
    {
        name: 'Very Long Stick',
        id: 'very_long_stick',
        description: 'A STICK which is very long that its longer than your legs',
        canUse: false,
        canBuy: false,
        displayOnShop: false,
        sellAmount: 50,
        price: 0,
        keep: true,
        run: async (bot, message, args) => {
            
        }
    },
    {
        name: 'Pebble',
        id: 'pebble',
        description: 'A pebble which is very smooth you might drop it somewhere',
        canUse: false,
        canBuy: false,
        displayOnShop: false,
        sellAmount: 10,
        price: 0,
        keep: true,
        run: async (bot, message, args) => {
            
        }
    },
    {
        name: 'Small Stone',
        id: 'small_stone',
        description: 'A small but valuable stone!',
        canUse: false,
        canBuy: false,
        displayOnShop: false,
        sellAmount: 20,
        price: 0,
        keep: true,
        run: async (bot, message, args) => {
            
        }
    },
    {
        name: 'Big Stone',
        id: 'big_stone',
        description: 'A big stone which is sharp, you might hurt yourself holding it',
        canUse: false,
        canBuy: false,
        displayOnShop: false,
        sellAmount: 30,
        price: 0,
        keep: true,
        run: async (bot, message, args) => {
            
        }
    },
    {
        name: 'Large Stone',
        id: 'large_stone',
        description: 'A stone which is very big for your hands sadly',
        canUse: false,
        canBuy: false,
        displayOnShop: false,
        sellAmount: 50,
        price: 0,
        keep: true,
        run: async (bot, message, args) => {
            
        }
    },
    {
        name: 'Cardboard Box',
        id: 'cardboard_box',
        description: 'A box which is common to find!',
        canUse: true,
        canBuy: true,
        displayOnShop: false,
        sellAmount: 0,
        price: 100,
        keep: true,
        run: async (bot, message, args, schema) => {
            const data = schema.findOne({
                userID: message.author.id
            })
            msg = await message.channel.send(`You opened ${args[1]} cardboard box(es) and found...`)
            const amount = parseInt(args[1])
            numbers = []
            let i=0;
            for(i=0;i<amount;i++){
                a = Math.floor(Math.random() * 100)
                numbers.push(Math.ceil(a/3))
            }
            setTimeout(() => {
                msg.edit(`${msg.content.split('...')[0]}\n${numbers.join(' Common Leaves\n')} Common Leaves!`)
            }, 5000)
        }
    }
]
module.exports = Array