console.log("Zufus starting");
const Discord = require("discord.js");
const path = require("path");
var zufusTalk = require("./zufusTalk.js");
var persistent = require("./writeData.js");
var fs = require("fs");
var zufusLog = "190723198650679297";
var zufusSpam = "325944060135342090";
const client = new Discord.Client();
const API_TOKEN = require("fs")
  .readFileSync(path.resolve(__dirname, "./API_TOKEN"), "utf8")
  .trim();
const zufus = new Discord.Client();
var alertFrequency = 600000;

zufus.on("ready", () => {
  console.log(`Logged in as ${zufus.user.username}!`);
  checkAlerts();
  setInterval(checkAlerts, alertFrequency);
});

zufus.on("message", msg => {
  zufusTalk(zufus, msg);
});

function checkAlerts() {
  var alertsOI = require("./alertsData.js");
  var invOI = require("./invasionsData.js");
  alertsOI(function(giantString) {
    if (giantString !== undefined && giantString[0] !== undefined) {
      var rewardIDs = require("./rewardIDDB.json");
      checkRepeatAlerts(giantString, rewardIDs);
    }
  }, "time request");
}

function saveFile(fileName, data) {
  fs.writeFile(fileName, JSON.stringify(data), "utf8", err => {
    if (err) throw err;
  });
}

function checkRepeatAlerts(newIDs, oldIDs) {
  const channel = zufus.channels.find("id", zufusLog);
  var goodAlerts = [];
  //var fileName = "./rewardIDDB.json";

  newIDs.forEach(function(newAlerts) {
    if (oldIDs.indexOf(newAlerts[1]) < 0) {
      oldIDs.push(newAlerts[1]);
      oldIDs.shift();
      goodAlerts.push(newAlerts[0]);
      //saveFile(fileName, oldIDs);
    }
    //  console.log("giantstring:", newIDs);
    //  console.log("rewardIDs:", oldIDs);
    console.log("Return array:", goodAlerts);
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
