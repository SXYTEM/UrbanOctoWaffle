const Discord = require("discord.js");
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });
const { TOKEN } = require("../config.json");
client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on("messageCreate", (msg) => {
    if (msg.author.id === client.user.id) return;
    var reply = [];

    // Replace all newlines in `msg` with a space
    msg.content = msg.content.replaceAll("\n", " ");

    // Replace all longer-than-one spaces in `msg` with a single space
    while (msg.content.includes("  ")) {
        msg.content = msg.content.replaceAll("  ", " ");
    }

    var msg_array = msg.content.split(" "); // Array containing all words in `msg`

    // Go through `msg_array`, and for every word ending in "ing", add the word to `reply`
    // except ending in "ong"
    msg_array.forEach((word) => {
        word_beginning = word.slice(0, -3);
        word_ending = word.slice(-3);

        if (word_ending == "ing") {
            reply.push(word_beginning + "ong");
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
