const fs = require("fs");
const MSG_FILE = create_log_file("msg_logs", "json");
const ERR_FILE = create_log_file("err_logs", "txt");

try {
    var { TOKEN, SPECIAL_CHARS, DEBUG } = require("../config.json");
} catch (err) {
    log_err(err);
    fail();
}

try {
    var Discord = require("discord.js");
} catch (err) {
    log_err(err);
    fail();
}
const client = new Discord.Client({
    intents: ["GUILDS", "GUILD_MESSAGES"],
});
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
    var reply_msg = create_reply(msg);
    if (reply_msg) {
        msg.reply(reply_msg, (err) => {
            if (err) {
                console.error(err);
                sent = false;
            }
        });

        if (DEBUG["LOGGING"]["CONSOLE"]) {
            var reply_phrase = "Replied to ";
            var seperator = "; ";
            // Longest possible Discord username, plus 5 characters for the "#XXXX"
            var username_max_len = 32 + 5;
            // The beggining of the console log, i. e. everything before the message
            //replied to
            var beginning = `${reply_phrase}${msg.author.tag}${seperator}`;
            var beginning_max_len =
                reply_phrase.length + username_max_len + seperator.length;
            var console_msg =
                beginning.padEnd(beginning_max_len, " ") + `"${reply_msg}"`;
            console.log(console_msg);
        }
        if (DEBUG["LOGGING"]["FILE"]) log_msg_file(msg, reply_msg, sent);
    }
});

try {
    client.login(TOKEN);
} catch (err) {
    log_err(err);
    fail();
}

function fail() {
    process.exit(1);
}

function create_log_file(log_dir, extension) {
    // The log folder's path
    var script_parent_dir = __filename.substring(
        0,
        __filename.lastIndexOf("\\") + 1
    );
    var log_folder = script_parent_dir + log_dir;

    const TIME = get_current_time();
    var log_file = `${log_folder}\\${TIME}_0.${extension}`;

    // If the log folder doesn't exist, create it
    if (!fs.existsSync(log_folder)) {
        fs.mkdirSync(log_folder, { recursive: true });
    }

    // If a log file with the same name doesn't already exist, create it.
    if (!fs.existsSync(log_file)) {
        fs.open(log_file, "w", (err) => {
            if (err) {
                console.error(err);
                fail();
            }
        });
    } else {
        // If a log file already exists for this exact date and time (to the minute),
        // create a new file, except ending in a number. Starting at 1, the number goes up
        // for every name duplicate. Formatted like so, where X is `duplicate_number`:
        // "YYYYMMDDhhmm_X"
        var duplicate_number = 1;
        while (true) {
            var path = `${log_folder}\\${TIME}_${duplicate_number}.${extension}`;
            if (!fs.existsSync(path)) {
                fs.open(path, "w", (err) => {
                    if (err) console.error(err);
                });
                log_file = path;
                break;
            }
            duplicate_number += 1;
        }
    }

    return log_file;
}

function create_reply(msg) {
    // Make all capital letters in `msg.content` lower case
    msg.content = msg.content.toLowerCase();

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
    if (reply_msg.length === 0) return false;
    else {
        // Make the `reply_msg` array a string, the words seperated by ", ". Also make the
        // first letter capital, and add a dot at the end.
        reply_msg = reply_msg.join(", ");
        reply_msg = reply_msg[0].toUpperCase() + reply_msg.slice(1) + ".";

        return reply_msg;
    }
}

function log_msg_file(msg, reply_msg, sent) {
    logs = read_json_file(MSG_FILE);
    if (!sent) logs["sent"] = false;
    logs[msg.id] = msg;
    logs[msg.id]["replyContent"] = reply_msg;
    write_json_file(logs, MSG_FILE);
}
function log_err(err) {
    // If `DEBUG` doesn't exist (which it always should -- because it's very fundemental),
    // create it with all debugging options enabled
    if (typeof DEBUG == "undefined") {
        fs.copyFileSync("default_config.json", "../config.json");
        var { DEBUG } = require("../config.json");
    }

    if (DEBUG["LOGGING"]["CONSOLE"]) console.error(err);
    if (DEBUG["LOGGING"]["FILE"]) log_err_file(err);
}
function log_err_file(err) {
    logs = read_json_file(ERR_FILE);
    var newlines_between_errs = 1;
    append_file(err.stack + "\n".repeat(newlines_between_errs + 1), ERR_FILE);
}

function append_file(data, file) {
    fs.appendFileSync(file, data.toString(), (err) => {
        if (err) console.error(err);
    });
}

function write_json_file(data, file) {
    fs.writeFileSync(file, JSON.stringify(data), (err) => {
        if (err) console.error(err);
    });
}

function read_json_file(file) {
    try {
        var data = require(file);
    } catch (err) {
        // The "SyntaxError: Unexpected end of JSON input" error gets thrown when the
        // file is empty. If it is, add "{}" to it.
        fs.writeFileSync(file, "{}", (err) => {
            if (err) console.error(err);
        });

        var data = require(file);
    }

    return data;
}

function get_current_time() {
    // Get current time, and convert it to a string formatted like so: "YYYYMMDDhhmm"
    var time = new Date();
    var YYYY = time.getFullYear();
    var MM = (time.getMonth() + 1).toString().padStart(2, "0");
    var DD = time.getDate().toString().padStart(2, "0");
    var hh = time.getHours().toString().padStart(2, "0");
    var mm = time.getMinutes().toString().padStart(2, "0");
    var TIME = `${YYYY}${MM}${DD}${hh}${mm}`;

    return TIME;
}
