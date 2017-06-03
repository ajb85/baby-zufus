console.log("Zufus starting");

const Discord = require("discord.js");
const path = require("path");

const client = new Discord.Client();

const API_TOKEN = require("fs")
  .readFileSync(path.resolve(__dirname, "./API_TOKEN"), "utf8")
  .trim();
const zufus = new Discord.Client();
var usageTacking = {};

zufus.on("ready", () => {
  console.log(`Logged in as ${zufus.user.username}!`);
});

zufus.on("message", msg => {
  //zufusID;
  if (msg.author.equals(zufus.user)) {
    return false;
  }
  if (msg.content === "ping") {
    msg.channel.send("Pong!");
    console.log(msg.author.username, "pinged");
  } else if (msg.content.toLowerCase() === "sortie") {
    var sortie = require("./sortie.js");
    sortie(function(giantString) {
      msg.channel.send(giantString);
      console.log(msg.author.username, "asked for Sorties");
    });
  } else if (msg.content.toLowerCase() === "alerts") {
    var alerts = require("./alertsData.js");
    alerts(function(giantString) {
      msg.channel.send(giantString);
      console.log(msg.author.username, "asked for alerts");
    });
  } else if (
    msg.isMentioned("189546691475668992") &&
    msg.content.search("raid") > 0
  ) {
    msg.channel.send("no u");
    console.log(msg.author.username, "asked for raids");
  } else if (
    msg.isMentioned("189546691475668992") &&
    msg.isMentioned("92717477225598976")
  ) {
    msg.channel.send("papa?");
    console.log(msg.author.username, "mentioned with Jenterro");
  }
});

zufus.login(API_TOKEN);
