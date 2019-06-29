const Discord = require('discord.js')

module.exports.run = async(bot, message, args, prefix)=>{
  let user = message.guild.member(message.mentions.users.first());
  const embed = new Discord.RichEmbed().setColor('#36393F');
  if(!user){
    embed
      .setTitle(`${message.author.username})
      .addField('your id is:', `${message.author.id}`)
      .addField('The server id is:', `${message.guild.id}`)
      .addField('The channel id is:', `${message.channel.id}`);
  } else {
    embed
      .setTitle(`${user.user.username}'s id is: user.id`);
  }
  return message.channel.send(embed);
}

module.exports.help = {
  name: "id",
  description: `:1234: | Id help
    id is a command to get your/someone's id.
  
  Usage: \${prefix}id [@user]
  `
}
