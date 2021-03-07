const html2md = require('html2markdown');
const { MessageEmbed } = require('discord.js');
const { decode } = require('he');
const fetch = require('node-fetch');
const text = require(`${process.cwd()}/util/string`);

module.exports = {

    //Information about command
    name: "steam",
    description: "Show Steam Information Of Your Given Name!",
    usage: "",
    enabled: true,
    aliases: [],
    category: "Fun",
    memberPermissions: [],
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
    //Settings for command
    nsfw: false,
    ownerOnly: false,
    cooldown: 0,

    //Execute to command once the settings have been checked
    async execute(client, message, args) {
        const query = args.join(' ') || 'Doki Doki Literature Club';

        const res = await fetch(`https://store.steampowered.com/api/storesearch/?cc=us&l=en&term=${encodeURI(query)}`)
            .then(res => res.json())
            .catch(() => null);

        if (!res || !res.total) {
            return message.channel.send(`\\❌ Could not find **${query}** on <:steam:767062357952167946> steam`);
        };

        const body = await fetch(`https://store.steampowered.com/api/appdetails/?cc=us&l=en&appids=${res.items[0].id}`)
            .then(res => res.json())
            .catch(() => null);

        if (!body) {
            return message.channel.send(`\\❌ Could not find **${query}** on <:steam:767062357952167946> steam`);
        };

        const data = body[res.items[0].id].data;
        const platformLogo = { windows: '<:windows:815846104956534824>', mac: '<:mac:815846107829108777>', linux: '<:linux:815846104087265281>' };
        const platformrequirements = { windows: 'pc_requirements', mac: 'mac_requirements', linux: 'linux_requirements' };
        const current = (data.price_overview?.final/ 100 || 'Free').toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        const original = (data.price_overview?.initial/ 100 || 'Free').toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        const price = current === original ? current : `~~~${original}~~~ ${current}`;
        const platforms = Object.entries(data.platforms).filter(([platform, has]) => has)
            .map(([platform]) => {
                return {
                    name: '\u200b', inline: true,
                    value: `${platformLogo[platform]} ${decode(html2md(data[platformrequirements[platform]].minimum)).split('* **Additional Notes:')[0]}`
                }
            });
        platforms[0].name = 'System Requirements';

        return message.channel.send(
            new MessageEmbed()
                .setColor(0x101D2F)
                .setTitle(data.name)
                .setImage(res.items[0].tiny_image)
                .setURL(`https://store.steampowered.com/app/${data.steam_appid}`)
                .setFooter(`Steam @ Steam.Inc©️  | \©️${new Date().getFullYear()} Kei`)
                .addFields([
                    { name: 'Price', value: `•\u2000 ${price}`, inline: true },
                    { name: 'Metascore', value: `•\u2000 ${data.metacritic?.score || '???'}`, inline: true },
                    { name: 'Release Date', value: `•\u2000 ${data.release_date?.data || '???'}`, inline: true },
                    { name: 'Developers', value: data.developers.map(m => `• ${m}`).join('\n'), inline: true },
                    { name: 'Categories', value: data.categories.map(m => `• ${m.description}`).join('\n'), inline: true },
                    { name: 'Genres', value: data.genres.map(m => `• ${m.description}`).join('\n'), inline: true },
                    { name: '\u200b', value: text.truncate(decode(data.detailed_description.replace(/(<([^>]+)>)/ig, ' ')), 980) },
                    //{ name: 'Supported Languages', value: `\u2000${text.truncate(html2md(data.supported_languages), 997)}` },
                    ...platforms
                ])
        );
        /*const query = args.join(' ');
        
                // Input Checking
                (async () => {
                    if (!query || args.length < 1) {
                        const em = new Discord.MessageEmbed()
                            .setAuthor(message.member.displayName, message.author.displayAvatarURL)
                            .setTitle('Please provide something to search for')
                            .setDescription(`Incorrect Usage: p!steam <game search>`)
                            .setTimestamp();
                        return message.channel.send(em);
                    }

                    // Executing
                    const search = await snekfetch
                        .get('https://store.steampowered.com/api/storesearch')
                        .query({
                            cc: 'us',
                            l: 'en',
                            term: query
                        });

                    if (!search.body.items.length) return message.channel.send(`No results found for **${query}**!`);

                    const {
                        id,
                        tiny_image
                    } = search.body.items[0];

                    const {
                        body
                    } = await snekfetch
                        .get('https://store.steampowered.com/api/appdetails')
                        .query({
                            appids: id
                        });

                    const {
                        data
                    } = body[id.toString()];
                    //const current = data.price_overview ? `₹${data.price_overview.final / 100}` : 'Free';
                    //const original = data.price_overview ? `₹${data.price_overview.initial / 100}` : 'Free';
                    //const price = current === original ? current : `~~${original}~~ ${current}`;
                    const platforms = [];
                    if (data.platforms) {
                        if (data.platforms.windows) platforms.push('Windows');
                        if (data.platforms.mac) platforms.push('Mac');
                        if (data.platforms.linux) platforms.push('Linux');
                    }

                    const embed = new Discord.MessageEmbed()
                        .setColor(0x101D2F)
                        .setAuthor('Steam', 'https://i.imgur.com/xxr2UBZ.png', 'http://store.steampowered.com/')
                        .setTitle(data.name)
                        .setURL(`http://store.steampowered.com/app/${data.steam_appid}`)
                        .setImage(tiny_image)
                        //.addField('❯\u2000Price', `•\u2000 ${price}`, true)
                        .addField('❯\u2000Metascore', `•\u2000 ${data.metacritic ? data.metacritic.score : '???'}`, true)
                        .addField('❯\u2000Recommendations', `•\u2000 ${data.recommendations ? data.recommendations.total : '???'}`, true)
                        .addField('❯\u2000Platforms', `•\u2000 ${platforms.join(', ') || 'None'}`, true)
                        .addField('❯\u2000Release Date', `•\u2000 ${data.release_date ? data.release_date.date : '???'}`, true)
                        .addField('❯\u2000DLC Count', `•\u2000 ${data.dlc ? data.dlc.length : 0}`, true)
                        .addField('❯\u2000Developers', `•\u2000 ${data.developers ? data.developers.join(', ') || '???' : '???'}`, true)
                        .addField('❯\u2000Publishers', `•\u2000 ${data.publishers ? data.publishers.join(', ') || '???' : '???'}`, true);
                    return message.channel.send(embed)
                })();*/
    }
}