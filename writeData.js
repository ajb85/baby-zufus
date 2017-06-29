var fs = require("fs");
//Update user tracking sheet with how many times a user has called a command
function updateUsage(key, value, fileName) {
  var file = require(fileName);
  if (file[key] === undefined) {
    file = Object.assign(file, { [key]: { [value]: 1 } });
  } else if (file[key][value] === undefined) {
    file[key] = Object.assign(file[key], { [value]: 1 });
  } else {
    file[key][value] += 1;
  }
  writeData(file, fileName);
}
//Add or remove userIDs to reward type so they can be notified of a mission they are interested in
function recordReward(key, value, fileName, status, callback) {
  var file = require(fileName);
  for (i = 0; i < key[0].length; i++) {
    if (status === "add") {
      if (file[key[0][i]] === undefined) {
        file[key[0][i]] = [value];
      } else if (file[key[0][i]].indexOf(value) < 0) {
        file[key[0][i]].push(value);
      }
    } else {
      if (file[key[0][i]].indexOf(value) !== -1) {
        file[key[0][i]].splice(file[key[0][i]].indexOf(value), 1);
      }
    }
  }
  if (callback !== undefined) {
    callback(file, key, value);
  }

  writeData(file, fileName);
}

function writeData(file, fileName) {
  fs.writeFile(fileName, JSON.stringify(file), "utf8", err => {
    if (err) throw err;
  });
}
module.exports = function(key, value, fileName, status, callback) {
  status === "ut"
    ? updateUsage(key, value, fileName)
    : recordReward(key, value, fileName, status, callback);
};
