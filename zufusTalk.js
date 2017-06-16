var recordUsage = require("./writeData.js");
var usageTrack = require("./database.json");

module.exports = function(zufus, msg) {
  var zufusID = "189546691475668992";
  var papaInterro = "92717477225598976";
  var zufuslog = "190723198650679297";
  if (msg.author.equals(zufus.user)) {
    return false;
  }
  if (msg.content === "ping") {
    msg.channel.send("Pong!");
    recordUsage(msg.author.username, "ping");
    //Sneaky Sneaky
  } else if (msg.content.toLowerCase() === "sneaky sneaky") {
    var sneaks = Math.floor(Math.random() * 10 + 1);
    var plural = sneaks > 1 ? "sneaks" : "sneak";
    msg.channel.send("Sniffing out any sneaky sneaks...");
    setTimeout(function() {
      msg.channel.send(`I found ${sneaks} sneaky ${plural}.`);
    }, 2500);
    recordUsage(msg.author.username, "sneaks");
    // World State Data
  } else if (msg.content.toLowerCase() === "sortie") {
    var sortie = require("./sortieData.js");
    sortie(function(giantString) {
      msg.channel.send(giantString);
      recordUsage(msg.author.username, "sortie");
    });
  } else if (
    msg.content.toLowerCase() === "alerts" ||
    msg.content.toLowerCase() === "alert"
  ) {
    var alerts = require("./alertsData.js");
    alerts(function(giantString, status) {
      msg.channel.send(giantString);
      recordUsage(msg.author.username, "alerts");
    }, "user request");
  } else if (
    msg.content.toLowerCase() === "invasions" ||
    msg.content.toLowerCase() === "invasion"
  ) {
    var invasions = require("./invasionsData.js");
    invasions(function(giantString, status) {
      msg.channel.send(giantString);
      recordUsage(msg.author.username, "invasions");
    }, "user request");
  } else if (
    msg.content.toLowerCase() === "fissure" ||
    msg.content.toLowerCase() === "fissures"
  ) {
    var fissures = require("./fissuresData.js");
    fissures(function(giantString) {
      msg.channel.send(giantString);
      recordUsage(msg.author.username, "fissures");
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
      recordUsage(msg.author.username, "updates");
    });
  } else if (msg.isMentioned(zufusID) && msg.content.search("raid") > 0) {
    // Zufus Sass
    msg.channel.send("no u");
    recordUsage(msg.author.username, "raids");
  } else if (msg.isMentioned(zufusID) && msg.isMentioned(papaInterro)) {
    msg.channel.send("papa?");
    recordUsage(msg.author.username, "papa");
  } else if (msg.content.toLowerCase() === "usage tracking") {
    var names = Object.keys(usageTrack);
    var namesKeys = Object.keys(names);
    var namesValues = Object.values(names);
    var output = [];
    names.map(function(x) {
      output.push(`${x} has used the following commands:\n`);
      output.push(`${JSON.stringify(usageTrack[x])}\n`);
    });
    msg.channel.send(output.join(""));
  }
};
