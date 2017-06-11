const Discord = require("discord.js");
const bot = new Discord.Client();
const config = require("./config.json")
const fs = require("fs")

var no_perms = "```Sorry, but you do not have the right permissions to run this command.```";

bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();


bot.on("ready", () => {
    console.log(`ModBot is now online and ready! Here is some information:`);
    console.log(`Owner: ${bot.users.get(config.ownerID).username}#${bot.users.get(config.ownerID).discriminator}`);
    console.log(`Logged in as: ${bot.user.username}#${bot.user.discriminator}`);
    console.log(`Prefix: ${config.prefix}`);
    console.log(`In ${bot.guilds.size} servers | Serving ${bot.users.size} users | A total of ${bot.channels.size} channels.`);
    console.log("|--------------------(Loading commands)------------------------|");
    fs.readdir("./commands/", (err, files) => {
        if(err) console.error(err);

        let jsfiles = files.filter(f => f.split(".").pop() === "js");
        if(jsfiles.length <= 0) {
            console.log("No commands to load!");
            return;
        }

        console.log(`Loading a total of ${jsfiles.length} commands!`);

        jsfiles.forEach((f, i) => {
            let props = require(`./commands/${f}`);
            console.log(`${i + 1}: ${f} loaded!`);
            bot.commands.set(props.help.name, props);
        });
    });
})

bot.elevation = message => {
  let permlvl = 0;
  if(!message.guild) return;
  if(message.member.roles.has(config.modrole_name.id)) permlvl = 2;
  if(message.member.roles.has(config.adminrole_name.id)) permlvl = 4;
  if(message.member.hasPermission("ADMINISTRATOR")) permlvl = 6;
  if(message.author.id === message.guild.owner.id) permlvl = 8;
  if(config.maintainers.includes(message.author.id)) permlvl = 10;
  if(config.owners.includes(message.author.id)) permlvl = 20;
  if(message.author.id === config.ownerID) permlvl = 50;
  return permlvl;
}


bot.on("message", message => {
    if (message.author.bot) return;
    var args = message.content.split(' ');
    let command = args.slice(0).join(" ");
    if (!command.startsWith(config.prefix)) return;

    let perms = bot.elevation(message);
    let cmd = bot.commands.get(command.slice(config.prefix.length));

    if (bot.commands.has(command)) {
        cmd = bot.commands.get(command);
    }

    if (cmd) {
        if (perms < cmd.conf.permLevel) {
            message.author.send(no_perms)
        } else {
          if(cmd.conf.enabled === false) return message.channel.send("This command is disabled.")
          if(cmd.conf.guildOnly === true && !message.guild) return message.reply("This command is only available in a server.")
            cmd.run(bot, message)
        }
    }

    if(message.content.startsWith(config.prefix + "help")) {
      var can_i;
      let command = args.slice(1).join(" ")
      if(command.length < 1) return;
      if (bot.commands.has(command)) {
        command = bot.commands.get(command);
        if(perms < command.conf.permLevel) {
          can_i = "No"
        } else {
          can_i = "Yes"
        }
        message.channel.send(`= Detailed help for :: ${command.help.name} = \n\nDetailed description :: ${command.help.more_info}\n\nGuild only :: ${command.conf.guildOnly}\n\nEnabled :: ${command.conf.enabled}\n\nRequired permission level :: ${command.conf.permLevel}\n\nCan I run the command :: ${can_i} (Your permission level is : ${perms})\n\nusage :: ${command.help.usage}`, {code:'asciidoc'});
} else {
  message.channel.send(`Error :: The provided command does not exist. `, {code:'asciidoc'});
}
    }

    if (message.content.startsWith(config.prefix + "eval")) {
        if (perms < 10) return;
        try {
            let com = eval(message.content.split(" ").slice(1).join(" "));
            var com2 = message.content.split(" ").slice(1).join(" ");
            if (com2.includes("config.token")) {
                const embed = new Discord.RichEmbed()
                .setAuthor('NajibBot', 'https://cdn.discordapp.com/avatars/321909965201604611/073a53856bee78f8931366a872718aa5.png?size=2048')
                .setColor(utils.getColour('red'))
                .setTitle("Security Alert!")
                .setDescription("You are not able to do this for security reasons!")
                .setThumbnail("http://www.shaunoneill.com/assets/genericError.png");
                message.channel.send({embed: embed});
                return;
            } else {
                const embed = new Discord.RichEmbed()
                .setAuthor('NajibBot', 'https://cdn.discordapp.com/avatars/321909965201604611/073a53856bee78f8931366a872718aa5.png?size=2048')
                .setColor(utils.getColour('blue'))
                .setTitle("Evaluation")
                .setDescription("\n```md\n# INPUT\n" + com2 + "```\n```md\n# OUTPUT\n" + com + "```")
                message.channel.send({embed: embed});
                return;
            }
        } catch(e) {
            const embed = new Discord.RichEmbed()
            .setAuthor('NajibBot', 'https://cdn.discordapp.com/avatars/321909965201604611/073a53856bee78f8931366a872718aa5.png?size=2048')
            .setColor(utils.getColour('red'))
            .setTitle("Evaluation")
            .setDescription("```md\n# INPUT\n" + com2 + "```\n```md\n# OUTPUT\n" + e + "```")
            .setThumbnail("http://www.shaunoneill.com/assets/genericError.png");
            message.channel.send({embed: embed});
            return;
        }
    }

});

bot.login(config.token)
