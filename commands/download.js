const fs = require('fs');
const ytdl = require('ytdl-core');
const ytSearch = require('youtube-search');

module.exports.run = async(bot, message, args, prefix)=>{     
  let musicUrl = '';
  let time = false;
  let isVideo = false;
  if(args.split(' ')[0] === "video"){
    args = args.slice(6);
    isVideo = true;
  }

  if(ytdl.validateURL(args)){
    musicUrl = args;
  } else {
    await searchVideo(args)
    .then(link => {musicUrl = link})
    .catch(error=>{message.channel.send(':x: ' + error.name)});
  }

  if(isVideo){
    await ytdl.getBasicInfo(musicUrl).then(i=>{time = i['length_seconds']>250});
  } else {
    await ytdl.getBasicInfo(musicUrl).then(i=>{time = i['length_seconds']>550});
  }
  if(time){
    return message.channel.send(":x:Error: video too long");
  } 

  const youtubedl = require('youtube-dl');

  let name = ''
  await ytdl.getBasicInfo(musicUrl).then(i=>{name = i['title']})
  if(name.includes(' ')){
    name = name.split(' ').join("_")
  }
  if(name.includes('/')){
    name = name.split('/').join("_")
  }

  try{
    if(isVideo){
      const video = youtubedl(musicUrl,
        ['--format=18'],
        { cwd: __dirname });
      video.pipe(fs.createWriteStream(`./assets/${name}.mp4`).on('finish', () => {
        message.channel.send({file:`./assets/${name}.mp4`})
        .catch(e => message.channel.send(`:x: Error:${e}`).then(m=> {m.delete(5000)}))
        .then(m => {fs.unlink(`./assets/${name}.mp4`, (err) => {
            if (err) message.channel.send(`:x:Error: ${err}`).then(m=> {m.delete(5000)});
          });
        });
      }));
    } else {
      const ffmpeg = require('fluent-ffmpeg');
      const audio = youtubedl(musicUrl,
        [],
        { cwd: __dirname });
      const outStream = fs.createWriteStream(`./assets/${name}.mp3`);        
      audio.pipe(fs.createWriteStream('./assets/video.mp4').on('finish', () => {
        ffmpeg({ source: './assets/video.mp4' })
        .withNoVideo()
        .format('mp3')
        .on('error', function(err) {
          console.log('An error occurred: ' + err.message);
        })
        .writeToStream(outStream, { end: true });

        outStream.on('finish', () => {
          message.channel.send({file:`./assets/${name}.mp3`})
          .catch(e => message.channel.send(`:x: Error:${e}`).then(m=> {m.delete(5000)}))
          .then(m => {fs.unlink(`./assets/${name}.mp3`, (err) => {
              if (err) message.channel.send(`:x:Error: ${err}`).then(m=> {m.delete(5000)});
            });
          });
        });

      }));
    }
  } catch(e) {
    message.channel.send(`:x:Error: ${e}`).then(m=> {m.delete(5000)})
  }

return

  function searchVideo(keyword){
    return new Promise((resolve) => {
      let opts = {
        maxResults: 1,
        key: process.env.YTAPIKEY,
        type: "video"
      };
      ytSearch(keyword, opts, function(err, results) {
        if(err) return console.log(err);
        if(results[0]){
          resolve(results[0].link);
        } else {
          throw new Error("No results");
        }
      });
    });
  }
}
  
module.exports.help = {
    name: "download",
    description: `:arrow_down: | **Download Help** 
    Download is a command to download audios/videos from youtube

    **Usage**: \${prefix}purge [option] <name/URL>
    
    **Options**:
    \`video\` - Downloads the entire video
    Default - Downloads the audio of the video
    
    
    **Limitations**:
    Video - 4 minutes
    Audio - 8 minutes
    
    **Examples**:
    \`\${prefix}download Africa\` - Downloads Africa
    \`\${prefix}download https://www.youtube.com/watch?v=kJQP7kiw5Fk\` - Downloads Despacito
    \`\${prefix}download video Never gonna give you up\` - Downloads the video
    `
}
