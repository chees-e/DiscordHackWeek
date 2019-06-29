# DiscordHackWeek

This is a productivity/fun Discord bot made for Discord hack week. By Pineappl#5374.
Written in JS, supported by Discord.js.

## Initialization:

1. Install the packages:

...Use `npm install`

2. Create a discord client

...follow this [link](https://discordapp.com/developers/applications/)

3. Get the tokens for

* Discord client: See Application => Bot => Token
* YTapi token: [link](https://console.developers.google.com/apis/credentials)
* World Trading Data token: [link](https://www.worldtradingdata.com/)
* Custom search engine id: [link](https://developers.google.com/custom-search/)
* Yandex translate token: [link](https://tech.yandex.com/translate/)

4. Create `.env` file and plug those tokens in like the `.env.example`

5. Add the bot to your server:

`https://discordapp.com/api/oauth2/authorize?client_id=YOURCLIENTID&scope=bot`

With YOURCLENTID replaced by your bot's id

## Functions/Commands:

* `=`: Evaluates an expression
* `color`: Gets a color
* `download`: Downloads a song/video from youtube
* `encode`: Encode a message to morse
* `help`: The help command
* `id`: Gets your/someone's id
* `latex`: Prints an expression in latex (returns an image)
* `link`: Get the invitation link
* `market`: Checks status for stocks/indices/foreign exhanges via WorldTradingData
* `random`: Random simulations like dice/cards...
* `search`: Search for images/videos/others via DuckDuckGo API/Google Custom Search Engine/Youtube Search
* `setprefix`: Change the prefix for this bot
* `translate`: Translate a message
* `userinfo`: Get a user's information

## Things to know:

* The default prefix is `p=`, you can use `p=setprefix [new prefix]` to change it
* To get help for each command use `p=help [command]`
* I still have a lot of things I want to add but a week is not a lot of time

## I hope you all enjoy this bot

