exports.capitalizeRewards = function(reward) {
  //SoMeTIMEs RewaRd Names are Crazy --> Sometimes Reward Names Are Crazy
  var split = reward.toLowerCase().split(" ");
  var output = [];
  for (i = 0; i < split.length; i++) {
    output.push(split[i][0].toUpperCase() + split[i].slice(1, split[i].length));
  }
  return output;
};

exports.convertTimeWithItalics = function(ExpTime) {
  //Convert crazy JavaScript milliseconds into a time humans can read
  var time = [];
  var currentTime = new Date();
  var timeDiff = ExpTime - currentTime;
  if (timeDiff >= 86400000) {
    var days = Math.floor(timeDiff / 1000 / 60 / 60 / 24);
    time.push(`${days}d`);
  }
  if (timeDiff >= 3600000) {
    var hours = Math.round(timeDiff / 1000 / 60 / 60 % 24);
    time.push(`${hours}h`);
  }
  if (timeDiff >= 60000) {
    var minutes = Math.round(timeDiff / 1000 / 60 % 60);
    time.push(`${minutes}m`);
  }
  var seconds = Math.round(timeDiff / 1000) % 60;
  time.push(`${seconds}s`);
  return `*${time.join(" ")}*`;
};

exports.numberWithCommas = function(num) {
  //3000 --> 3,000
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
