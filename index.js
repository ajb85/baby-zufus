console.log("Zufus starting");
const Discord = require("discord.js");
const path = require("path");
//const zufusTalk = require("./zufusTalk.js");
const persistent = require("./writeData.js");
const fs = require("fs");
const zufusLog = "190723198650679297";
const API_TOKEN = require("fs")
  .readFileSync(path.resolve(__dirname, "./API_TOKEN"), "utf8")
  .trim();
const zufus = new Discord.Client();
const zufusSpam = "325944060135342090";
const channel = zufus.channels.find("id", zufusSpam);
const writeData = require("./writeData.js");
var repeatFrequency = 60000;
var zufusLoops = require("./zufusLoops.js");

zufus.on("ready", () => {
  console.log(`Logged in as ${zufus.user.username}!`);
  zufusLoops(zufus);
  setInterval(loopDaZufus, repeatFrequency);
});
const messages = {
  sortie: undefined,
  alerts: undefined,
  invasions: undefined,
  fissures: undefined
};
/*
zufus.on("message", msg => {
  zufusTalk(zufus, msg);
});*/

function loopDaZufus() {
  console.log("Looping da Zufus");
  zufusLoops(zufus);
}
function saveFile(fileName, data) {
  fs.writeFile(fileName, JSON.stringify(data), "utf8", err => {
    if (err) throw err;
  });
}

function checkRepeatAlerts(newIDs, oldIDs) {
  var goodAlerts = [];
  newIDs.forEach(function(newAlerts) {
    if (oldIDs.indexOf(newAlerts[1]) < 0) {
      oldIDs.push(newAlerts[1]);
      oldIDs.shift();
      goodAlerts.push(newAlerts[0]);
    }

    channel.send(goodAlerts.join(" "));
  });
}
/*invOI(function(giantString) {
    if (giantString !== undefined) {
      giantString.forEach(function(newInv) {
        if (rewardIDs.indexOf(newInv[1]) < 0) {
          rewardIDs.push(newInv[1]);
          rewardIDs.shift();
          channel.send(newInv[0]);
        }
      });
    }
  }, "time request");*/

zufus.login(API_TOKEN);
