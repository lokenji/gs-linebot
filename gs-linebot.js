var userProperties = PropertiesService.getUserProperties();

function doGet(e){
  var temperature = e.parameter.t;
  if (!temperature) {
    return;
  }

  var nowDatetime = new Date().toLocaleString();
  userProperties.setProperty('temperatureText', nowDatetime  + "放琌 " + temperature + " ");
  
  var returnText = temperature + " OK";
  var textOutput = ContentService.createTextOutput(returnText)
  return textOutput;
}

function doPost(e) {
  var msg = JSON.parse(e.postData.contents);

  //  replayToken ㎝ㄏノ癳癟ゅ
  var replyToken = msg.events[0].replyToken;
  var userMessage = msg.events[0].message.text;

  if (typeof replyToken === 'undefined') {
    return;
  }

  if (typeof keyWords === 'undefined') {
    var keyWords = ["快そ放", "快そ碭", "快そ荐ぃ荐"];
  }
  else {
    keyWords = keyWords.concat(["快そ放", "快そ碭", "快そ荐ぃ荐"]);
  }
  
  var returnText;
  var hasKeyword = false;
  
  if (userMessage) {
    for (var i = 0; i < keyWords.length; i++) {
      if (userMessage.indexOf(keyWords[i]) !== -1) {
        hasKeyword = true;
        break;
      }
    }
  }
  
  if (hasKeyword) {
    var temperatureText = userProperties.getProperty('temperatureText');
    if (temperatureText) {
      returnText =  temperatureText;
    }
    else {
      returnText = "╆簆и礚猭眔放";
    }
  }
  else {
    returnText = getMisunderstandWords();
  }
  
  var url = 'https://api.line.me/v2/bot/message/reply';
  UrlFetchApp.fetch(url, {
      'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + accessToken.trim(),
    },
    'method': 'post',
    'payload': JSON.stringify({
      'replyToken': replyToken,
      'messages': [{
        'type': 'text',
        'text': returnText,
      }],
    }),
  });
}


function getMisunderstandWords() {
  var _misunderstandWords = [
    "MARK1蔼砍眤狝叭",

  ];
  
  if (typeof misunderstandWords === 'undefined') {
    var misunderstandWords = _misunderstandWords;
  }
  else {
    misunderstandWords = misunderstandWords.concat(_misunderstandWords);
  }
  
  return misunderstandWords[Math.floor(Math.random()*misunderstandWords.length)];
}