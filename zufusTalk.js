const writeData = require("./writeData.js");
const usageTrack = require("./usageDB.json");
const zufusSpam = "325944060135342090";
const channel = zufus.channels.find("id", zufusSpam);
const fs = require("fs");

function updateAlerts() {}

function oneOrTwoWords(strArr, userCommands) {
  var userInput = [];
  var badInput = [];
  for (i = 2; i < strArr.length - 1; i++) {
    if (
      userCommands.rewards.indexOf(strArr[i].concat(" " + strArr[i + 1])) >= 0
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
      `But you also wrote "${badInput[1]
        .slice(0, badInput[1].length)
        .join(" ")}" which is gibberish and you should feel bad for that.`
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
