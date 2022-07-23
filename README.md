<div align="center">
    <img src="./src/media/logo.png" width="250"/>
    <h1><b>UrbanOctoWaffle</b></h1>
    <p><b>This is a Discord bot. It replies to messages containg words ending in "ing", with the same words, excpet ending in "ong", and vice versa.</b></p>
</div>

<div align="center">

![Commit Activity](https://img.shields.io/github/commit-activity/m/SXYTEM/UrbanOctoWaffle?style=for-the-badge)
![Bugs](https://img.shields.io/github/issues/SXYTEM/UrbanOctoWaffle/bug.svg?style=for-the-badge)

</div>

## How to get started
1. If you don't already have a [Discord](https://discord.com/) account, create one at https://discord.com/.
2. If (or when) you have an account, go to https://discord.com/developers/applications and create a new application.
3. Go to the application's "Bot" tab and click the "Add Bot" button. Below, in the "Privileged Gateway Intents" section, turn on "Message Content Intent".
4. Go to the "OAuth2" section of the application, and go to the "URL Generator" subsection. In "Scopes", select "bot". Then, in the "Bot Permissions" section, select the "Send Messages" permission.
5. Down in the "Generated URL" section, copy the URL. Open the URL, and you'll be prompted to log into Discord. Then, you'll be prompted to invite the bot. Select the server, and click "Authorise".
6. Go to [UrbanOctoWaffle's GitHub page](https://github.com/SXYTEM/UrbanOctoWaffle), and download the repository. Alternatively, you can clone the repository using [Git](https://git-scm.com/) (download at https://git-scm.com/) by running the following command:
   ```shell
   $ git init
   $ git clone https://github.com/SXYTEM/UrbanOctoWaffle
   ```
7. Go to your bot's application page, then to the "Bot" tab. Then, generate and copy the token under the "Token" section.
8. Paste the bot token in the [config.json](config.json) file under the "TOKEN" variable.
9. Download and install [Node](https://nodejs.org/) if you don't already have it, at https://nodejs.org/.
10. Then, to install the [dependencies](#dependencies), run the following command:
   ```shell
   $ npm install
   ```
Alternatively, you can run [install_packages.bat](install_packages.bat).

11. Then, run the following command to start the bot:
   ```shell
   $ node ./src
   ```
Alternatively, you can run [start.bat](start.bat).
12. Go to the server to which you invited the bot, and send a message containing a word ending in "ing", and vice versa. The bot will reply with the same words, except ending in "ong". *Voilá*!

## Configuration
The program can be configured in the [config.json](config.json) file. There exists a default configuration file ([./src/default_config.json](./src/default_config.json)), and you can restore the config file to its defaults by running the following command:
   ```shell
   $ copy ./src/default_config.json config.json
   ```
Alternatively, you can run [default_config.bat](default_config.bat), and you'll be prompted with a confirmation message, to which you have to answer "y" to replace the config file with its defaults.

## Dependencies
This project uses [Discord.js](https://discord.js.org/#/) and [Node](https://nodejs.org/).

| Package    | Version |
|------------|---------|
| Discord.js | 13.8.1  |
