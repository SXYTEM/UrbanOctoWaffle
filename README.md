<div align="center">
    <img src="./src/media/logo.png" width="250"/>
    <h1><b>UrbanOctoWaffle</b></h1>
    <p><b>This is a Discord bot. It replies to messages containg words ending in "ing", with the same word, excpet ending in "ong".</b></p>
</div>

<div align="center">

![Commit Activity](https://img.shields.io/github/commit-activity/m/SXYTEM/UrbanOctoWaffle?style=for-the-badge)
![Bugs](https://img.shields.io/github/issues/SXYTEM/UrbanOctoWaffle/bug.svg?style=for-the-badge)

</div>

## How to get started
1. If you don't already have a [Discord](https://discord.com/) account, create one at https://discord.com/. If (or when) you have an account, go to https://discord.com/developers/applications and create a new application. Go to the application's "Bot" tab and click the "Add Bot" button. Below, in the "Privileged Gateway Intents" section, turn on "Message Content Intent".
2. Go to the "OAuth2" section of the application, and go to the "URL Generator" subsection. In "Scopes", select "bot". Then, in the "Bot Permissions" section, select the "Send Messages" permission.
3. Down in the "Generated URL" section, copy the URL. Open the URL, and you'll be prompted to log into Discord. Then, you'll be prompted to invite the bot. Select the server, and click "Authorise".
4. Go to [UrbanOctoWaffle's GitHub page](https://github.com/SXYTEM/UrbanOctoWaffle), and download the repository. Alternatively, you can clone the repository using [Git](https://git-scm.com/) (download at https://git-scm.com/) like so:
   ```shell
   git clone https://github.com/SXYTEM/UrbanOctoWaffle
   ```
5. Go to your bot's application page, then to the "Bot" tab. Then, generate and copy the token under the "Token" section.
6. Paste the bot token in the [config.json](config.json) file under the "TOKEN" variable.
7. Download and install [Node](https://nodejs.org/) if you don't already have it, at https://nodejs.org/.
8. Then, to install the [dependencies](#dependencies), run the following commands in your project directory:
   ```shell
   npm install
   ```
   Alternatively, you can run [install_packages.bat](install_packages.bat).
9. Then, run the following command to start the bot:
   ```shell
   node ./src
   ```
10. Go to the server to which you invited the bot, and send a message containing a word ending in "ing". The bot will reply with the same word, except ending in "ong". Voilá!

## Dependencies
This project uses [Discord.js](https://discord.js.org/#/) and [Node](https://nodejs.org/).

| Package    | Version |
|------------|---------|
| Discord.js | 13.8.1  |