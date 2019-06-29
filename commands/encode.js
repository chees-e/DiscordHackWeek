let morse = {"A":".-", "B":"-...", "C":"-.-.", "D":"-..", "E":".", "F":"..-.", "G":"--.", "H":"....", "I":"..", "J":".---", "K":"-.-", "L":".-..", "M":"--", "N":"-.", "O":"---", "P":".--.", "Q":"--.-", "R":".-.", "S":"...", "T":"-", "U":"..-", "V":"...-", "W":".--", "X":"-..-", "Y":"-.--", "Z":"--..", "1":".----", "2":"..---", "3":"...--", "4":"....-", "5":".....", "6":"-....", "7":"--...", "8":"---..", "9":"----.", "0":"-----", ".":".-.-.-", ",":"--..--", "?":"..--..", '"':".-..-.", ":":"---...", "'":".----.", "-":"-....-", "/":"-..-.", "(":"-.--.", ")":"-.--.-"}

module.exports.run = async(bot, message, args, prefix)=>{
  if(!args) return message.channel.send(':x:Please include an argument');
  args = args.toUpperCase();
  let encoded = []
  for(let i = 0; i<args.length; i++){
    if(morse[args[i]]){
      encoded.push(morse[args[i]]);
    } else {
      encoded.push(' ');
    }
  }
  return message.channel.send(`encoded: ${encoded.join(' ')}`);
}

module.exports.help = {
  name: "encode",
  description: `:ballot_box: | encode help
    encode is a command to help you encode a message to morse

    Usage: \${prefix}encode <message>

    Example: \`\${prefix}encode This is a morse code\`
`
}
