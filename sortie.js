var request = require('request');
var worldstateData = require('warframe-worldstate-data');

var missionTypesRaw = worldstateData.missionTypes;
var sortieDataRaw = worldstateData.sortie;
var missionTypes = JSON.parse(missionTypesRaw);
var sortieData = JSON.parse(sortieDataRaw);

request('http://content.warframe.com/dynamic/worldState.php', {json: true}, function (error, response, body) {
  console.log('error:', error); // Print the error if one occurred
  var boss = body.Sorties[0].Boss;
  var mish1 = [body.Sorties[0].Variants[0].missionType, body.Sorties[0].Variants[0].modifierType];
  var mish2 = [body.Sorties[0].Variants[1].missionType, body.Sorties[0].Variants[1].modifierType];
  var mish3 = [body.Sorties[0].Variants[2].missionType, body.Sorties[0].Variants[2].modifierType];
  callbackData = [mish1, mish2, mish3, boss];
  sortieTranslate(callbackData);
});

function sortieTranslate(garbled){
  console.log();
  console.log("This was written using JavaScript");
  console.log();
  console.log("First mision:", missionTypes[garbled[0][0]]["value"], "with", sortieData["modifierTypes"][garbled[0][1]]);
  console.log("Second mission:",missionTypes[garbled[1][0]]["value"], "with", sortieData["modifierTypes"][garbled[1][1]]);
  console.log("Third mission:",missionTypes[garbled[2][0]]["value"], "with", sortieData["modifierTypes"][garbled[2][1]]);
  console.log("Sortie boss:",sortieData["bosses"][garbled[3]]["name"]);
}
