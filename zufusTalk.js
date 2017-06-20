var writeData = require("./writeData.js");
var usageTrack = require("./usageDB.json");
var rOI = require("./rewardsOfInterest.json");
var worldStateData = require("warframe-worldstate-data");
var rewardsData = worldStateData.languages;
var fs = require("fs");

function oneOrTwoWords(strArr, userCommands) {
  var userInput = [];
  var badInput = [];
  for (i = 2; i < strArr.length; i++) {
    if (
      (strArr[i] === "kubrow" && strArr[i + 1] == "egg") ||
      (strArr[i] === "reactor" && strArr[i + 1] == "bp") ||
      (strArr[i] === "catalyst" && strArr[i + 1] == "bp")
    ) {
      var twoWord = strArr.slice(i, i + 2);
      userInput.indexOf(twoWord.join(" ")) < 0
        ? userInput.push(twoWord.join(" "))
        : void 0;
      i += 1;
    } else if (userCommands.rewards.indexOf(strArr[i]) >= 0) {
      userInput.indexOf(strArr[i]) < 0 ? userInput.push(strArr[i]) : void 0;
    } else {
      badInput.push(strArr[i]);
    }
  }
  return [userInput, badInput];
}
function userRewardTracking(obj, badInput, userID) {
  var userIsTracking = [];
  for (var prop in obj) {
    if (obj[prop].indexOf(userID) >= 0) {
      userIsTracking.push(`**${prop}**`);
    }
  }
  formatOutput(userIsTracking, badInput);
}
function formatOutput(userInput, badInput, obj) {
  var outputStrings = [];
  if (userInput.length > 0) {
    outputStrings.push(`Your watchlist is now: ${userInput.join(", ")}.`);
  } else {
    outputStrings.push("You have nothing in your watchlist now.");
  }
  if (badInput[1].length > 0) {
    outputStrings.push(
      `But you also wrote "${badInput[1].slice(
        0,
        badInput[1].length
      )}" which is gibberish and you should feel bad for that.`
    );
  }
  badInput[2].channel.send(outputStrings.join(" "));
}

