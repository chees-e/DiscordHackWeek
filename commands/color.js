const Discord = require('discord.js')
const convert = require('color-convert');
let gm = require('gm').subClass({imageMagick: true});
let colors = ['black', 'silver', 'gray', 'white', 'maroon', 'red', 'purple', 'fuchsia', 'green', 'lime', 'olive', 'yellow', 'navy', 'blue', 'teal', 'aqua', 'orange',
'aliceblue', 'antiquewhite', 'aqua', 'aquamarine', 'azure', 'beige', 'bisque', 'blanchedalmond', 'blueviolet', 'brown', 'burlywood',
'cadetblue', 'chartreuse', 'chocolate', 'coral', 'cornflowerblue', 'cornsilk', 'crimson', 'cyan', 'darkblue', 'darkcyan', 'darkgoldenrod',
'darkgray', 'darkgreen', 'darkgrey', 'darkkhaki', 'darkmagenta', 'darkolivegreen', 'darkorange', 'darkorchid', 'darkred', 'darksalmon', 'darkseagreen', 'darkslateblue',
'darkslategray', 'darkslategrey', 'darkturquoise', 'darkviolet', 'deeppink', 'deepskyblue', 'dimgray', 'dimgrey', 'dodgerblue',
'firebrick', 'floralwhite', 'forestgreen', 'fuchsia', 'gainsboro', 'ghostwhite', 'gold', 'goldenrod', 'greenyellow', 'grey', 'honeydew', 'hotpink',
'indianred', 'indigo', 'ivory', 'khaki', 'lavender', 'lavenderblush', 'lawngreen', 'lemonchiffon', 'lightblue', 'lightcoral', 'lightcyan', 'lightgoldenrodyellow',
'lightgray', 'lightgreen', 'lightgrey', 'lightpink', 'lightsalmon', 'lightseagreen', 'lightskyblue', 'lightslategray', 'lightslategrey', 'lightsteelblue', 'lightyellow', 'limegreen', 'linen', 
'magenta', 'mediumaquamarine', 'mediumblue', 'mediumorchid', 'mediumpurple', 'mediumseagreen', 'mediumslateblue', 'mediumspringgreen', 'mediumturquoise', 'mediumvioletred', 'midnightblue', 'mintcream', 'mistyrose', 'moccasin', 
'navajowhite', 'oldlace', 'olivedrab', 'orangered', 'orchid', 'palegoldenrod', 'palegreen', 'paleturquoise', 'palevioletred', 'papayawhip', 'peachpuff', 'peru', 'pink', 'plum', 'powderblue',
'rosybrown', 'royalblue', 'saddlebrown', 'salmon', 'sandybrown', 'seagreen', 'seashell', 'sienna', 'skyblue', 'slateblue', 'slategray', 'slategrey', 'snow', 'springgreen', 'steelblue',
'tan', 'thistle', 'tomato', 'turquoise', 'violet', 'wheat', 'whitesmoke', 'yellowgreen', 'rebeccapurple']

module.exports.run = async(bot, message, args, prefix)=>{
  if(!args){
    return sendColor(message, Math.floor(Math.random() * 16777215).toString(16));
	} else if(colors.includes(args.toLowerCase())){
    return sendColor(message, convert.keyword.hex(args));
  } else if(args.includes('rgb(')){
    let rgb = args.slice(args.indexOf("(")+1, args.indexOf(")")).trim();
    if(rgb.split(',').length == 3){
      let c1 = rgb.split(',')[0];
      let c2 = rgb.split(',')[1];
      let c3 = rgb.split(',')[2];
      return sendColor(message, convert.rgb.hex(c1,c2,c3));
    }
    return message.channel.send(":x: Color doesn't exist");
  } else if(args.length == 6 || (args.length == 7&&args.startsWith('#'))){
    if(args.startsWith('#')){
      args = args.slice(1);
    }
    return sendColor(message, args);
  } 
  return message.channel.send(":x: Color doesn't exist");
  
  async function sendColor(message, color){
    let hex = "#" + ("000000" + color).slice(-6);
    await gm('./assets/color.png')
    .resize(60, 60)
    .fill(hex)
    .drawRectangle(0, 0, 75, 75)
    .write('./assets/color.png', function(err){
      if (err) return console.log(err); 
    });
    let embed = new Discord.RichEmbed()
    .setDescription(`**Hex**: ${hex} \n **RGB**: ${convert.hex.rgb(hex)} \n **CSS**: ${convert.hex.keyword(hex)}`)
    .setColor(hex)
    .attachFile("./assets/color.png");
    message.channel.send(embed);
  }
}

module.exports.help = {
  name: "color",
  description:`**Color Help** 
    Gets a color

    **Usage**: \${prefix}color <color>
    
    **Option**:
    Hex code: \`#000000\`
    RGB: \`rgb(0, 0, 0)\`
    CSS: \`black\`
  `
}


