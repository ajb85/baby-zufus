var request = require("request");
var dottie = require("dottie");

function rawData(callback, setDataType, outputFormat) {
  request(
    "http://content.warframe.com/dynamic/worldState.php",
    { json: true },
    function(error, response, body) {
      var dataOfInterest = setDataType(body);
      var dataMap = rawMap(dataOfInterest);
      var formattedOutput = outputFormat(dataMap);
      callback(rawDataTranslate(formattedOutput));
    }
  );
}

function rawMap(dataOfInterest) {
  var dataMap = [mappinZeData(dataOfInterest[0], dataOfInterest[1])];
  dataMap.unshift(mappinZeData(dataOfInterest[2], dataOfInterest[3]));
  return dataMap;
}

function mappinZeData(directory, key) {
  return directory.map(function(dir) {
    return key
      .map(function(keyName) {
        return { [keyName]: dottie.get(dir, keyName) };
      })
      .reduce(function(accum, currentVal) {
        return Object.assign(accum, currentVal);
      });
  });
}

function rawDataTranslate(formattedOutput) {
  console.log(formattedOutput);
  return formattedOutput.join("");
}

module.exports = function(callback, setDataType, outputFormat) {
  rawData(callback, setDataType, outputFormat);
};
