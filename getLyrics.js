function postInfo(artist, title, lyric_text, array) {

  var result;
    var data =
        '<?xml version="1.0" encoding="UTF-8"?>\n' +
        '<SOAP-ENV:Envelope\n' +
        'xmlns:SOAP-ENV="http://www.w3.org/2003/05/soap-envelope"\n' +
        'xmlns:SOAP-ENC="http://www.w3.org/2003/05/soap-encoding"\n' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n' +
        'xmlns:xsd="http://www.w3.org/2001/XMLSchema"\n' +
        'xmlns:ns2="ALSongWebServer/Service1Soap"\n' +
        'xmlns:ns1="ALSongWebServer"\n' +
        'xmlns:ns3="ALSongWebServer/Service1Soap12">\n' +
        '<SOAP-ENV:Body>\n' +
        '<ns1:GetResembleLyric2>\n' +
        '<ns1:stQuery>\n' +
        '<ns1:strTitle>\n' +
        title +
        '\n</ns1:strTitle>\n' +
        '<ns1:strArtistName>\n' +
        artist +
        '\n</ns1:strArtistName>\n' +
        '<ns1:nCurPage>\n' +
        '0\n' +
        '</ns1:nCurPage>\n' +
        '</ns1:stQuery>\n' +
        '</ns1:GetResembleLyric2>\n' +
        '</SOAP-ENV:Body></SOAP-ENV:Envelope>';

    var xhr = new XMLHttpRequest();

    xhr.open('POST', "http://lyrics.alsong.co.kr/alsongwebservice/service1.asmx", true);
    xhr.setRequestHeader("Content-type", "text/xml; charset=utf-8");
	//xhr.setRequestHeader("SOAPAction", "ALSongWebServer/GetLyric5");
	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4){
      if(xhr.status == 200){
        //result = parseSOAP(this.responseText);
        result = "";
        var ly = parseLyric(parseSOAP(this.responseText))[0];
        if(ly == "가"){
          result = "가사를 불러올 수 없습니다.";
        } else{
          array = parseLyric(parseSOAP(this.responseText))[1];
          for(i=0; i<ly.length; i++){
            result += ly[i]+"<br/><br/>";
          }
        }
      }
      lyric_text.innerHTML = result;
    }
    return;
	};
  xhr.send(data);
}

function parseSOAP(xs){
	var parser = new DOMParser();
	xmlDoc = parser.parseFromString(xs, "text/xml");
	var xml = xmlDoc.getElementsByTagName('soap:Envelope')[0].getElementsByTagName('soap:Body')[0].getElementsByTagName('GetResembleLyric2Result')[0];
  if(xml.childNodes[0]){
	 lyrics = xml.getElementsByTagName('ST_GET_RESEMBLELYRIC2_RETURN')[0].getElementsByTagName('strLyric')[0].childNodes[0].nodeValue;
   lyric = lyrics.split("<br>");
  }
  else{
    lyric = "가사 정보가 없습니다."
  }
  return lyric;
}

function parseLyric(lyric){
  var ly = new Array();
  var se = new Array();
  if(lyric === "가사 정보가 없습니다."){
    return lyric;
  }
  for(i=0; i<lyric.length; i++){
    if(lyric[i].substring(1,9) != "00:00.00"){
      ly.push(lyric[i].substring(10, lyric[i].length));
      se.push(lyric[i].substring(1,9));
      //dict[getSecond(lyric[i].substring(1,9))] = lyric[i].substring(10, lyric.length);
    }
  }
  return [ly, se];
}

function getSecond(times){
  time = times.split(":");
  return (parseInt(time[0])*60+parseFloat(time[1])).toFixed(2);
}

function postJSON(track, artist){
  var data = '{"title": "'+track+'", "artist": "'+artist+'"}'
  var jhr = new XMLHttpRequest();
  jhr.open('POST', "http://52.231.69.145:3000/showcontent", true);
  jhr.setRequestHeader("Content-type", "application/json");
  jhr.send(data);
}
