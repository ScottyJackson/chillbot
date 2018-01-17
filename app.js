const auth = require('./auth.json');
const token = auth.token;

const badwordsObj = require('badwords/object');

const giphy = require('giphy-api')(auth.giphy_key);
const Discord = require('discord.js');
const client = new Discord.Client();

let guild;
const memberMap = new Map(); // mapping from username to id 
const christianImgs = [
    'https://media.discordapp.net/attachments/159252596224163840/402970414525054976/6bb.png',
    'https://cdn.discordapp.com/attachments/159252596224163840/402970524759883791/rimt2b0dh6sy.png',
    'https://cdn.discordapp.com/attachments/159252596224163840/402970661385142291/4b4.png',
    'https://cdn.discordapp.com/attachments/159252596224163840/403063985903108096/a3fbabb607cf82691e79d479a43a1dfb.png',
];

client.on('ready', () => {
    console.log('Locked and Loaded!');
    guild = client.guilds.first();
    guild.members.forEach((member, id) => {
        memberMap.set(member.user.username, id);
    });
});

client.on('message', async msg => {
    if (msg.author.bot) return;

    const args = msg.content.trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    if (cmd === 'gifme') {
        const query = args.join(' ');
        giphy.search(query).then(res => {
            const data = res.data;
            const gif = data[Math.floor(Math.random() * data.length)];

            const imgUrl = gif.images.original.url;
            const title = args
                .map(x => x.charAt(0).toUpperCase() + x.slice(1))
                .join(' ');            
            const color = Math.floor(Math.random() * 16777216);
            msg.channel.send(createRichEmbed(imgUrl, title, color));
        });
    }

    if (args.concat(cmd).some(x => x in badwordsObj)) {
        const imgUrl = 
            christianImgs[Math.floor(Math.random() * christianImgs.length)];
        const color = 9969929;
        const title = 'This is a Christian Server'
        msg.channel.send(createRichEmbed(imgUrl, title, color));
    }
    
    if (msg.content.startsWith('say hello')) {
        msg.channel.send('Hello World!', {'tts': true});
    }
    if (msg.content.startsWith('call bear a cuck')) {
        msg.channel.send('<@108788474563325952>, you are a cuck!', {'tts': true});
    }
    if (msg.content.startsWith('excuse me')) {
        const embed = new Discord.RichEmbed({
            url: 'https://media.giphy.com/',
            image: {
                url: 'https://media.giphy.com/media/l3q2K5jinAlChoCLS/giphy.gif'
            },
        });
        console.log(embed);
        msg.channel.send({embed});
    }
});

const createRichEmbed = (url, title, color) => new Discord.RichEmbed({
    title: title,
    url: url,
    color: color,
    footer: {
        text: 'ChillBot - Chillest of the Bots',
    },
    image: {
        url: url
    },
});

client.login(token);

