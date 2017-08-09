process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
console.log("Zufus starting");
const Discord = require("discord.js");
const path = require("path");
const zufusTalk = require("./zufusTalk.js");
const persistent = require("./writeData.js");
const fs = require("fs");
const zufusLog = "190723198650679297";
const API_TOKEN = require("fs")
  .readFileSync(path.resolve(__dirname, "./API_TOKEN"), "utf8")
  .trim();
const zufus = new Discord.Client();
const zufusSpam = "325944060135342090";
const sham = "168613541035638784";
const channel = zufus.channels.find("id", zufusSpam);
const writeData = require("./writeData.js");
var repeatFrequency = 60000;
var zufusLoops = require("./zufusLoops.js");

zufus.on("ready", () => {
  console.log(`Logged in as ${zufus.user.username}!`);
  zufusLoops(zufus);
  setInterval(loopDaZufus, repeatFrequency);
});

zufus.on("message", msg => {
  zufusTalk(zufus, msg);
});

function loopDaZufus() {
  //console.log("Looping da Zufus");
  zufusLoops(zufus);
}

zufus.login(API_TOKEN);
