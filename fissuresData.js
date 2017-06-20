var worldStateData = require("warframe-worldstate-data");
var fissureData = worldStateData.fissureModifiers;
var nodeData = worldStateData.solNodes;

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
    rawData.ActiveMissions,
    ["Node", "Modifier", "Expiry.$date.$numberLong"]
  ];
  return dataOfInterest;
}

function outputFormat(dataMap, status) {
  var minSec = dataMap[0].map(function(entry) {
    return convertTime(entry["Expiry.$date.$numberLong"]);
  });
  var output = dataMap[0].map(function(dir, i) {
    return `  __${fissureData[
      dir.Modifier
    ].value} ${nodeData[dir.Node].enemy} (${nodeData[dir.Node].type})__ ${nodeData[dir.Node].value}  ${minSec[i]}\n`;
  });
  output.unshift(`**Fissures**\n`);
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
  var interestingRewards = require("./rewardsOfInterest.js");
  var matches = interestingRewards
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
