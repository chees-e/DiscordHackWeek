const mathjs = require('mathjs');
const Discord = require("discord.js");
let lastAnswer = {};

module.exports.run = async(bot, message, args, prefix)=>{
  while(args.includes('ln(')){
     args = args.replace('ln(', 'log(');
  }
  while(args.includes('**')){
    args = args.replace('**', '^');
  }
  while(args.includes('ans')){
    if(lastAnswer[message.channel.id]){
      args = args.replace('ans', lastAnswer[message.channel.id]);
    } else {
      args = args.replace('ans', '0');
    }
  } 
  
  //prime checker
  if(args.toLowerCase().includes("isprime")||args.toLowerCase().includes("is prime")||args.toLowerCase().includes("ip")){
    args = args.slice(0, args.toLowerCase().indexOf('is'));
    if(args > 10000000000) return message.channel.send("Don't try to break the bot");
    try{
      message.channel.send(Breakdown(args))
    } catch(e) {
      message.channel.send(`Error: ${e}`);
    }
    return;
  }
  
  //LCD
  if(args.toLowerCase().includes("lcd")){
    try{
      if(args.length > 40) return message.channel.send("Don't try to break the bot");
      args = args.slice(0, args.toLowerCase().indexOf('lcd')).trim();
      let list = [];
      let largest = 1;
      if(args.includes(",")){
        list = args.split(",");
      } else {
        list = args.split(" ");
      }
      if(list.some(v=>{return v>10000})) return message.channel.send("Don't try to break the bot");
      while(list.some(v=>{return v===""})){
        list.splice(list.indexOf(""),1);
      }
      for(v in list){list[v] = parseInt(list[v], 10); largest = largest * list[v]};
      for(let i = 1; i<= largest; i++){
        if(list.every(v=>{return i%v === 0})){
          lastAnswer[message.channel.id] = i;
          return message.channel.send("= " + i);
        }
      }
      return message.channel.send(`Error`);
    } catch(e) {
      return message.channel.send(`Error: ${e}`);
    }
  }
  
  //regular
    try{
      if(!args.includes(',')){
        if(mathjs.eval(args)){
          lastAnswer[message.channel.id] = mathjs.eval(args)
        }
      } else {
        args = args.split(',')
        return  message.channel.send(`= ${mathjs.eval(args)}`)
      }
    } catch(e) {
      return message.channel.send(`Error: ${e}`)
    }
  }
  
  function nextPrime(number){
    number = parseInt(number,10);
    let nextPrime = 0;
    if(isPrime(number + 1)) return number + 1;
    for(let i = number + 1; !isPrime(i); i++){
      nextPrime = i;
    }
    return nextPrime + 1;
  }

  function isPrime(number){
    number = parseInt(number,10);
    if(number == 2) return true;
    if(number < 2) throw "Not a valid number";
    for(let i = 2; i <= Math.ceil(Math.sqrt(number)); i++){
      if(number%i==0){
        return false;
      }
    }
    return true;
  }

  function Breakdown(number, noembed){
    number = parseInt(number,10);
    if(number < 2) throw "Not a valid number";
    let num = number;
    let embed = new Discord.RichEmbed().setColor('#36393F');
    if(isPrime(num)){
      embed.setTitle(`${num} is prime`);
      embed.setDescription(`${num} = ${num} \nNext prime: ${nextPrime(num)} `);
      return embed;
    } else {
      let breakdown = [];
      while(num>1){
        for(let i = 2; i<=number/2; i++){
          if(num%i == 0){
            breakdown.push(i);
            num = num/i;
            break;
          }
        }
      }
      if(noembed){
        return breakdown;
      }
      embed.setTitle(`${number} is composite`);
      embed.setDescription(`${number} = ${breakdown.join(' x ')} \nNext prime: ${nextPrime(number)} `);
      return embed;
    }
  }

module.exports.help {
  name: "=",
  description: `:1234: | **= Help** 
    = is a command that evalutes an expression using mathjs.
    **Usage**: \${prefix}= <expression> [ options ]
    
    **Options**:
    \`lcd\` - Finds the lowest common denominator of the numbers given (seperated by space)
    \`"is prime"\` - Checks whether a number is prime, list its prime factors if its composite and the next prime.

    **Examples**:
    \`\${prefix}= 2+6\` - Reply: \`8\`
    \`\${prefix}= 23 is prime\` - Reply: \`23 is prime\` 
    \`\${prefix}= 22 33 44 55 lcd\` - Reply: \`660\` 
  `
}
