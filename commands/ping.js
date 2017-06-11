const config = require("../config.json");
module.exports.run = (bot, message) => {
  message.channel.send("Pong!")
}

module.exports.conf = {
  enabled: true,
  guildOnly: false,
  permLevel: 0,
  aliases: []
}

module.exports.help = {
  name: "ping",
  description: "Ping/Pong.",
  usage: config.prefix + "ping"
}
