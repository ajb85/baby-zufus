var worldStateData = require("warframe-worldstate-data");
var request = require("request");

//var missionTypesRaw = fs.readFileSync("missionTypes.json");
//var sortieDataRaw = fs.readFileSync("sortieData.json");
//var missionTypes = JSON.parse(missionTypesRaw);
//var sortieData = JSON.parse(sortieDataRaw);
var missionTypes = worldStateData.missionTypes;
var sortieData = worldStateData.sortie;
var nodeData = worldStateData.solNodes;

function rawSortieData(callBack) {
  request(
    "http://content.warframe.com/dynamic/worldState.php",
    { json: true },
    function(error, response, body) {
      console.log("error:", error);
      var alerts = body.Sorties[0].Variants.map(function(dir) {
        return {
          missionType: dir.missionType,
          modifierType: dir.modifierType,
          node: dir.node
        };
      });
      var boss = body.Sorties[0].Boss;
      callbackData = [alerts, boss];
      callBack(callbackData);
    }
  );
}

function sortieTranslate(rawData) {
  return `**${sortieData["bosses"][rawData[1]]["name"]} Sortie**
  __${missionTypes[rawData[0][0].missionType]["value"]} (${sortieData["modifierTypes"][rawData[0][0].modifierType]})__ ${nodeData[rawData[0][0].node]["value"]}
  __${missionTypes[rawData[0][1].missionType]["value"]} (${sortieData["modifierTypes"][rawData[0][1].modifierType]})__ ${nodeData[rawData[0][1].node]["value"]}
  __${missionTypes[rawData[0][2].missionType]["value"]} (${sortieData["modifierTypes"][rawData[0][2].modifierType]})__ ${nodeData[rawData[0][2].node]["value"]}`;
}
module.exports = function(callback) {
  rawSortieData(function(rawData) {
    callback(sortieTranslate(rawData));
  });
};
