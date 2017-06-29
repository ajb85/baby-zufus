var request = require("request");
var dottie = require("dottie");

function rawData(callback, setDataType, outputFormat) {
  request(
    "http://content.warframe.com/dynamic/worldState.php",
    { json: true },
    function(error, response, body) {
      if (error) {
        console.log("error:", error);
      }
      try {
        var dataOfInterest = setDataType(body);
        var dataMap = rawMap(dataOfInterest);
        var formattedOutput = outputFormat(dataMap);

        callback(formattedOutput);
      } catch (err) {
        console.log("'try' Error:", err);
      }
    }
  );
}

function rawMap(dataOfInterest) {
  var dataMap = [mappinZeData(dataOfInterest[0], dataOfInterest[1])];
  if (dataOfInterest[2] !== undefined) {
    dataMap.push(dataOfInterest[2]);
  }
  return dataMap;
}

function mappinZeData(source, key) {
  return source.map(function(val) {
    return key
      .map(function(keyName) {
        return { [keyName]: dottie.get(val, keyName) };
      })
      .reduce(function(accum, currentVal) {
        return Object.assign(accum, currentVal);
      });
  });
}

function rawDataTranslate(formattedOutput) {
  return formattedOutput;
}

module.exports = function(callback, setDataType, outputFormat) {
  rawData(callback, setDataType, outputFormat);
};
