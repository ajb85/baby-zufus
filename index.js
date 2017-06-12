console.log("Zufus starting");

const Discord = require("discord.js");
const path = require("path");

const client = new Discord.Client();

const API_TOKEN = require("fs")
  .readFileSync(path.resolve(__dirname, "./API_TOKEN"), "utf8")
  .trim();
const zufus = new Discord.Client();
var usageTacking = {};
var zufusID = "189546691475668992";
var papaInterro = "92717477225598976";
var zufuslog = "190723198650679297";
var alertIDs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
zufus.on("ready", () => {
  console.log(`Logged in as ${zufus.user.username}!`);
  checkAlerts();
  setInterval(checkAlerts, 600000);
});

zufus.on("message", msg => {
  if (msg.author.equals(zufus.user)) {
    return false;
  }
  if (msg.content === "ping") {
    msg.channel.send("Pong!");
    console.log(msg.author.username, "pinged");
    //Sneaky Sneaky
  } else if (msg.content.toLowerCase() === "sneaky sneaky") {
    var sneaks = Math.floor(Math.random() * 11);
    var plural = sneaks > 1 ? "sneaks" : "sneak";
    msg.channel.send("Sniffing out any sneaky sneaks...");
    setTimeout(function() {
      msg.channel.send(`I found ${sneaks} sneaky ${plural}.`);
    }, 2500);
    console.log(msg.author.username, "checkin' for da sneaks");
    // World State Data
  } else if (msg.content.toLowerCase() === "sortie") {
    var sortie = require("./sortieData.js");
    sortie(function(giantString) {
      msg.channel.send(giantString);
      console.log(msg.author.username, "asked for Sorties");
    });
  } else if (
    msg.content.toLowerCase() === "alerts" ||
    msg.content.toLowerCase() === "alert"
  ) {
    var alerts = require("./alertsData.js");
    alerts(function(giantString, status) {
      msg.channel.send(giantString);
      console.log(msg.author.username, "asked for alerts");
    }, "user request");
  } else if (
    msg.content.toLowerCase() === "invasions" ||
    msg.content.toLowerCase() === "invasion"
  ) {
    var invasions = require("./invasionsData.js");
    invasions(function(giantString) {
      msg.channel.send(giantString);
      console.log(msg.author.username, "asked for invasions");
    });
  } else if (msg.content.toLowerCase() === "update") {
    var sortie = require("./sortieData.js");
    var alerts = require("./alertsData.js");
    var invasions = require("./invasionsData.js");
    alerts(function(giantString) {
      msg.channel.send(giantString);
    });
    invasions(function(giantString) {
      msg.channel.send(giantString);
      console.log(msg.author.username, "asked for updates on all");
    });
    sortie(function(giantString) {
      msg.channel.send(giantString);
    });
  } else if (msg.isMentioned(zufusID) && msg.content.search("raid") > 0) {
    // Zufus Sass
    msg.channel.send("no u");
    console.log(msg.author.username, "asked for raids");
  } else if (msg.isMentioned(zufusID) && msg.isMentioned(papaInterro)) {
    msg.channel.send("papa?");
    console.log(msg.author.username, "mentioned with Jenterro");
  }
});

function checkAlerts() {
  const channel = zufus.channels.find("id", zufuslog);
  //console.log("Checking for alerts");
  var rOI = require("./alertsData.js");
  rOI(function(giantString) {
    console.log("giantString:", giantString);
    giantString.forEach(function(newAlerts) {
      if (alertIDs.indexOf(newAlerts[1]) < 0) {
        alertIDs.push(newAlerts[1]);
        alertIDs.shift();
        channel.send(newAlerts[0]);
      }
    });
  }, "time request");
}

zufus.login(API_TOKEN);
