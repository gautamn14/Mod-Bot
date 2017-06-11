const Discord = require("discord.js")
const config = require("../config.json")
module.exports.run = (bot, message, args) => {
  let perms = bot.elevation(message)
const commandNames = Array.from(bot.commands.keys());
const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);
message.channel.send(`= Command List = ${config.prefix}help [command]\n\n${bot.commands.map(c => `${config.prefix}${c.help.name}${' '.repeat(longest - c.help.name.length)} :: ${c.help.description} - Permission level: ${c.conf.permLevel}`).join('\n')}`, {code:'asciidoc'});
}

module.exports.help = {
  name: "help",
  description: "Shows this help message.",
  more_info: "Shows the commands that are available with the required permission level.",
  usage: config.prefix + "help"
}

module.exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
}
