/*
Declare `TOKEN`, `SPECIAL_CHARS`, `ONGING`, `INGING`, `DEBUG`, `Discord`,
`GatewayIntentBits`, `client`, and `fs` as variables, to make them global. Try/catch
blocks and alike contain constants inside of themselves, so they can't be used outside of
them. This, however, really shouldn't be a problem, since their values won't (or rather
shouldn't) be changed. It is what it is, I guess.
Also, use a try/catch block to log the errors with `log_err()`.
*/

try {
    var { TOKEN, SPECIAL_CHARS, ONGING, INGING, DEBUG } = require("../config.json");
    var Discord = require("discord.js");
    var { GatewayIntentBits } = require("discord.js");
    var client = new Discord.Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
        ],
    });
    var fs = require("fs");
} catch (err) {
    log_err(err);
    fail();
}

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
});
client.on("messageCreate", (msg) => {
    try {
        /*
        If there are no "ing"'s in `msg.content`, or if the message is sent by the bot, do
        nothing. Else, call `on_message()` and var the onging (and potentially inging)
        begin...
        */
        if (validate_msg(msg)) {
            on_message(msg);
        }
    } catch (err) {
        console.log("FATAL ERROR! CONTINUING ANYWAY...");
        log_err(err);
    }
});

try {
    client.login(TOKEN);
} catch (err) {
    log_err(err);
    fail();
}

function create_log_file(log_dir, extension) {
    // The log folder's path
    var script_parent_dir = __filename.substring(0, __filename.lastIndexOf("\\") + 1);
    var log_folder = script_parent_dir + log_dir;

    // Get current time, and convert it to a string formatted like so: "YYYYMMDDhhmm"
    var { YYYY, MM, DD, hh, mm } = get_current_time();
    var time = `${YYYY}${MM}${DD}${hh}${mm}`;

    var log_file = `${log_folder}\\${time}_0.${extension}`;

    // If the log folder doesn't exist, create it
    if (!fs.existsSync(log_folder)) {
        fs.mkdirSync(log_folder, { recursive: true });
    }

    // If a log file with the same name doesn't already exist, create it.
    if (!fs.existsSync(log_file)) {
        fs.open(log_file, "w", (err) => {
            if (err) {
                log_err(err);
                fail();
            }
        });
    } else {
        /*
        If a log file already exists for this exact date and time (to the minute), create
        a new file, except ending in a number. Starting at 1, the number goes up for every
        name duplicate. Formatted like so, where X is `duplicate_number`: "YYYYMMDDhhmm_X"
        */
        var duplicate_number = 1;
        while (true) {
            var path = `${log_folder}\\${time}_${duplicate_number}.${extension}`;
            if (!fs.existsSync(path)) {
                fs.open(path, "w", (err) => {
                    if (err) {
                        log_err(err);
                    }
                });
                log_file = path;
                break;
            }
            duplicate_number += 1;
        }
    }
    return log_file;
}

function log_err(err, overwrite = null) {
    if (DEBUG["LOGGING"]["ERRORS"]["CONSOLE"]) {
        if (overwrite) {
            console.log(overwrite);
        } else if (overwrite != "") {
            console.error(err);
        }
    }
    if (DEBUG["LOGGING"]["ERRORS"]["FILE"]) {
        log_err_file(err);
    }
}

function fail() {
    process.exit(1);
}

function validate_msg(msg) {
    // If the message is sent by the bot, ignore it (don't reply to it)
    if (msg.author.bot) {
        return false;
    }
    /*
    In the configuration, the user can choose if messages should be ingd, ongd, both, or none
    -- the latter making the bot do absolutely nothing. Make `REQUIRED_STRS` contain the
    configured combination. If the message can't be ingd, ongd, or both (according to the
    configuration; `ONGING`, `INGING`), ignore it.
    */
    var REQUIRED_STRS = [];
    if (ONGING) {
        REQUIRED_STRS.push("ing");
    }
    if (INGING) {
        REQUIRED_STRS.push("ong");
    }
    var result = false;
    REQUIRED_STRS.forEach((str) => {
        if (msg.content.toLowerCase().includes(str)) {
            result = true;
        }
    });
    return result;
}

