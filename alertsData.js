const worldStateData = require("warframe-worldstate-data");
const missionData = worldStateData.missionTypes;
const factionData = worldStateData.factions;
const rewardsData = worldStateData.languages;
const nodeData = worldStateData.solNodes;
const rewardsDB = require("./rewardsDB.json");
const newData = require("./newStuffNotInWFWS.json");
const commonFunctions = require("./commonFunctions.js");
const dmRewards = require("./dmRewards.js");

function getAlertData(callback) {
  //Raw world state data is sent to wfWorldStateData file along with functions
  //needed to process alerts
  const body = require("./wfWorldStateData.js");
  body(
    function(rawData) {
      callback(rawData);
    },
    setDataType,
    outputFormat
  );
}

function setDataType(rawData) {
  //"Alerts" section of world state is selected, along with variable types
  //that are of interest to posting data
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

function outputFormat(dataMap) {
  var messageReadyOutput = embedFormat(dataMap[0]);
  var interestingMission = dmRewards.findMatches(dataMap);
  var concatToOneObject = dmRewards.combineAllMatches(interestingMission);
  if (concatToOneObject.length > 0) {
    messageReadyOutput.push(embedFormat(concatToOneObject, "DM"));
  }
  return messageReadyOutput;
}

function embedFormat(dataMap, status) {
  //Title set based on DM or post edit
  var titleName = "Alerts";
  if (status === "DM") {
    titleName = "Alert Update";
  }
  var embedObject = createEmbed(dataMap, status);
  //Emded format used to send messages and create/edit zufus-updates messages.
  if (embedObject !== undefined) {
    var messageReadyOutput = [
      {
        embed: {
          color: 3447003,
          author: {
            name: titleName,
            icon_url:
              "https://cdn.pixabay.com/photo/2013/04/01/10/57/exclamation-mark-98739_960_720.png"
          },
          fields: embedObject[0],
          timestamp: new Date(),
          footer: {
            text: "© ZufusNews"
          }
        }
      }
    ];
    //DMs will send user IDs along with alert message
    if (status === "DM") {
      return [messageReadyOutput, embedObject[1]];
    }
    return [messageReadyOutput];
  }
}

function createEmbed(dataMap, status) {
  var userList = [];
  var embed = dataMap
    .map(function(dir, i) {
      var rewardPath = "MissionInfo.missionReward";
      var countedPath = dir[rewardPath].countedItems;
      var itemsPath = dir[rewardPath].items;
      var creditsPath = dir[rewardPath].credits;
      //12398712498739 milliseconds --> 5d 3h 4m 1s
      var humanReadableTime = commonFunctions.convertTimeWithItalics(
        dir["Expiry.$date.$numberLong"]
      );
      //3000 --> 3,000
      var credits = commonFunctions.numberWithCommas(creditsPath);
      //Check for rewards with an amount stored under "countedItems"

      if (countedPath !== undefined) {
        var reward = countedPath[0];
        var translatedName = rewardsData[reward.ItemType.toLowerCase()].value;
        if (reward.ItemCount > 1) {
          var capitalizedRewards = commonFunctions
            .capitalizeRewards(translatedName)
            .join(" ");
          var finalizedReward = `${reward.ItemCount} ${capitalizedRewards}`;
        } else {
          var finalizedReward = commonFunctions
            .capitalizeRewards(translatedName)
            .join(" ");
        }
      } else if (itemsPath !== undefined) {
        //Check for rewards stored under "items"
        var reward = itemsPath[0];
        var translatedName = rewardsData[reward.toLowerCase()].value;
        var finalizedReward = commonFunctions
          .capitalizeRewards(translatedName)
          .join(" ");
      } else if (
        //Check for credits-only alerts (weed them out)
        countedPath === undefined &&
        itemsPath === undefined &&
        creditsPath !== undefined
      ) {
        return null;
      } else {
        //Avoid error if new reward type is added
        var finalizedReward = "Reward Not Found";
      }
      //Rest of alert data is the same, regardless of reward type

      //Avoid error if new mission type is added
      if (missionData[dir["MissionInfo.missionType"]] !== undefined) {
        var mishType = missionData[dir["MissionInfo.missionType"]].value;
      } else {
        var mishType = "Mission Not Found";
      }
      //Avoid error if new node is added
      if (nodeData[dir["MissionInfo.location"]] !== undefined) {
        var mishLocation = nodeData[dir["MissionInfo.location"]].value;
      } else {
        mishLocation = "Location Not Found";
      }
      //
      if (status === "DM") {
        var temp = dmRewards.recordMissionIDs(dir, translatedName);
        userList.push(temp);
      }
      return {
        name: `${finalizedReward} (${humanReadableTime})`,
        value: `${credits} credits - ${mishType} - ${mishLocation}`
      };
    }) //Remove any empty elements (ie: any skipped alerts, like credits-only)
    .filter(function(empty) {
      return empty !== null;
    });
  if (status === "DM") {
    var output = dmRewards.deleteMissionsNoOneWants(userList, embed);
    if (output.length > 0) {
      return output;
    }
  }
  return [embed];
}

module.exports = function(callback) {
  getAlertData(callback);
};
