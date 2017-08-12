//Back-end data to process World State
const alertsData = require("./alertsData.js");
const sortieData = require("./sortieData.js");
const fissuresData = require("./fissuresData.js");
const invasionsData = require("./invasionsData.js");
const messageIDs = require("./messageIDs.json");
const baroData = require("./baroData.js");
const fs = require("fs");

//Discord/output data
const Discord = require("discord.js");
const zufusSpamID = "325944060135342090";

//Check World State data, call function to post the data, repeat for next type.
function checkSorties(zufus) {
  sortieData(function(currentSortie) {
    postData(zufus, currentSortie, "sortie");
    checkAlerts(zufus);
  });
}

function checkAlerts(zufus) {
  alertsData(function(currentAlert) {
    postData(zufus, currentAlert[0][0], "alerts");
    if (
      currentAlert[1] !== undefined &&
      currentAlert[1][1] !== undefined &&
      currentAlert[1][1].length > 0
    ) {
      sendDMs(currentAlert[1], zufus);
    }
  });
  checkFissures(zufus);
}

function checkFissures(zufus) {
  fissuresData(function(currentFissures) {
    postData(zufus, currentFissures, "fissures");
    checkInvasions(zufus);
  });
}

function checkInvasions(zufus) {
  invasionsData(function(currentInvasions) {
    postData(zufus, currentInvasions, "invasions");
    checkBaro(zufus);
  });
}

function checkBaro(zufus) {
  baroData(function(currentBaro) {
    postData(zufus, currentBaro, "baro");
  });
}

function sendDMs(list, zufus) {
  if (list[1] !== undefined && list[1][1] !== undefined) {
    list[1].forEach(function(userIDList, i) {
      userIDList.forEach(function(user) {
        var server = zufus.fetchUser(user).then(
          user => {
            user.send(list[0][i]);
            console.log(`Messaging ${user.username} about an alert.`);
          },
          reject => {
            log("reject:", reject);
          }
        );
      });
    });
  }
}
//Uses message IDs in Discord.js to edit existing messages or create new
//messages if they doesn't exist.
function postData(zufus, currentData, missionType) {
  const channel = zufus.channels.find("id", zufusSpamID);
  if (
    //Checks for existing ID, skips if not found.
    //Currently this will run if it finds an old ID of a deleted message.
    //However, the promise will be rejected and the function will run again,
    //except the ID will be changed to "N/A"
    messageIDs[missionType] !== undefined &&
    messageIDs[missionType] !== "N/A"
  ) {
    channel.fetchMessage(messageIDs[missionType]).then(
      lastMessage => {
        lastMessage.edit(currentData);
      },
      reject => {
        writeData({ [missionType]: "N/A" }, "./messageIDs.json");
        postData(zufus, currentData, missionType);
      }
    );
  } else {
    //If the ID didn't exist or the message was deleted, a new one is sent.
    channel.send(currentData).then(function(prevAlert) {
      writeData(
        { [missionType]: prevAlert.channel.lastMessageID },
        "./messageIDs.json"
      );
    });
  }
}

//Saving messageIDs to be used when the program stops and is restarted.
function writeData(file, fileName) {
  if (file !== undefined) {
    file = Object.assign(messageIDs, file);
    fs.writeFile(fileName, JSON.stringify(file), "utf8", err => {
      if (err) throw err;
    });
  }
}
function convertTime(ExpTime) {
  var time = [];
  var currentTime = new Date();
  var timeDiff = ExpTime - currentTime;
  if (timeDiff >= 86400000) {
    var days = Math.floor(timeDiff / 1000 / 60 / 60 / 24);
    time.push(`${days}d`);
  }
  if (timeDiff >= 3600000) {
    var hours = Math.round(timeDiff / 1000 / 60 / 60 % 24);
    time.push(`${hours}h`);
  }
  if (timeDiff >= 60000) {
    var minutes = Math.round(timeDiff / 1000 / 60 % 60);
    time.push(`${minutes}m`);
  }
  var seconds = Math.round(timeDiff / 1000) % 60;
  time.push(`${seconds}s`);
  return `${time.join(" ")}`;
}
module.exports = function(zufus) {
  checkSorties(zufus);
};
