//Outside functions and packages
const writeData = require("./writeData.js");
const usageTrack = require("./usageDB.json");
const fs = require("fs");
const rOI = require("./rewardsOfInterest.json");
const worldStateData = require("warframe-worldstate-data");
const rewardsData = worldStateData.languages;
//Snowflakes
const zufusID = "189546691475668992";
const papaInterro = "92717477225598976";
const zufusLog = "190723198650679297";

function zufusTalk(zufus, msg) {
  //Still undecided where Zufus will speak, so channel is subject to change
  const channel = zufus.channels.find("id", zufusLog);

  if (msg.author.equals(zufus.user)) {
    return false;
  }
  if (msg.content === "ping") {
    msg.author.send("Pong!");
    writeData(msg.author.username, "ping", "./usageDB.json", "ut");
    //Sneaky Sneaky
  } else if (msg.content.toLowerCase() === "sneaky sneaky") {
    console.log(msg.author.username, "looking for da sneaks");
    var sneaks = Math.floor(Math.random() * 10 + 1);
    var plural = sneaks > 1 ? "sneaks" : "sneak";
    msg.channel.send("Sniffing out any sneaky sneaks...");
    setTimeout(function() {
      msg.channel.send(`I found ${sneaks} sneaky ${plural}.`);
    }, 2500);
    writeData(msg.author.username, "sneaks", "./usageDB.json", "ut");
  } else if (msg.content.toLowerCase() === "planned features") {
    msg.channel.send(
      "1. Pre-built watchlists that will add/remove items automatically.\n2. `remove all` command for watchlists.\n3. Help menu to list Zufus commands.\n4.Tidy up `add`, `remove`, and alert notification chat.\n5. Clean up 'zufusTalk' file"
    );
  } else if (msg.isMentioned(zufusID) && msg.content.search("raid") >= 0) {
    // Zufus Sass
    console.log(msg.author.username, "trying to raid");
    msg.channel.send("no u");
    writeData(msg.author.username, "raids", "./usageDB.json", "ut");
  } else if (msg.isMentioned(zufusID) && msg.isMentioned(papaInterro)) {
    console.log(msg.author.username, "checking da papas");
    msg.channel.send("papa?");
    writeData(msg.author.username, "papa", "./usageDB.json", "ut");
  } else if (msg.content.toLowerCase() === "usage tracking") {
    console.log(msg.author.username, "looking at the tracks");
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
      //.replace(/./g, "")
      .split(" ")
      .filter(function(empty) {
        return empty != "";
      });
    if (strArr[1] === "add" || strArr[1] === "remove") {
      console.log(msg.author.username, "is altering their watchlist");
      var inputs = correctStrings(userCommands.rewards, strArr);

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
      console.log(
        msg.author.username,
        "checking what can be added to watchlist."
      );
      var watchlistItems = userCommands.rewards.map(function(rewardItem) {
        return capitalizeRewards(rewardItem);
      });
      watchlistSpeakLimit(msg, watchlistItems);
      writeData(msg.author.username, "watchlist", "./usageDB.json", "ut");
    } else if (strArr[1].toLowerCase() === "track") {
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
        console.log(msg.author.username, "adding things for watchlists");
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
      console.log(msg.author.username, "is drunk.");
      msg.author.send(`Sorry, I don't know command ${strArr[1]}`);
    }
  }
}
function watchlistSpeakLimit(msg, watchlistItems) {
  watchlistItems = watchlistItems.sort();
  var i = 0;
  var smallerMessage = [];
  while (i < watchlistItems.length) {
    var messageLimit = 50;
    smallerMessage.push(watchlistItems[i]);
    if ((i + 1) % messageLimit === 0) {
      msg.author.send(smallerMessage.join("\n"));
      smallerMessage = [];
    }
    i += 1;
  }
}

