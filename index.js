require('dotenv').config;
const fs = require('fs');
const Discord = require('discord.js');
const bot = new Discord.Client();

bot.commands = new Discord.Collection();


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

bot.on('message`, async (message) => {
       
});


