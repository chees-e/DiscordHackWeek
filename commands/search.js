require('dotenv').config();
const request = require("request");
const Discord = require('discord.js');
const GoogleImages = require("google-images");
const ytSearch = require('youtube-search');

module.exports.run = async (bot, message, args, prefix) => {
  if(message.content.split(' ')[0] === `${prefix}search`){
    if(args.split(' ')[0] === 'video'||args.split(' ')[0] === '-v'){
      if(args.split(' ')[0] === 'video'){args = args.slice(6)} else if (args.split(' ')[0] === '-v'){args = args.slice(3)}
      let opts = {
        maxResults: 1,
        key: process.env.YTAPIKEY,
        type: "video"
      };
      ytSearch(args, opts, function(err, results) {
        if(err) return console.log(err);
        if(results[0]){
          message.channel.send(results[0].link);
        } else {
          message.channel.send(":x:No results").then(m=> {m.delete(5000)});
        }
      });
      return;
    } else if(args.split(' ')[0] === 'image'||args.split(' ')[0] === '-i'){
      if(args.split(' ')[0] === 'image'){
        args = args.slice(6);
      } else if (args.split(' ')[0] === '-i'){
        args = args.slice(3);
      }
      const GIC = new GoogleImages(process.env.CSEID, process.env.YTAPIKEY);
      const embed = new Discord.RichEmbed()
      await GIC.search(args)
      .then(images => {
        if(images[0]){
          embed
          .setAuthor(`Search results for: ${args}`)
          .setColor('#36393F')
          .setFooter("Results from Google")
          .setImage(images[0]['url']);
        } else {
          return message.channel.send(":x: No results found")
        }
      });
      return message.channel.send(embed).catch(e=>console.log(e))
    }
  }

  function getOptions(query, app){
    return {
      url: `https://api.duckduckgo.com/`,
      qs: {
        q: query,
        format: 'json',
        pretty: '1',
        t: app
      },
    }
  }

  function callback(error, response, body){
    if(error){
      console.log(error)
      return
    }
    const data = JSON.parse(body)
    if(data){
      let result = 'No results found'
      let URL = ''
      let AbstractURL = data.AbstractURL
      if(data.RelatedTopics[0]){
        if(data.RelatedTopics[0].Text){
          result = data.RelatedTopics[0].Text
          URL = data.RelatedTopics[0].Icon.URL
        }
      }
      if(data.Abstract){
        result = data.Abstract
      }
      if(result.length > 255){
        result = result.slice(0, 250) + "..."
      }
      if(data.Image){
        URL = data.Image
      }
  
      if(!AbstractURL){
        AbstractURL = `Oof, No results`
      }

      let embed = new Discord.RichEmbed()
      embed
      .setAuthor(`Search results for: ${args}`)
      .setColor('#36393F')
      .addField(result, AbstractURL)
      .setImage(URL)
      .setFooter("Results from DuckDuckGo")
      return message.channel.send(embed)
    }
  }

  request(getOptions(args, "DiscordBot"), callback)
  return;
}
  
module.exports.help = {
  name: "search",
  description: `:mag_right: | **Search Help** 
  Search is a command that searches an item on the internet.
  **Usage**: \${prefix}search [options] <keyword>
  
  **Options**:
  \`video\` or \`-v\` - Searches across youtube and returns the url
  \`image\` or \`-i\` - Searches across the internet and returns a relevant image
  default - Searches across DuckDuckGo and returns a result

  **Examples**:
  \`\${prefix}search keanu reeves\`
  \`\${prefix}search -i obama\`
  \`\${prefix}search video Africa toto\`
  `
}
  
  
  
