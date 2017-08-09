const rOI = require("./rewardsOfInterest.json");
const rewardsDB = require("./rewardsDB.json");
const uniqueID = require("./rewardIDDB.json");
const fs = require("fs");

exports.findMatches = function(dataMap) {
  var rewardPath = "MissionInfo.missionReward";
  var matches = rOI[0]
    .map(function(rewards) {
      return dataMap[0].filter(function(currentMissions) {
        if (
          (currentMissions[rewardPath].countedItems !== undefined &&
            currentMissions[
              rewardPath
            ].countedItems[0].ItemType.toLowerCase() ===
              rewards.toLowerCase()) ||
          (currentMissions[rewardPath].items != undefined &&
            currentMissions[rewardPath].items[0].toLowerCase() ===
              rewards.toLowerCase())
        ) {
          return currentMissions;
        }
      });
    })
    .filter(function(empty) {
      return empty != "";
    });
  return matches;
};

exports.combineAllMatches = function(matches) {
  if (matches.length !== 0) {
    return matches.reduce(function(accum, currentVal) {
      return accum.concat(currentVal);
    });
  }
};

function fetchDMdUsers(mission, userList) {
  var id = mission["_id.$oid"];
  var output = [];
  userList.forEach(function(userID) {
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

function idRecord() {
  fs.writeFile("./rewardIDDB.json", JSON.stringify(uniqueID), "utf8", err => {
    if (err) throw err;
  });
}

exports.recordMissionIDs = function(dataMap, translatedName) {
  var interestedUsers = rewardsDB[translatedName.toLowerCase()];
  if (interestedUsers !== undefined && interestedUsers.length > 0) {
    var DMdUsers = fetchDMdUsers(dataMap, interestedUsers);
    var userList = interestedUsers.filter(function(id) {
      return DMdUsers.indexOf(id) < 0;
    });
    idRecord();
    return userList;
  }
};

exports.deleteMissionsNoOneWants = function(userList, missions) {
  userList.forEach(function(x, i) {
    if (x === undefined) {
      missions.splice(i, 1);
      userList.splice(i, 1);
    }
  });
  return [missions, userList];
};