function correctStrings(key, inputSplit) {
  var words = [];
  var endCount = 0;
  var startCount = 0;
  const keySplit = createKeySplit();

  while (endCount < inputSplit.length) {
    if (
      //If the word is in the key but the word + next word is not
      key.indexOf(inputSplit[endCount]) >= 0 &&
      key.indexOf(inputSplit[endCount] + " " + inputSplit[endCount + 1]) < 0
    ) {
      words.push(inputSplit[endCount]);
      endCount += 1;
      startCount = endCount;
    } else if (
      //Word isn't a "key" match, so it checks keySplit
      keySplit.indexOf(inputSplit[endCount]) >= 0
    ) {
      //If the word is a substring of a "key" phrase, lookForEndOfString will
      //will look forward to see if future words combine to make a "key" phrase
      //The index is returned, those words sliced and pushed into "words" array
      endCount = lookForEndOfString();
      if (key.indexOf(inputSplit.slice(startCount, endCount).join(" ")) >= 0) {
        words.push(inputSplit.slice(startCount, endCount).join(" "));
      }
      startCount = endCount;
    } else {
      //Any other condition (ie: word not recognized)
      endCount += 1;
      startCount = endCount;
    }
  }
  function createKeySplit() {
    //Creates an array of all strings and substrings Zufus needs to be able to
    //catch.  So Orokin Catalyst Blueprint will yield two entries:
    //Orokin & Orokin Catalyst
    var i = 0;
    var keySplit = [];
    while (i < key.length) {
      j = 0;
      var keyIndex = key[i].split(" ");
      while (j < keyIndex.length) {
        if (keySplit.indexOf(keyIndex[j]) < 0) {
          keySplit.push(keyIndex[j]);
        }
        //3+ words are hard for Zufus to recognize because 1-word elements
        //are easily caught by the .split and 2-word elements easily match
        //as a "key" phrase.  But when 2 words are found in a 3-word key phrase
        //it needs something to compare against, so this code will also create
        //any pairing of 3+ words as a stepping stone for Zufus to compare as
        //he builds words up to the "key" phrase
        var wordPairs = keyIndex.slice(0, j).join(" ");
        if (wordPairs.length > 0 && keySplit.indexOf(wordPairs) < 0) {
          keySplit.push(wordPairs);
        }
        j += 1;
      }
      i += 1;
    }
    return keySplit;
  }
  function lookForEndOfString() {
    var currentWord = inputSplit[endCount];

    while (endCount < inputSplit.length) {
      var nextWord = currentWord + " " + inputSplit[endCount + 1];
      if (key.indexOf(currentWord) >= 0 && key.indexOf(nextWord) < 0) {
        return endCount + 1;
      } else if (
        keySplit.indexOf(nextWord) >= 0 ||
        key.indexOf(nextWord) >= 0
      ) {
        currentWord = nextWord;
        endCount += 1;
      } else {
        return endCount + 1;
      }
    }
    return endCount + 1;
  }
  return [words, []];
}

function userRewardTracking(obj, badInput, userID) {
  var userIsTracking = [];
  for (var prop in obj) {
    if (obj[prop].indexOf(userID) >= 0) {
      userIsTracking.push(`${capitalizeRewards(prop)}`);
    }
  }
  formatOutput(userIsTracking, badInput);
}
function formatOutput(userInput, badInput, obj) {
  var outputStrings = [];
  if (userInput.length > 0) {
    outputStrings.push(
      `Your watchlist is now:\n${userInput.sort().join("\n")}`
    );
  } else {
    outputStrings.push("You have nothing in your watchlist.");
  }
  if (badInput[1].length > 0) {
    /*outputStrings.push(
      `But you also wrote "${badInput[1]
        .slice(0, badInput[1].length)
        .join(" ")}" which is gibberish and you should feel bad for that.`
    );*/
  }
  badInput[2].author.send(outputStrings.join(" "));
}
function capitalizeRewards(reward) {
  var split = reward.toLowerCase().split(" ");
  var output = [];
  for (i = 0; i < split.length; i++) {
    output.push(split[i][0].toUpperCase() + split[i].slice(1, split[i].length));
  }
  return output.join(" ");
}

module.exports = function(zufus, msg) {
  zufusTalk(zufus, msg);
};
