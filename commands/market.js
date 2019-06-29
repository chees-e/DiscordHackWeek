require("dotenv").config()
const request = require("request")
const Discord = require("discord.js")
const fs = require("fs")


module.exports.run = async(bot, message, args, prefix)=>{
  const currentdate = new Date();
  let hour = parseInt(currentdate.getHours(), 10);
  let minute = parseInt(currentdate.getMinutes(), 10);
  if(minute < 10) minute = "0" + minute;
  if(!args) return message.channel.send(':x:Please specify stocks/forex you want to check');
  let argArray = args.trim().split(" ");
  if(argArray.length>11) return message.channel.send("Don't try to break the bot");

  try{
    if(argArray[0] == "forex"){
      let base = "CAD"
      if(argArray.length > 1){
        base = argArray[1].toUpperCase()
      }
      await request(getOptions('forex', process.env.WTDTOKEN, base), Forexcallback);
    } else {
      await request(getOptions('stock', process.env.WTDTOKEN, argArray[0]), Stockcallback);
    }
  } catch(e){
    message.channel.send(`Error: ${e}`)
  }
  return ;
  function getOptions(type, accessToken, name){
    if(type == "forex"){
      return {
        url: `https://www.worldtradingdata.com/api/v1/${type}`,
        qs: {
          base: name,
          api_token: accessToken
        } 
      }
    } else if(type == "stock_search"){
      return {
        url: `https://www.worldtradingdata.com/api/v1/${type}`,
        qs: {
          search_term: name,
          api_token: accessToken
        } 
      }
    } else {
      return {
        url: `https://www.worldtradingdata.com/api/v1/${type}`,
        qs: {
          symbol: name,
          api_token: accessToken
        } 
      }
    }
  }

  async function Stockcallback(error, response, body){
    if(error){
      return message.channel.send(`:x:Error: ${error}`);
    }
    let data = JSON.parse(body);
    if(data["data"]){ 
      data = data["data"][0];
    } else {
      await request(getOptions('stock_search', process.env.WTDTOKEN, argArray[0]), Searchcallback);
      return
    }
    let changeEmoji = "";
    let changeNegative = "";
    if(data.day_change>0){
      changeEmoji = ':small_red_triangle:';
      changeNegative = "+";
    } else if(data.day_change<0){
      changeEmoji = ':small_red_triangle_down:';
    } else {
      changeEmoji = ':white_small_square:';
    }

    let embed = new Discord.RichEmbed()
    .setAuthor(`${data.symbol} (${data.name})`)
    .setTitle(`**${data.price}** ${data.currency}  ${changeEmoji}${changeNegative}${data.day_change} (${changeNegative}${data.change_pct}%)`)
    .setDescription(`${data.last_trade_time} (${data.timezone})`)
    .setColor('#36393F')
    .addField("Open: ", data.price_open, true)
    .addField("High: ", data.day_high, true)
    .addField("Low: ", data.day_low, true)
    .addField("Volume: ", data.volume, true)
    .addField("52 week high: ", data['52_week_high'], true)
    .addField("52 week low: ", data['52_week_low'], true)
    .setFooter(`Market: ${data.stock_exchange_short}`);

    return message.channel.send(embed);
  }

  function Usercallback(error, response, body){
    if(error){
      return message.channel.send(`Error: ${error}`);
    }
    const data = JSON.parse(body)
    if(!data["data"]){ 
      return message.channel.send(":x: Error");
    }
    let embed = new Discord.RichEmbed()
    .setAuthor(`${message.author.username}'s followed stocks/indices`)
    .setColor('#36393F');
    for(i in data["data"]){
      let changeEmoji = "";
      let changeNegative = "";
      if(data["data"][i].day_change>0){
        changeEmoji = ':small_red_triangle:';
        changeNegative = "+";
      } else if(data["data"][i].day_change<0){
        changeEmoji = ':small_red_triangle_down:';
      } else {
        changeEmoji = ':white_small_square:';
      }
      embed.addField(`**${data["data"][i].symbol}**: ${data["data"][i].price} ${changeEmoji}${changeNegative}${data["data"][i].day_change} (${changeNegative}${data["data"][i].change_pct}%)`,`${data["data"][i].stock_exchange_short} - ${data["data"][i].last_trade_time} (${data["data"][i].timezone})`);         
    }

    return message.channel.send(embed);
  }

  function Forexcallback(error, response, body){
    if(error){
      return message.channel.send(`Error: ${error}`);
    }
    let data = JSON.parse(body);
    if(!data["data"]){ 
      return message.channel.send(":x: NNo data found");
    }
    let currency = ["USD", "EUR", "JPY", "GBP", "AUD", "CAD", "CHF", "CNY", "NZD"];
    if(argArray.length > 2){
      let Testcurrency = argArray.slice(2);
      currency = [];
      for(i in Testcurrency){
        if(!currency.includes(Testcurrency[i])){
          currency.push(Testcurrency[i]);
        }
      }
    }

    let embed = new Discord.RichEmbed()
    .setTitle(`Foreign Exchange Market: ${data.base}`)
    .setDescription("__________")
    .setColor('#36393F')
    .setFooter(`Today at ${hour}:${minute}`);

    for(i in currency){
      if(data["data"][currency[i]]){
        embed.addField(currency[i], Math.round(data["data"][currency[i]]*100)/100, true);
      }
    }

    return message.channel.send(embed);
  }

  async function Searchcallback(error, response, body){
    if(error){
      return message.channel.send(`Error: ${error}`);
    }
    let data = JSON.parse(body);
    if(data["data"]){ 
      data = data["data"][0];
    } else {
      return message.channel.send(":x: no data found");
    }
    await request(getOptions('stock', process.env.WTDTOKEN, data["symbol"]), Stockcallback);
  }
}
  
module.exports.help = {
  name: "market",
  description: `:chart: | **Market Help** 
    Market is a command that checks the stats of stocks/indices and the foreign exchange rates using WTD.

    **Usage**: \${prefix}market [options] <items>
    
    **Options**
    blank to check your stocks/indices or a specific stock/index
    \`forex\` to check the foreign exchange rates (or use \${prefix}forex)

    **Examples**:
    \`\${prefix}market AMZN\` - Checks the status of Amazon.com
    \`\${prefix}market forex USD\` - Checks the exchange rate of USD to common currencies
    \`\${prefix}market forex USD CAD EUR\` - Checks the exchange rate of USD to CAD and EUR
    `
}
  

