console.log("Zufus starting");
const Discord = require("discord.js");
const path = require("path");
var zufusTalk = require("./zufusTalk.js");

const client = new Discord.Client();
const API_TOKEN = require("fs")
  .readFileSync(path.resolve(__dirname, "./API_TOKEN"), "utf8")
  .trim();
const zufus = new Discord.Client();
var alertFrequency = 600000;

zufus.on("ready", () => {
  console.log(`Logged in as ${zufus.user.username}!`);
  setInterval(checkAlerts, alertFrequency);
});

zufus.on("message", msg => {
  zufusTalk(zufus, msg);
});

function checkAlerts() {
  const channel = zufus.channels.find("id", zufuslog);
  console.log("Checking for alerts");
  var alertsOI = require("./alertsData.js");
  var invOI = require("./invasionsData.js");
  alertsOI(function(giantString) {
    if (giantString !== undefined) {
      giantString.forEach(function(newAlerts) {
        if (alertIDs.indexOf(newAlerts[1]) < 0) {
          alertIDs.push(newAlerts[1]);
          alertIDs.shift();
          channel.send(newAlerts[0]);
          writeJsonFile("foo.json", { foo2: false }).then(() => {
            console.log("done");
          });
        }
      });
    }
  }, "time request");

  /*invOI(function(giantString) {
    if (giantString !== undefined) {
      giantString.forEach(function(newInv) {
        if (alertIDs.indexOf(newInv[1]) < 0) {
          alertIDs.push(newInv[1]);
          alertIDs.shift();
          channel.send(newInv[0]);
        }
      });
    }
  }, "time request");*/
}

zufus.login(API_TOKEN);