async function on_message(msg) {
    var reply_msg = create_reply(msg);
    if (reply_msg) {
        if (typeof MSG_FILE === "undefined") {
            global.MSG_FILE = create_log_file("msg_logs", "json");
        }
        var reply_sent = await send_reply(msg, reply_msg);
        if (DEBUG["LOGGING"]["MESSAGES"]["CONSOLE"] && reply_sent) {
            log_msg_console(msg, reply_msg);
        }

        if (DEBUG["LOGGING"]["MESSAGES"]["FILE"]) {
            log_msg_file(msg, reply_msg, reply_sent);
        }
    }
}

function log_msg_console(msg, reply_msg) {
    var { YYYY, MM, DD, hh, mm } = get_current_time();
    var time = `${YYYY}-${MM}-${DD} ${hh}:${mm}`;
    var separator = ": ";
    var reply_phrase = `${time}${separator}Replied to `;
    // Longest possible Discord username, plus 5 characters for the "#XXXX" that follows
    var username_max_len = 32 + 5;

    // If the username ends in "#0", remove the "#0" part, since it means the
    // user has no tag.
    var username = msg.author.tag;
    if (username.split("#")[1] == "0") {
        username = username.split("#")[0];
    }
    // The beginning of the console log, that is everything before the message reply
    var beginning = `${username}${separator}`;
    var beginning_max_len = username_max_len + separator.length;
    var console_msg = `${reply_phrase}${beginning.padEnd(
        beginning_max_len,
        " "
    )}"${reply_msg}"`;

    console.log(console_msg);
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

    /*
    Go through `msg_array`, and for every word ending in "ing", add the word to
    `reply_msg` except ending in "ong"
    */
    var reply_msg = [];
    msg_array.forEach((word) => {
        word_beginning = word.slice(0, -3);
        word_ending = word.slice(-3);
        if (ONGING && word_ending === "ing") {
            reply_msg.push(word_beginning + "ong");
        }
        if (INGING && word_ending == "ong") {
            reply_msg.push(word_beginning + "ing");
        }
    });

    /*
    If the reply is empty, it means that the message isn't a valid "ing"-ending message,
    and therefore no reply should be sent
    */
    if (reply_msg.length === 0) {
        return false;
    } else {
        /*
            Make the `reply_msg` array a string, the words separated by ", ". Also make the
            first letter capital, and add a dot at the end.
            */
        reply_msg = reply_msg.join(", ");
        reply_msg = reply_msg[0].toUpperCase() + reply_msg.slice(1) + ".";
        return reply_msg;
    }
}

async function send_reply(msg, reply_msg) {
    var reply_sent = msg
        .reply(reply_msg)
        .then(() => {
            return true; // Return `true` to indicate that the message was sent
        })
        .catch((err) => {
            log_err(err, "");
            /*
            Return `false` to indicate that the message wasn't sent, because an error was
            raised
            */
            return false;
        });

    var get_result = async () => {
        return await reply_sent;
    };

    return await get_result();
}

function log_msg_file(msg, reply_msg, reply_sent) {
    logs = read_json_file(MSG_FILE);
    logs[msg.id] = msg;
    logs[msg.id]["replySent"] = reply_sent;
    logs[msg.id]["replyContent"] = reply_msg;
    logs = JSON.stringify(logs);
    write_json_file(logs, MSG_FILE);
}

function get_current_time() {
    var time = new Date();
    var YYYY = time.getFullYear().toString();
    var MM = (time.getMonth() + 1).toString().padStart(2, "0");
    var DD = time.getDate().toString().padStart(2, "0");
    var hh = time.getHours().toString().padStart(2, "0");
    var mm = time.getMinutes().toString().padStart(2, "0");
    return { YYYY, MM, DD, hh, mm };
}

function read_json_file(file) {
    try {
        var data = require(file);
    } catch (err) {
        // The "SyntaxError: Unexpected end of JSON input" error gets thrown when the
        // file is empty. If it is, add "{}" to it.
        fs.writeFileSync(file, "{}", (err) => {
            if (err) {
                log_err(err);
            }
        });

        var data = require(file);
    }
    return data;
}

function write_json_file(data, file) {
    fs.writeFileSync(file, data.toString(), (err) => {
        if (err) {
            log_err(err);
        }
    });
}

function log_err_file(err) {
    if (typeof ERR_FILE === "undefined") {
        global.ERR_FILE = create_log_file("err_logs", "txt");
    }
    logs = read_json_file(ERR_FILE);
    var newlines_between_errs = 1;
    append_file(err.stack + "\n".repeat(newlines_between_errs + 1), ERR_FILE);
}

function append_file(data, file) {
    fs.appendFileSync(file, data.toString(), (err) => {
        if (err) {
            console.error(err);
        }
    });
}
