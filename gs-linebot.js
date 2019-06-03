var userProperties = PropertiesService.getUserProperties();

function doGet(e){
  var temperature = e.parameter.t;
  if (!temperature) {
    return;
  }

  var nowDatetime = new Date().toLocaleString();
  userProperties.setProperty('temperatureText', nowDatetime  + "���ū׬O " + temperature + " ��");
  
  var returnText = temperature + " OK";
  var textOutput = ContentService.createTextOutput(returnText)
  return textOutput;
}

function doPost(e) {
  var msg = JSON.parse(e.postData.contents);

  // ���X replayToken �M�ϥΪ̰e�X���T����r
  var replyToken = msg.events[0].replyToken;
  var userMessage = msg.events[0].message.text;

  if (typeof replyToken === 'undefined') {
    return;
  }

  if (typeof keyWords === 'undefined') {
    var keyWords = ["�줽�Ƿū�", "�줽�ǴX��", "�줽�Ǽ�����"];
  }
  else {
    keyWords = keyWords.concat(["�줽�Ƿū�", "�줽�ǴX��", "�줽�Ǽ�����"]);
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
      returnText = "��p�ڵL�k���o�ū�";
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
    "MARK1�ܰ������z�A��",

  ];
  
  if (typeof misunderstandWords === 'undefined') {
    var misunderstandWords = _misunderstandWords;
  }
  else {
    misunderstandWords = misunderstandWords.concat(_misunderstandWords);
  }
  
  return misunderstandWords[Math.floor(Math.random()*misunderstandWords.length)];
}