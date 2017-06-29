//Back-end data to process World State
const alertsData = require("./alertsData.js");
const sortieData = require("./sortieData.js");
const fissuresData = require("./fissuresData.js");
const invasionsData = require("./invasionsData.js");
const messageIDs = require("./messageIDs.json");
const baroData = require("./baroData.js");
const rewardsDB = require("./rewardsDB.json");
const uniqueID = require("./rewardIDDB.json");
var fs = require("fs");
var worldStateData = require("warframe-worldstate-data");
var rewardsData = worldStateData.languages;

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
    postData(zufus, currentAlert[0], "alerts");
    if (currentAlert[1] !== undefined && currentAlert[1][0] !== undefined) {
      var dmList = compileDMList(currentAlert[1]);
      if (dmList[0] !== undefined) {
        sendDMs(dmList, zufus);
      }
    }
    checkFissures(zufus);
  });
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

function compileDMList(goodAlerts) {
  var dmList = goodAlerts.map(function(alert, i) {
    var alertedUsers = fetchAlertedUsers(alert);
    var path = alert[1]["MissionInfo.missionReward"];
    if (path.items !== undefined) {
      var garbledName = path.items[0].toLowerCase();
    } else if (path.countedItems !== undefined) {
      var garbledName = path.countedItems[0].ItemType.toLowerCase();
    }

    var translatedName = rewardsData[garbledName].value.toLowerCase();
    var interestedUsers = rewardsDB[translatedName];
    var userList = interestedUsers.filter(function(id) {
      return alertedUsers.indexOf(id) < 0;
    });
    idRecord(alert);
    if (userList !== undefined && userList.length > 0) {
      return [
        userList,
        `Watchlist item found.  There is an active alert for **${translatedName}**`
      ];
    }
  });
  return dmList;
}
function fetchAlertedUsers(alert) {
  var id = alert[1]["_id.$oid"];
  var output = [];
  alert[0].forEach(function(userID) {
    if (uniqueID[id] === undefined) {
      uniqueID[id] = [userID];
    } else if (uniqueID[id].indexOf(userID) < 0) {
      uniqueID[id].push(userID);
    } else {
      output.push(userID);
    }
  });
  return output;
}
function idRecord(alert) {
  fs.writeFile("./rewardIDDB.json", JSON.stringify(uniqueID), "utf8", err => {
    if (err) throw err;
  });
}

function sendDMs(list, zufus) {
  list.forEach(function(icur, i) {
    icur[0].forEach(function(jcur) {
      var server = zufus.fetchUser(jcur).then(
        user => {
          user.send(icur[1]);
        },
        reject => {
          console.log("reject:", reject);
        }
      );
    });
  });
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
  //console.log(file);
  if (file !== undefined) {
    file = Object.assign(messageIDs, file);
    fs.writeFile(fileName, JSON.stringify(file), "utf8", err => {
      if (err) throw err;
    });
  }
}
module.exports = function(zufus) {
  checkSorties(zufus);
};
