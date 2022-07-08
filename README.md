<div align="center">
    <img src="./src/media/logo.png" width="250"/>
    <h1><b>UrbanOctoWaffle</b></h1>
    <p><b>This is a Discord bot. It replies to messages containing words ending in "ing", with the same words, except ending in "ong".</b></p>
</div>

<div align="center">

![Commit Activity](https://img.shields.io/github/commit-activity/m/SXYTEM/UrbanOctoWaffle?style=for-the-badge)
![Bugs](https://img.shields.io/github/issues/SXYTEM/UrbanOctoWaffle/bug.svg?style=for-the-badge)

</div>

## How to get started
1. If you don't already have a [Discord](https://discord.com/) account, create one at https://discord.com/.
2. If (or when) you have an account, go to https://discord.com/developers/applications, create and name a new application by clicking on the "New Application" button.
3. Go to the application's "Bot" tab, click the "Add Bot" button and then the "Yes, do it!" button. Below, in the "Privileged Gateway Intents" section, turn on "Message Content Intent" and save you changes bu clicking "Save Changes".
4. Go to the "OAuth2" section of the application, and then to the "URL Generator" subsection. In the "Scopes" section, select "bot". Then, in the "Bot Permissions" section, select the "Read Messages/View Channels" and "Send Messages" permissions.
5. Down in the "Generated URL" section, copy the URL. Open the URL, and you'll be prompted to log into Discord. Then, you'll be prompted to invite the bot. Select the server, and click "Authorise".
6. Go to [UrbanOctoWaffle's GitHub page](https://github.com/SXYTEM/UrbanOctoWaffle), and download the repository. Alternatively, you can clone the repository using [Git](https://git-scm.com/) (download at https://git-scm.com/) like so:
   ```shell
   $ git clone https://github.com/SXYTEM/UrbanOctoWaffle
   ```
7. Go to your bot's application page, then to the "Bot" tab. Then, regenerate the token by glicking the "Reset Token" button under the "Token" section, and then the "Yes, do it!" button. Copy the token.
8. Paste the bot token in the [config.json](config.json) file under the "TOKEN" variable.
9. Download and install [Node](https://nodejs.org/) if you don't already have it, at https://nodejs.org/.
10. Then, to install the [dependencies](#dependencies), run [install_packages.bat](install_packages.bat). Alternatively, run the following command:
   ```shell
   $ npm install
   ```
11. Then, to start the bot, run [start_bot.bat](start_bot.bat). Alternatively, run the following command:
   ```shell
   $ node ./src
   ```
12. Go to the server to which you invited the bot, and send a message containing (a) word(s) ending in "ing". The bot will reply with the same word(s), except ending in "ong". Voilá!

## Dependencies
This project uses [Discord.js](https://discord.js.org/#/) and [Node](https://nodejs.org/).

| Package    | Version |
|------------|---------|
| Discord.js | 13.8.1  |
