const Discord = require('discord.js');

module.exports.run = async(bot, message, args, prefix)=>{
  function getUser(message, args){
    let user = message.guild.member(message.mentions.users.first());    
			if(!args) return message.channel.send(':x:please specify an user');
			if(!user){
				user = message.guild.members.filter(function(m){
					if(m.nickname){
						if(m.nickname.toLowerCase().includes(args)){
							return true;
						}
					}
					if(m.user.username.toLowerCase().includes(args)){
						return true;
					}
				}).first();
				if(!user){
					user = message.guild.members.filter(function(m){
						if(m.nickname){
							return encloses(m.nickname.toLowerCase(), args);
					}
						return encloses(m.user.username.toLowerCase(), args);
					}).first();
					if(!user) throw "User doesn't exist";
				} 
			} 
			return user;
  }
    
  try{
    let user = getUser(message, args).user;
    if(!args) user = message.author;
    let embed = new Discord.RichEmbed()
    .setAuthor(`User: ${user.username}`,user.avatarURL)
    .setTitle(`Id: ${user.id}`)
    .setThumbnail(user.avatarURL)
    .addField("Nickname", message.guild.member(user).nickname)
    .addField("Status",message.guild.member(user).presence.status)
    .addField(`Account created at:`, user.createdAt)
    .addField(`User joined at:`, message.guild.member(user).joinedAt)
    .setColor("#36393F");
    return message.channel.send(embed);
  } catch(e) {
    return message.channel.send(`Error: ${e}`);
  }
}
  
  module.exports.help = {
    name: "userinfo",
    description: `Userinfo help
    Gets one user's info
    
    Usage: \${prefix}userinfo [@user]`
  }
  
