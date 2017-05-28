var fs = require("fs");
var request = require("request");

var missionTypesRaw = fs.readFileSync("missionTypes.json");
var sortieDataRaw = fs.readFileSync("sortieData.json");
var missionTypes = JSON.parse(missionTypesRaw);
var sortieData = JSON.parse(sortieDataRaw);

function makeRequest(callBack) {
  request(
    "http://content.warframe.com/dynamic/worldState.php",
    { json: true },
    function(error, response, body) {
      console.log("error:", error);
      var boss = body.Sorties[0].Boss;
      var mish1 = [
        body.Sorties[0].Variants[0].missionType,
        body.Sorties[0].Variants[0].modifierType
      ];
      var mish2 = [
        body.Sorties[0].Variants[1].missionType,
        body.Sorties[0].Variants[1].modifierType
      ];
      var mish3 = [
        body.Sorties[0].Variants[2].missionType,
        body.Sorties[0].Variants[2].modifierType
      ];
      callbackData = [mish1, mish2, mish3, boss];
      var giantString = sortieTranslate(callbackData);
      callBack(giantString);
    }
  );
}

function sortieTranslate(garbled) {
  return `First mission: ${missionTypes[garbled[0][0]]["value"]} with ${sortieData["modifierTypes"][garbled[0][1]]}
Second mission: ${missionTypes[garbled[1][0]]["value"]} with ${sortieData["modifierTypes"][garbled[1][1]]}
Third mission: ${missionTypes[garbled[2][0]]["value"]} with ${sortieData["modifierTypes"][garbled[2][1]]}
Sortie boss: ${sortieData["bosses"][garbled[3]]["name"]}`;
}
module.exports = function(callback) {
  makeRequest(callback);
};
