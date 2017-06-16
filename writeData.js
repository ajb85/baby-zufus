var fs = require("fs");
//var myJson = { Shamshire: { update: 1, sortie: 2, alerts: 2 } };
var reqJSON = require("./database.json");
function updateUsage(name, command) {
  if (reqJSON[name] === undefined) {
    reqJSON[name] = { [command]: 1 };
  } else if (reqJSON[name][command] === undefined) {
    reqJSON[name][command] = 1;
  } else {
    reqJSON[name][command] += 1;
  }
  writeData(reqJSON);
}
function writeData(data) {
  fs.writeFile("database.json", JSON.stringify(data), "utf8", err => {
    if (err) throw err;
    console.log("File has been saved");
  });
}
module.exports = function(name, command) {
  updateUsage(name, command);
};
