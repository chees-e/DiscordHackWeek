module.exports.run = async(bot, message, args, prefix)=>{
  await message.channel.send("Here is the authorization link:")
  return message.channel.send('```\nhttps://discordapp.com/api/oauth2/authorize?client_id=592806559135039488&scope=bot\n```')
}

module.exports.help = {
  name: "link",
  description: `This will return the invitation link for this bot`
}
