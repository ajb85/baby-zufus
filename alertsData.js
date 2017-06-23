var worldStateData = require("warframe-worldstate-data");
var missionData = worldStateData.missionTypes;
var factionData = worldStateData.factions;
var rewardsData = worldStateData.languages;
var nodeData = worldStateData.solNodes;
var rewardsDB = require("./rewardsDB.json");
var rOI = require("./rewardsOfInterest.json");

function getAlertData(callback) {
  var body = require("./wfWorldStateData.js");
  body(
    function(rawData) {
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
/*{embed: {
    color: 3447003,
    author: {
      name: client.user.username,
      icon_url: client.user.avatarURL
    },
    title: "**Active Alerts**",
    //url: "http://google.com",
    //description: "This is a test embed to showcase what they look like and what they can do.",
    fields: [{
        name: "Reward (Credits) - Time left",
        value: "Node (Planet)."
      },
      {
        name: "Masked links",
        value: "You can put [masked links](http://google.com) inside of rich embeds."
      },
      {
        name: "Markdown",
        value: "You can put all the *usual* **Markdown** inside of them."
      }
    ],
    timestamp: new Date(),
    footer: {
      icon_url: client.user.avatarURL,
      text: "© Example"
    }
  }
});*/
function outputFormat(dataMap) {
  var minSec = dataMap[0].map(function(entry) {
    return convertTime(entry["Expiry.$date.$numberLong"]);
  });
  var credits = dataMap[0].map(function(entry) {
    return numberWithCommas(entry["MissionInfo.missionReward"].credits);
  });
  var embedObject = dataMap[0]
    .map(function(dir, i) {
      if (dir["MissionInfo.missionReward"].countedItems != undefined) {
        var reward = dir["MissionInfo.missionReward"].countedItems[0];
        return {
          name: `${reward.ItemCount} ${rewardsData[
            reward.ItemType.toLowerCase()
          ]["value"]} (${credits[i]} credits)`,
          value: `${minSec[i]} -- ${nodeData[dir["MissionInfo.location"]]
            .value}`
        };
      } else if (dir["MissionInfo.missionReward"].items != undefined) {
        var reward = dir["MissionInfo.missionReward"].items[0];
        return {
          name: `${rewardsData[reward.toLowerCase()]["value"]} (${minSec[i]})`,
          value: `(${credits[i]}cr) -- ${nodeData[dir["MissionInfo.location"]]
            .value}`
        };
      }
    })
    .filter(function(empty) {
      return empty != null;
    });
  var output = {
    embed: {
      color: 3447003,
      author: {
        name: "Alerts",
        icon_url:
          "https://cdn.pixabay.com/photo/2013/04/01/10/57/exclamation-mark-98739_960_720.png"
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
              rewards.toLowerCase()) ||
          (currentAlerts[path].items != undefined &&
            currentAlerts[path].items[0].toLowerCase() ===
              rewards.toLowerCase())
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

module.exports = function(callback) {
  getAlertData(callback);
};
//WORKING outputFormat!!!!!!
/*function outputFormat(dataMap) {
  var minSec = dataMap[0].map(function(entry) {
    return convertTime(entry["Expiry.$date.$numberLong"]);
  });
  var credits = dataMap[0].map(function(entry) {
    return numberWithCommas(entry["MissionInfo.missionReward"].credits);
  });
  var output = dataMap[0].map(function(dir, i) {
    if (dir["MissionInfo.missionReward"].countedItems != undefined) {
      var reward = dir["MissionInfo.missionReward"].countedItems[0];
      return `  ${reward.ItemCount} ${rewardsData[
        reward.ItemType.toLowerCase()
      ]["value"]} (${credits[i]}cr) -- ${minSec[i]}\n`;
    } else if (dir["MissionInfo.missionReward"].items != undefined) {
      var reward = dir["MissionInfo.missionReward"].items[0];
      return `  ${rewardsData[reward.toLowerCase()]["value"]} (${credits[
        i
      ]}cr) -- ${minSec[i]}\n`;
    }
  });
  output.unshift(`**Alerts**\n`);
  return output;
}*/

//Old outputformat code:
/*  if (status === "time request") {
  dataMap = matchesExist(findMatches(dataMap[0]));
  if (dataMap !== "nada") {
    var output = dataMap.map(function(dir) {
      if (dir["MissionInfo.missionReward"].items !== undefined) {
        var reward = dir["MissionInfo.missionReward"].items[0];
        var rewardTranslation = rOI[1][rOI[0].indexOf(reward.toLowerCase())];
        var mentions = rewardsDB[rewardTranslation];
        if (mentions !== undefined) {
          mentions = mentions.map(function(idToMention) {
            return `<@${idToMention}>`;
          });
        }
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
} else if ((status = "user request")) {*/
