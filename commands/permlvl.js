const config = require("../config.json")
module.exports.run = (bot, message) => {
  let permlvl = bot.elevation(message)
  message.reply("Your permission level is: " + permlvl)
}

module.exports.help = {
  name: "permlvl",
  description: "Shows your permission level.",
  more_info: "Shows your permission level for the commands.",
  usage: config.prefix + "permlvl"
}

module.exports.conf = {
  enabled: true,
  guildOnly: false,
  permLevel: 0,
  aliases: []
}
