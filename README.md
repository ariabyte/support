# ariabyte support
This is a simple Discord bot made for the ariabyte Discord server.

## How to run
- Clone this repo
- Run `npm i`
- Create a `config.json` file like the one below
- Run `node .\registerCommands.js`
- Run `npm start`
- Done!

## Example config.json
```JSON
{
    "token": "Discord Bot Token",
    "clientId": "Discord Client ID",
    "guildId": "Discord Guild ID",
    "categoryId": "Discord category for tickets",
    "supportRole": "Discord role to ping on ticket creation",
    "logsChannel": "Discord Logs Channel ID",
    "mongo": "MongoDB connection string",
    "adminIds": ["IDs of admins"]
}
```