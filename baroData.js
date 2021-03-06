const worldStateData = require("warframe-worldstate-data");
const fissureData = worldStateData.fissureModifiers;
const nodeData = worldStateData.solNodes;
const rewardsData = worldStateData.languages;
const baroRewards = require("./newStuffNotInWFWS.json");

function getBaroData(callback, status) {
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
    rawData.VoidTraders,
    [
      "_id.$oid",
      "Activation.$date.$numberLong",
      "Expiry.$date.$numberLong",
      "Character",
      "Node",
      "Manifest"
    ]
  ];
  return dataOfInterest;
}

function outputFormat(dataMap, status) {
  var startTime = dataMap[0][0]["Activation.$date.$numberLong"];
  var tilStart = startTime - new Date();
  var minSecStart = convertTime(startTime);
  var minSecExp = convertTime(dataMap[0][0]["Expiry.$date.$numberLong"]);
  var traderName = "Baro Ki'Teer";
  if (startTime > new Date()) {
    var embedObject = [
      {
        name: `Appearing at the ${nodeData[dataMap[0][0].Node].value}:`,
        value: `${minSecStart}`
      }
    ];
  } else {
    traderName += ` - ${nodeData[dataMap[0][0].Node].value}`;
    var embedObject = dataMap[0][0].Manifest.map(function(baroReward) {
      var credits = numberWithCommas(baroReward.RegularPrice);
      var ducats =
        baroReward.PrimePrice > 0 ? `${baroReward.PrimePrice} Ducats - ` : "";
      if (rewardsData[baroReward.ItemType.toLowerCase()] !== undefined) {
        return {
          name: `${rewardsData[baroReward.ItemType.toLowerCase()].value}`,
          value: `${ducats}${credits} Credits`
        };
      } else {
        return {
          name: `${baroRewards[baroReward.ItemType]}`,
          value: `${ducats}${credits} Credits`
        };
      }
    });
  }
  var output = {
    embed: {
      color: 3447003,
      author: {
        name: traderName,
        icon_url:
          "http://img1.wikia.nocookie.net/__cb20150123124915/warframe/images/0/03/Voidtraderplaceholder.png"
      },
      fields: embedObject,
      timestamp: new Date(),
      footer: {
        text: "© ZufusNews"
      }
    }
  };

  return output;
}
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function convertTime(ExpTime) {
  var time = [];
  var currentTime = new Date();
  var timeDiff = Math.abs(ExpTime - currentTime);
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
  getBaroData(callback, status);
};
