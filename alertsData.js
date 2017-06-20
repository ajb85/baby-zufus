var worldStateData = require("warframe-worldstate-data");
var missionData = worldStateData.missionTypes;
var factionData = worldStateData.factions;
var rewardsData = worldStateData.languages;
var nodeData = worldStateData.solNodes;
var rewardsDB = require("./rewardsDB.json");
var rOI = require("./rewardsOfInterest.json");

function getAlertData(callback, status) {
  var body = require("./wfWorldStateData.js");
  body(
    function(rawData) {
      callback(rawData);
    },
    setDataType,
    outputFormat,
    status
  );
}

function setDataType(rawData) {
  var dataOfInterest = [
    rawData.Alerts,
    [
      "_id.$oid",
      "MissionInfo.missionReward",
      "MissionInfo.faction",
      "MissionInfo.missionType",
      "MissionInfo.location",
      "Expiry.$date.$numberLong"
    ]
  ];
  return dataOfInterest;
}

function outputFormat(dataMap, status) {
  if (status === "time request") {
    dataMap = matchesExist(findMatches(dataMap[0]));
    if (dataMap !== "nada") {
      var output = dataMap.map(function(dir) {
        if (dir["MissionInfo.missionReward"].items !== undefined) {
          var reward = dir["MissionInfo.missionReward"].items[0];
          var rewardTranslation = rOI[1][rOI[0].indexOf(reward.toLowerCase())];
          var mentions = rewardsDB[rewardTranslation];
          mentions = mentions.map(function(idToMention) {
            return `<@${idToMention}>`;
          });
          if (mentions !== undefined) {
            return [
              `${mentions.join(", ")}:\n**${rewardsData[reward.toLowerCase()][
                "value"
              ]} (${numberWithCommas(
                dir["MissionInfo.missionReward"].credits
              )}cr)** ${convertTime(dir["Expiry.$date.$numberLong"])}\n`,
              JSON.stringify(dir["_id.$oid"])
            ];
          } else {
            return void 0;
          }
        }
      });
    }
  } else if ((status = "user request")) {
    var minSec = dataMap[0].map(function(entry) {
      return convertTime(entry["Expiry.$date.$numberLong"]);
    });
    var credits = dataMap[0].map(function(entry) {
      return numberWithCommas(entry["MissionInfo.missionReward"].credits);
    });
    var output = dataMap[0].map(function(dir, i) {
      if (dir["MissionInfo.missionReward"].countedItems != undefined) {
        var reward = dir["MissionInfo.missionReward"].countedItems[0];
        return `  __${reward.ItemCount} ${rewardsData[
          reward.ItemType.toLowerCase()
        ]["value"]}__ (${credits[i]}cr) -- ${minSec[i]}\n`;
      } else if (dir["MissionInfo.missionReward"].items != undefined) {
        var reward = dir["MissionInfo.missionReward"].items[0];
        return `  __${rewardsData[reward.toLowerCase()]["value"]}__ (${credits[
          i
        ]}cr) -- ${minSec[i]}\n`;
      }
    });
    output.unshift(`**Alerts**\n`);
  }
  return output;
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
  return `*${time.join(" ")}*`;
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function findMatches(alerts) {
  var path = "MissionInfo.missionReward";
  var interestingRewards = require("./rewardsOfInterest.json");
  var matches = interestingRewards[0]
    .map(function(rewards) {
      return alerts.filter(function(currentAlerts) {
        if (
          (currentAlerts[path].countedItems !== undefined &&
            currentAlerts[path].countedItems[0].ItemType.toLowerCase() ===
              rewards) ||
          (currentAlerts[path].items != undefined &&
            currentAlerts[path].items[0].toLowerCase() === rewards)
        ) {
          return currentAlerts;
        }
      });
    })
    .filter(function(empty) {
      return empty != "";
    });
  return matches;
}

function matchesExist(matches) {
  if (matches.length !== 0) {
    return matches.reduce(function(accum, currentVal) {
      return accum.concat(currentVal);
    });
  } else {
    return "nada";
  }
}

module.exports = function(callback, status) {
  getAlertData(callback, status);
};
