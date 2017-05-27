console.log('Zufus starting');

const Discord = require('discord.js');
const path = require('path');

const client = new Discord.Client();

const API_TOKEN =
  require('fs')
    .readFileSync(path.resolve(__dirname, './API_TOKEN'), 'utf8')
    .trim();
const zufus = new Discord.Client();

zufus.on('ready', () => {
  console.log(`Logged in as ${zufus.user.username}!`);
});

zufus.on('message', msg => {
  if (msg.content === 'ping') {
    msg.channel.send('Pong!');
  }
});

zufus.login(API_TOKEN);
