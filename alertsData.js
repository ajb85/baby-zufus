var worldStateData = require("warframe-worldstate-data");
var request = require("request");

var missionData = worldStateData.missionTypes;
var factionData = worldStateData.factions;
var rewardsData = worldStateData.languages;
var nodeData = worldStateData.solNodes;

function rawAlertData(callBack) {
  request(
    "http://content.warframe.com/dynamic/worldState.php",
    { json: true },
    function(error, response, body) {
      console.log("error:", error);

      var alerts = body.Alerts.map(function(variant) {
        return {
          rewards: variant.MissionInfo.missionReward,
          enemyLevel1: variant.MissionInfo.minEnemyLevel,
          enemyLevel2: variant.MissionInfo.maxEnemyLevel,
          faction: variant.MissionInfo.faction,
          missionType: variant.MissionInfo.missionType,
          location: variant.MissionInfo.location,
          time: variant.Expiry.$date.$numberLong
        };
      });
      callBack(alerts);
    }
  );
}

function translateAlerts(alerts) {
  var i = 0;
  var output = [];

  while (alerts[i] != undefined) {
    var minSec = convertTime(alerts[i].time);
    var alertRewards = alerts[i].rewards;
    var credits = numberWithCommas(alertRewards.credits);

    if (alertRewards.countedItems != undefined) {
      output[i] = [
        `**${alertRewards.countedItems[0].ItemCount} ${rewardsData[alertRewards.countedItems[0].ItemType.toLowerCase()]["value"]} (${credits}cr)** ${minSec}\n`
      ];
    } else if (alertRewards.items != undefined) {
      output[i] = [
        `**${rewardsData[alertRewards.items[0].toLowerCase()]["value"]} (${credits}cr)** ${minSec}\n`
      ];
    } else {
      output[i] = undefined;
    }
    if (output[i] != undefined) {
      output[i] =
        output[i] +
        `  ${factionData[alerts[i].faction]["value"]} ${missionData[alerts[i].missionType]["value"]}\n  ${nodeData[alerts[i].location]["value"]}\n\n`;
    }
    i += 1;
  }
  return output.join("");
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
  rawAlertData(function(mRData) {
    callback(translateAlerts(mRData));
  });
};
