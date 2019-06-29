const Discord = require("discord.js");

module.exports.run = async (bot, message, args, prefix) => {
  if(args && bot.commands.get(args)){
    let description = bot.commands.get(args).help.description
    while(description.includes('${prefix}')){
      description = description.replace('${prefix}',prefix)
    }
    return message.channel.send(description)
  } else {
    let embed = new Discord.RichEmbed()
    .setAuthor(`${bot.user.username} Commands:`)
    .setColor('#36393F')
    .setThumbnail(bot.user.displayAvatarURL)
    .setDescription(`The prefix right now is: ${prefix}\n Use \`${prefix}help <command> \` to get info about that command` )
    .addField('Commands', '=, color, download, encode, id, latex, link, market, random, search, setprefix, translate, userinfo')
    .setFooter(`${bot.user.username} created by Pineapple#5374 2019`);
    return message.channel.send(embed);
  }
}

module.exports.help = {
  name: "help",
  description:`:question: | **Command Help** 
    Help is a command to get a description of a command

    **Usage**: \${prefix}help [Command]

    **Examples**:
    \`\${prefix}help =\`
    `
}

