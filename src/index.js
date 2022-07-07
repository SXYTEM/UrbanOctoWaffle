const Discord = require("discord.js");
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });
const { TOKEN } = require("../config.json");
client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on("messageCreate", (msg) => {
    if (msg.author.id === client.user.id) return;

    // Create dictionary, `msgs` of all messages and their correspondent replies
    let alphabet = "abcdefghijklmnopqrstuvwxyzåäö".split("");
    let msgs = {};
    alphabet.forEach((word) => {
        msgs[word + "ing"] = word + "ong";
    });

    var reply = [];

    // Replace all newlines with a space
    msg.content = msg.content.replaceAll("\n", " ");

    // Replace all longer-than-one spaces with a single space
    while (msg.content.includes("  ")) {
        msg.content = msg.content.replace("  ", " ");
    }

    var msg_array = msg.content.split(" "); // Array containing all words in the message

    // Go through `msg_array`, and for every word, check if it's a key in `msgs`. If it
    // is, add its correspondent, item, to `reply`.
    msg_array.forEach((word) => {
        if (word in msgs) {
            var corr = msgs[word];
            reply.push(corr);
        }
    });

    // If `reply` is empty, return
    if (JSON.stringify(reply) === JSON.stringify([])) return;

    // Make the `reply` array a string, the words seperated by ", ". Also make the first
    // letter capital, and add a dot at the end.
    var reply = reply.join(", ");
    var reply = reply[0].toUpperCase() + reply.slice(1) + ".";

    msg.reply(reply);
});

client.login(TOKEN);
