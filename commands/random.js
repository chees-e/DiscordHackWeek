const sentencer = require("sentencer");

module.exports.run = async(bot, message, args, prefix)=>{
  switch(args){
    case("card"):
      let suit = ['Spades', 'Hearts', 'Clubs', 'Diamonds'];
      let card = ['Ace', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Jack', 'Queen', 'King'];
      let a = Math.floor( Math.random() * 4);
      let b = Math.floor( Math.random() * 13);
      message.channel.send( card[b] + ' of ' + suit[a]);
      break;
    case("dice"):
      message.channel.send(Math.ceil(Math.random()*6));
      break;
    case("coin"):
      if(Math.ceil(Math.random()*2) == 1){
        message.channel.send("T")
      } else {
        message.channel.send("H")
      }
      break;
    case("word"):
      message.channel.send(sentencer.make("{{ noun }}"));
      break;
    default:
      message.channel.send(Math.random());
  }
}

module.exports.help = {
  name: "random",
  description: `:crystal_ball: | random help
    random is a command for random things

    Usage: \${prefix}random [option]
    Options: card, coin, dice, word
    Default is a random number between 0 and 1
`
}
