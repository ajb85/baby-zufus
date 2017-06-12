var worldStateData = require("warframe-worldstate-data");
var missionTypes = worldStateData.missionTypes;
var sortieData = worldStateData.sortie;
var nodeData = worldStateData.solNodes;

function getSortieData(callback) {
  var body = require("./wfWorldStateData.js");
  body(
    function(rawData, dataOfInterest, output) {
      callback(rawData);
    },
    setDataType,
    outputFormat
  );
}

function setDataType(rawData) {
  var dataOfInterest = [
    rawData.Sorties[0].Variants,
    ["missionType", "modifierType", "node"],
    rawData.Sorties[0].Boss
  ];
  return dataOfInterest;
}

function outputFormat(dataMap) {
  var output = dataMap[0].map(function(dir) {
    return `  __${missionTypes[dir.missionType].value}__ (${sortieData.modifierTypes[dir.modifierType]}) -- *${nodeData[dir.node].value}*\n`;
  });
  output.unshift(`**${sortieData.bosses[dataMap[1]].name} Sortie**\n`);
  return output;
}

module.exports = function(callback) {
  getSortieData(callback);
};
