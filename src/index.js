const Discord = require("discord.js");
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });
const { TOKEN, SPECIAL_CHARS, DEBUG } = require("../config.json");
client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on("messageCreate", (msg) => {
    // If there are no "ing"'s in `msg.content`, or if the message is sent by the bot,
    // return
    if (
        !msg.content.toLowerCase().includes("ing") ||
        msg.author.id == client.user.id
    ) {
        return;
    }
    var sent = true;
    var reply_msg = createReply(msg);
    if (reply_msg != false) {
        msg.reply(reply_msg, (err) => {
            if (err) {
                console.error(err);
                sent = false;
            }
        });

        if (DEBUG["CONSOLE"] || DEBUG["FILE"]) {
            if (DEBUG["CONSOLE"])
                console.log(`Replied to ${msg.author.tag}; "${reply_msg}"`);
            if (DEBUG["FILE"]) log_file(msg, reply_msg, sent);
        }
    }
});

function createReply(msg) {
    // Replace all newlines in `msg.content` with a space
    msg.content = msg.content.replaceAll("\n", " ");

    // Replace all longer-than-one spaces in `msg.content` with a single space
    while (msg.content.includes("  ")) {
        msg.content = msg.content.replaceAll("  ", " ");
    }

    // Remove all special characters in `msg.content`
    var char_array = msg.content.split("");
    char_array = char_array.filter((char) => !SPECIAL_CHARS.includes(char));
    msg.content = char_array.join("");
    var msg_array = msg.content.split(" "); // Array containing all words in the message

    // Go through `msg_array`, and for every word ending in "ing", add the word to
    // `reply_msg` except ending in "ong"
    var reply_msg = [];
    msg_array.forEach((word) => {
        word_beginning = word.slice(0, -3);
        word_ending = word.slice(-3);

        if (word_ending == "ing") reply_msg.push(word_beginning + "ong");
    });

    // If the reply is empty, it means that the message isn't a valid "ing"-ending
    // message, and therefore no reply should be sent
    if (reply_msg == []) return false;

    // Make the `reply_msg` array a string, the words seperated by ", ". Also make the
    // first letter capital, and add a dot at the end.
    reply_msg = reply_msg.join(", ");
    reply_msg = reply_msg[0].toUpperCase() + reply_msg.slice(1) + ".";

    return reply_msg;
}

function log_file(msg, reply_msg, sent) {
    // This script's and the `logs` folder's paths
    var script_path = __filename.substring(0, __filename.lastIndexOf("\\") + 1);
    var logs_path = script_path + "logs\\log.json";

    const fs = require("fs");
    try {
        var logs = require(logs_path);
    } catch (err) {
        // The "SyntaxError: Unexpected end of JSON input" error gets thrown when the log
        // file is empty. If it is, add "{}" to it.
        if (err instanceof SyntaxError) {
            fs.writeFileSync(logs_path, "{}", (err) => {
                if (err) {
                    console.error(err);
                    return;
                }
            });

            var logs = require(logs_path);
        }
    }
    if (!sent) logs["sent"] = false;
    logs[msg.id] = msg;
    logs[msg.id]["replyContent"] = reply_msg;
    fs.writeFile(logs_path, JSON.stringify(logs), (err) => {
        if (err) console.error(err);
    });
}

client.login(TOKEN);
