var request = require("request");

function rawData(callback, setDataType) {
  request(
    "http://content.warframe.com/dynamic/worldState.php",
    { json: true },
    function(error, response, body) {
      var dataOfInterest = setDataType(body);
      callback(rawMap(dataOfInterest, body));
    }
  );
}

function rawMap(dataOfInterest, body) {
  var dataMap = [
    dataOfInterest[0].map(function(rawDir) {
      return dataOfInterest[1]
        .map(function(keyName) {
          return { [keyName]: rawDir[keyName] };
        })
        .reduce(function(accum, currentVal) {
          return Object.assign(accum, currentVal);
        });
    })
  ];
  dataMap.unshift(dataOfInterest[2]);
  return dataMap;
}

module.exports = function(callback, setDataType) {
  rawData(callback, setDataType);
};
