var worldStateData = require("warframe-worldstate-data");
var missionTypes = worldStateData.missionTypes;
var sortieData = worldStateData.sortie;
var nodeData = worldStateData.solNodes;

function getSortieData(callback) {
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
    rawData.Sorties[0].Variants,
    ["missionType", "modifierType", "node"],
    rawData.Sorties[0].Boss
  ];
  return dataOfInterest;
}

function outputFormat(dataMap) {
  var embedObject = dataMap[0].map(function(dir) {
    return {
      name: `${missionTypes[dir.missionType].value}`,
      value: `${sortieData.modifierTypes[dir.modifierType]}`
    };
  });
  var output = {
    embed: {
      color: 3447003,
      author: {
        name: `${sortieData.bosses[dataMap[1]].name} Sortie`,
        icon_url:
          "http://images2.wikia.nocookie.net/warframe/images/2/2d/HunterBadge.png"
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

module.exports = function(callback) {
  getSortieData(callback);
};

/*WORKING outputFormat !!!!!!!!!!!!
function outputFormat(dataMap) {
  var output = dataMap[0].map(function(dir) {
    return `  ${missionTypes[
      dir.missionType
    ].value} (${sortieData.modifierTypes[dir.modifierType]}) -- *${nodeData[dir.node].value}*\n`;
  });
  output.unshift(`**${sortieData.bosses[dataMap[1]].name} Sortie**\n`);
  return output;
}*/