module.exports = function(zufus, msg) {
  var zufusID = "189546691475668992";
  var papaInterro = "92717477225598976";
  if (msg.author.equals(zufus.user)) {
    return false;
  }
  if (msg.content === "ping") {
    msg.channel.send("Pong!");
    writeData(msg.author.username, "ping", "./usageDB.json", "ut");
    //Sneaky Sneaky
  } else if (msg.content.toLowerCase() === "sneaky sneaky") {
    var sneaks = Math.floor(Math.random() * 10 + 1);
    var plural = sneaks > 1 ? "sneaks" : "sneak";
    msg.channel.send("Sniffing out any sneaky sneaks...");
    setTimeout(function() {
      msg.channel.send(`I found ${sneaks} sneaky ${plural}.`);
    }, 2500);
    writeData(msg.author.username, "sneaks", "./usageDB.json", "ut");
    // World State Data
  } else if (msg.content.toLowerCase() === "sortie") {
    var sortie = require("./sortieData.js");
    sortie(function(giantString) {
      msg.channel.send(giantString);
      writeData(msg.author.username, "sortie", "./usageDB.json", "ut");
    });
  } else if (
    msg.content.toLowerCase() === "alerts" ||
    msg.content.toLowerCase() === "alert"
  ) {
    var alerts = require("./alertsData.js");
    alerts(function(giantString, status) {
      msg.channel.send(giantString);
      writeData(msg.author.username, "alerts", "./usageDB.json", "ut");
    }, "user request");
  } else if (
    msg.content.toLowerCase() === "invasions" ||
    msg.content.toLowerCase() === "invasion"
  ) {
    var invasions = require("./invasionsData.js");
    invasions(function(giantString, status) {
      msg.channel.send(giantString);
      writeData(msg.author.username, "invasions", "./usageDB.json", "ut");
    }, "user request");
  } else if (
    msg.content.toLowerCase() === "fissure" ||
    msg.content.toLowerCase() === "fissures"
  ) {
    var fissures = require("./fissuresData.js");
    fissures(function(giantString) {
      msg.channel.send(giantString);
      writeData(msg.author.username, "fissures", "./usageDB.json", "ut");
    });
  } else if (msg.content.toLowerCase() === "update") {
    var sortie = require("./sortieData.js");
    var alerts = require("./alertsData.js");
    var invasions = require("./invasionsData.js");
    var fissures = require("./fissuresData.js");
    alerts(function(giantString) {
      msg.channel.send(giantString);
    });
    invasions(function(giantString) {
      msg.channel.send(giantString);
    });
    sortie(function(giantString) {
      msg.channel.send(giantString);
    });
    fissures(function(giantString) {
      msg.channel.send(giantString);
      writeData(msg.author.username, "updates", "./usageDB.json", "ut");
    });
  } else if (msg.isMentioned(zufusID) && msg.content.search("raid") > 0) {
    // Zufus Sass
    msg.channel.send("no u");
    writeData(msg.author.username, "raids", "./usageDB.json", "ut");
  } else if (msg.isMentioned(zufusID) && msg.isMentioned(papaInterro)) {
    msg.channel.send("papa?");
    writeData(msg.author.username, "papa", "./usageDB.json", "ut");
  } else if (msg.content.toLowerCase() === "usage tracking") {
    var names = Object.keys(usageTrack);
    var namesKeys = Object.keys(names);
    var namesValues = Object.values(names);
    var rewardsTracked = require("./rewardsDB.json");
    var output = [];
    names.map(function(x) {
      output.push(`${x} has used the following commands:\n`);
      output.push(`${JSON.stringify(usageTrack[x])}\n`);
    });
    writeData(msg.author.username, "tracking", "./usageDB.json", "ut");
    msg.channel.send(output.join(""));
  } else if (
    msg.content
      .toLowerCase()
      .replace(/,/g, "")
      .split(" ")
      .filter(function(empty) {
        return empty != "";
      })[0] === "zufus"
  ) {
    rOILowerCase = rOI[1].map(function(capitalized) {
      return capitalized.toLowerCase();
    });
    var userCommands = {
      rewards: rOILowerCase
    };
    var strArr = msg.content
      .toLowerCase()
      .replace(/,/g, "")
      .split(" ")
      .filter(function(empty) {
        return empty != "";
      });
    if (strArr[1] === "add" || strArr[1] === "remove") {
      var inputs = oneOrTwoWords(strArr, userCommands);
      inputs.push(msg);
      writeData(msg.author.username, "recordRewards", "./usageDB.json", "ut");
      writeData(
        inputs,
        `${msg.author.id}`,
        "./rewardsDB.json",
        strArr[1],
        userRewardTracking
      );
    } else if (strArr[1].toLowerCase() === "watchlist") {
      var watchlistItems = rOI[1];
      msg.channel.send(
        "I can track the following items:\n" + watchlistItems.join(", ")
      );
    } else if (strArr[1].toLowerCase() === "track") {
      // Compare input word to WFWS data.  If false, return error.  If true, push entry to rOI
      /*var multiword = [];
      for (i = 2; i < strArr.length; i++) {
        multiword.push(strArr[i]);
      }
      multiword = multiword.join(" ");*/
      strArr = msg.content
        .replace(/,/g, "")
        .replace(/"/g, "")
        .split(" ")
        .filter(function(empty) {
          return empty != "";
        });
      if (rewardsData[strArr[2]] === undefined) {
        msg.channel.send(
          `Sorry, I can't find that reward.  Please make sure you've typed it correctly.`
        );
      } else {
        msg.channel.send(
          "I'll start tracking that now, feel free to add it to your watchlist."
        );
        rOI[0].push(strArr[2]);
        rOI[1].push(rewardsData[strArr[2]].value);
        fs.writeFile(
          "./rewardsOfInterest.json",
          JSON.stringify(rOI),
          "utf8",
          err => {
            if (err) throw err;
          }
        );
      }
    } else {
      msg.channel.send(`Sorry, I don't know command ${strArr[1]}`);
    }
  }
};
