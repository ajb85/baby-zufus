var worldStateData = require("warframe-worldstate-data");
var missionTypes = worldStateData.missionTypes;
var sortieData = worldStateData.sortie;
var nodeData = worldStateData.solNodes;

function getSortieData(callback) {
  var body = require("./wfWorldStateData.js");
  testVar = "test";
  body(function(rawData, dataOfInterest) {
    callback(rawData);
  }, setDataType);
}

function rawDataTranslate(dataMap) {
  var output = outputFormat(dataMap);
  return output.join("");
}

function outputFormat(dataMap) {
  var output = dataMap[1].map(function(dir) {
    return `  ${missionTypes[dir.missionType]["value"]} (${sortieData["modifierTypes"][dir.modifierType]}) -- *${nodeData[dir.node]["value"]}*\n`;
  });
  output.unshift(`**${sortieData["bosses"][dataMap[0]]["name"]} Sortie**\n`);
  return output;
}

function setDataType(rawData) {
  var dataOfInterest = [];
  dataOfInterest = [
    rawData.Sorties[0].Variants,
    ["missionType", "modifierType", "node"],
    rawData.Sorties[0].Boss
  ];
  return dataOfInterest;
}

module.exports = function(callback) {
  getSortieData(function(dataMap) {
    callback(rawDataTranslate(dataMap));
  });
};
