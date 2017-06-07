var worldStateData = require("warframe-worldstate-data");
var missionData = worldStateData.missionTypes;
var factionData = worldStateData.factions;
var rewardsData = worldStateData.languages;
var nodeData = worldStateData.solNodes;

function getAlertData(callback) {
  var body = require("./wfWorldStateData.js");
  body(
    function(rawData, dataOfInterest, output) {
      callback(rawData);
    },
    setDataType,
    outputFormat
  );
}

function setDataType(rawData) {
  var dataOfInterest = [
    rawData.Alerts,
    [
      "MissionInfo.missionReward",
      "MissionInfo.faction",
      "MissionInfo.missionType",
      "MissionInfo.location"
    ],
    rawData.Alerts,
    ["Expiry.$date.$numberLong"]
  ];
  return dataOfInterest;
}

function outputFormat(dataMap) {
  var minSec = dataMap[0].map(function(x) {
    return convertTime(x["Expiry.$date.$numberLong"]);
  });

  var credits = dataMap[1].map(function(x) {
    return numberWithCommas(x["MissionInfo.missionReward"].credits);
  });

  var output = dataMap[1].map(function(dir, i) {
    if (dir["MissionInfo.missionReward"].countedItems != undefined) {
      var reward = dir["MissionInfo.missionReward"].countedItems[0];
      return `**${reward.ItemCount} ${rewardsData[reward.ItemType.toLowerCase()]["value"]} (${credits[i]}cr)** ${minSec[i]}\n`;
    } else if (dir["MissionInfo.missionReward"].items != undefined) {
      var reward = dir["MissionInfo.missionReward"].items[0];
      return `**${rewardsData[reward.toLowerCase()]["value"]} (${credits[i]}cr)** ${minSec[i]}\n`;
    }
  });
  return output;
}

function convertTime(ExpTime) {
  var currentTime = new Date();
  var timeDiff = ExpTime - currentTime;
  var minutes = Math.floor(timeDiff / 1000 / 60);
  var seconds = Math.round(timeDiff / 1000) % 60;
  return `*(${minutes}m ${seconds}s)*`;
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

module.exports = function(callback) {
  getAlertData(callback);
};
