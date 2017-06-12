var worldStateData = require("warframe-worldstate-data");
//var missionData = worldStateData.missionTypes;
//var factionData = worldStateData.factions;
var rewardsData = worldStateData.languages;
var nodeData = worldStateData.solNodes;

function getInvasionData(callback) {
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
    rawData.Invasions,
    ["Node", "AttackerReward", "DefenderReward"]
  ];
  return dataOfInterest;
}

function outputFormat(dataMap) {
  var output = dataMap[0].map(function(dir) {
    var node = nodeData[dir.Node]["value"];
    if (
      dir.AttackerReward.countedItems != undefined &&
      dir.DefenderReward.countedItems != undefined
    ) {
      var attReward = dir.AttackerReward.countedItems[0];
      var defReward = dir.DefenderReward.countedItems[0];
      return `  __${rewardsData[attReward.ItemType.toLowerCase()]["value"]} (${attReward.ItemCount})__ vs. __${rewardsData[defReward.ItemType.toLowerCase()]["value"]} (${defReward.ItemCount})__ *${node}*\n`;
    } else if (
      dir.AttackerReward.items != undefined &&
      dir.DefenderReward.items != undefined
    ) {
      var attReward = dir.AttackerReward.items[0];
      var defReward = dir.DefenderReward.items[0];
      return `  __${rewardsData[attReward.toLowerCase()]["value"]}__ vs. __${rewardsData[defReward.toLowerCase()]["value"]}__ *${node}*\n`;
    } else if (
      dir.AttackerReward.countedItems === undefined &&
      dir.DefenderReward.countedItems != undefined
    ) {
      var reward = dir.DefenderReward.countedItems[0];
      return `  __${rewardsData[reward.ItemType.toLowerCase()]["value"]} (${reward.ItemCount})__ *${node}*\n`;
    } else if (
      dir.AttackerReward.countedItems != undefined &&
      dir.DefenderReward.countedItems === undefined
    ) {
      var reward = dir.AttackerReward.countedItems[0];
      return `  ${reward.ItemCount} __${rewardsData[reward.ItemType.toLowerCase()]["value"]}__ *${node}*\n`;
    }
  });
  output.unshift(`**Invasions**\n`);
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
  getInvasionData(callback);
};
