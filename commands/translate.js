require("dotenv").config()
const key = process.env.YANDEXKEY;
const translate = require('yandex-translate')(key);
let last = ''
let trans = ''

module.exports.run = async(bot, message, args, prefix)=>{
  await message.channel.fetchMessages({limit:2})
    .then(messages=>{return last = messages.last().content})
    .catch(err=>console.log(err));
  if(!args.includes('|')){
    if(!args){
      trans = last;
    } else {
      trans = args;
    }
    translate.translate(trans, { to: 'en' }, function(err, res){
      if(err){ message.channel.send(`:x:Error: ${err}`) };
      if(res.text){
        message.channel.send('Translation: ' + res.text[0])
      } else {
        message.channel.send(':x:Error: please check your input');
      }
    }); 
  } else if(args.split('|')[0].length == 2){
    if(!args.split('|')[1]){
      trans = last;
    } else {
      trans = args.split('|')[1];
    }
    translate.translate(trans, { to: args.split('|')[0]}, function(err, res){
      if(err){message.channel.send(`:x:Error: ${err}`) };
      if(res.text){
        message.channel.send('Translation: ' + res.text[0])
      } else {
        message.channel.send(':x:Error: please check your input');
      }
    });
  } else {
    message.channe.send(':x:syntax error');
  }
  return
}

module.exports.help = {
  name: "translate",
  description: `:globe_with_meridians:| Translate Help
    Translate is a command that translate messages
  
    Usage: \${prefix}translate [language]| [text]
    
    If no language is specified, the default will be English
    If no text is specified, the default will be the last message sent

    Example:
    \`\${prefix}translate Hola\`
    \`\${prefix}translate es| Hello\`
}

