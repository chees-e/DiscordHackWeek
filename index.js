require('dotenv').config;
const fs = require('fs');
const Discord = require('discord.js');
const bot = new Discord.Client();

let prefixes = require('./prefix.json');
let prefix = 'p=';


bot.commands = new Discord.Collection();

async function fsUpdateFile(file, data) = {
  fs.writeFile(file, JSON.stringify(data), (err) => {
    console.log(err)
  });
}

fs.readdir('./commands/', (err, files) => {
  if(err) console.log(err);
  let commands = files.filter(f => f.split('.').pop() === 'js');
  commands.forEach(c => {
    let get = require(`./commands/${c}`);
    bot.commands.set(get.help.name, get);
  });
});
  
bot.on('ready', () => {
  console.log('bot is ready');
  bot.user.setActivity('use **p=help** for help');
});

bot.on('error', (err) => {
  console.log(`Error: ${err}`);
});

bot.on('disconnect', () => {
  console.log('bot disconnected');
});

bot.on('reconnecting', () => {
  console.log('bot recconnecting');
});

bot.on('guildCreate', (guild) => {
  console.log(`bot has been added to ${guild.name}, (ID: ${guild.id})`);
});

bot.on('guildDelete', (guild) => {
  console.log(`bot has been removed from ${guild.name}, (ID: ${guild.id})`);
});

bot.on('message', async (message) => {
  const op = m => m.author.id === message.author.id;
  let messageArray = message.content.split(' ');
  if(prefixes[message.guild.id]){
    prefix = prefixes[message.guild.id]
  } else {
    prefixes[message.guild.id] = 'p=';
    await jsUpdateFile('./data/prefix.json', prefixes);
  }
  let cmd = messageArray[0].slice(prefix.length);
  let args = message.content.slice(cmd.length + 1);
  
  if(message.author.bot) return;
  
  if(cmd.slice(0,prefix.length) === prefix){
    let commandfile = bot.commands.get(cmd.slice(prefix.length));
    if(commandfile){
      commandfile.run(bot,message,args,prefix);
    }
  }
});

bot.login(process.env.TOKEN);





