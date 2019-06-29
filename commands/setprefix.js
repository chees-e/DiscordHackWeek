const prefixes = require("../data/prefix.json");
const fs = require('fs');
require('dotenv').config();

module.exports.run = async (bot, message, args, prefix) => {
  if(!message.member.permissions.toArray().some(p=>["MANAGE_CHANNELS", "ADMINISTRATOR"].includes(p)) )
      return message.channel.send(":x: You need 'MANAGE_CHANNELS' permission!").then(d_msg => { d_msg.delete(3000); });
  if(message.content.split(' ').length == 1) return message.channel.send(":x: Please specify a prefix");
  if(args === prefix) return message.channel.send(":x: Please select a new prefix");
  if(args.split(' ').length>1) return message.channel.send(":x: Please don't include space");
  if(args.length > 3) return message.channel.send(":x: Please choose a shorter prefix");

  try{
    prefixes[message.guild.id] = args

    fs.writeFile("./data/prefix.json", JSON.stringify(prefixes), (err) => {
      if (err) console.log(err)
    });
    message.channel.send('prefix set');
    return;
  } catch(e) {
    return message.channel.send(`Error: ${e}`);
  }
}

module.exports.help = {
  name: "setprefix",
  description: `Setprefix help
  setprefix is a command that allows you to change the prefix of this bot
  
  Usage: \${prefix}setprefix <new prefix>
  `
}
