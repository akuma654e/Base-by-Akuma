const { GatewayIntentBits, Partials, Collection, Client } = require('discord.js');
const guildSchema = require('./botDatabase/dbSchemas/Guild.js');
const userSchema = require('./botDatabase/dbSchemas/User.js');
const dotenv = require('dotenv');
const fs = require('fs');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages
  ],
  partials: [Partials.Channel, Partials.Message]
});

client.db = new Collection();
client.commands = new Collection();
client.aliases = new Collection();
client.slash = new Collection();

dotenv.config()

client.login(process.env.BOT_TOKEN);

client.once('ready', async () => { client.db.guilds = guildSchema; client.db.users = userSchema; });

const indexDb = require('./botDatabase/index.js');
indexDb.start();

fs.readdir('./src/events/', (err, eventosPath) => {
  eventosPath.forEach((f) => {
    if (!f.endsWith('.js')) return;

    const eventoFile = require(`./events/${f}`);
    let eventoNome = f.split('.')[0];

    client.on(eventoNome, (...args) => {
      eventoFile(client, ...args);
    });
  });
});

fs.readdirSync('./src/normalCommands/').forEach((cmdsPath) => {
  const botComandos = fs.readdirSync(`./src/normalCommands/${cmdsPath}`).filter((fileJs) => fileJs.endsWith('.js'));

  for (let fileCmd of botComandos) {
    let acharCmd = require(`./normalCommands/${cmdsPath}/${fileCmd}`);

    if (acharCmd.name) {
      client.commands.set(acharCmd.name, acharCmd);
    }
    if (acharCmd.aliases && Array.isArray(acharCmd.aliases))
      acharCmd.aliases.forEach((x) => client.aliases.set(x, acharCmd.name));
  }
});

let slashArray = [];
fs.readdirSync('./src/slashCommands/').forEach((cmdsPath) => {
  const botComandos = fs.readdirSync(`./src/slashCommands/${cmdsPath}`).filter((fileJs) => fileJs.endsWith('.js'));

  for (let fileCmd of botComandos) {
    let acharCmd = require(`./slashCommands/${cmdsPath}/${fileCmd}`);

    if (acharCmd.name) {
      client.slash.set(acharCmd.name, acharCmd);
      slashArray.push(acharCmd)
    } else {
      continue;
    }
  }
});

module.exports = client;
module.exports = slashArray;
