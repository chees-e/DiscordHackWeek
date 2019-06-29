const Discord = require("discord.js");
const latex = require("mathmode");
const latexnew = require("latex");
const fs = require("fs")
const gm = require('gm').subClass({imageMagick: true});
const sizeOf = require('image-size');
let options = {
  format: 'png',
  dpi: 300,
  packages: ["amsmath"],
  macros: "",
  pdflatex_path: "pdflatex",
  imagemagick_path: "convert"
}
function delay(sec) {
  return new Promise(resolve => setTimeout(resolve, sec))
}

module.exports.run = async(bot, message, args, prefix)=>{
  while(args.includes('\\newline')||args.includes('\\\\*')||args.includes('\\linebreak')){
    args = args.replace('\\newline', '\\\\');
    args = args.replace('\\\\*', '\\\\');
    args = args.replace('\\linebreak', '\\\\');
  }
  
  let longestWidth = 0;
  try{
    if(args.includes('\\\\')){
      let arglist = args.split('\\\\');
      for(let i = 0; i< arglist.length; i++){
        const writableTest = fs.createWriteStream('./assets/latexTest.png');
        const streamTest = latex(arglist[i], options);
        await streamTest.pipe(writableTest);
        writableTest.on('finish', async (end, err)=>{
          if(sizeOf('./assets/latexTest.png').width>longestWidth){
            longestWidth = sizeOf('./assets/latexTest.png').width;
          }
        })
        streamTest.on("error", function(e) {
          return message.channel.send(e);
        });
        await delay(500)
      }
      await WriteStream()
    } else {
      await WriteStream()
    }
  } catch(e) {
    return message.channel.send(e)
  }
    
  async function WriteStream(){
    const stream = latex(args, options);
    const writable = fs.createWriteStream('./assets/latex.png');
    await stream.pipe(writable);
    writable.on('finish', async (end, err)=>{
      if(err) return message.channel.send(`:x:Error: ${err}`);
      try{
        let dimensions = sizeOf('./assets/latex.png');
        if(!longestWidth) longestWidth = dimensions.width;
        if(longestWidth>1979||dimensions.height>1979) return message.channel.send(":x: Sorry, your expression is too big to process");
        await gm('./assets/white.png')
        .crop(longestWidth + 20, dimensions.height + 20)
        .write('./assets/math.png', function(err){
          if (err) return console.log(err);  
        })

        await gm('./assets/latex.png')
        .crop(longestWidth, dimensions.height)
        .write('./assets/latex.png', function(err){
          if (err) return console.log(err);    
        })

        await delay(500)

        await gm()
        .command("composite") 
        .in("-gravity", "center")
        .in('./assets/latex.png')
        .in('./assets/math.png')
        .write( './assets/math.png', function (err) {
          if (err) console.log(err);
        }); 
        await delay(500)
        return message.channel.send({file:"./assets/math.png"})
      } catch(e) {
        return message.channel.send(`:x:Error: ${e}`)
      }
    })
    stream.on("error", function(e) {
      return message.channel.send(e)
    });
  }
}

module.exports.help = {
  name: "latex",
  description: `:symbols: | latex help
    latex is a command to generate an image based on an expression

    Usage: \${prefix}latex <expression>

    Example: \`\${prefix}latex \frac{1}{2}\`
`   
}
