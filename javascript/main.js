//==============================================================XML opration
function loadXmlFile(xmlFile){
  var xmlDom = null;
  if (window.ActiveXObject){
    xmlDom = new ActiveXObject("Microsoft.XMLDOM");
	xmlDom.async=false;
   xmlDom.load(xmlFile)||xmlDom.loadXML(xmlFile);
  }else if (document.implementation && document.implementation.createDocument){
    var xmlhttp = new window.XMLHttpRequest();
    xmlhttp.open("GET", xmlFile, false);
    xmlhttp.send(null);
    xmlDom = xmlhttp.responseXML;
  }else{
    xmlDom = null;
  }
  return xmlDom;
}
function replaceNull(obj) {
	var nodevalue = "";
	if(null != obj && null != obj.childNodes[0]) {
		nodevalue =obj.childNodes[0].nodeValue;
	}
	return nodevalue;
}
function getDataByid(orderDoc, conf, number) {
  var ret = new Array();
  var data = null;
  var key = "";
  var i;
  key = conf[0]
  ret['key'] = replaceNull(orderDoc.getElementsByTagName(key)[number]);
  if (conf.length = 2) { // single value
    data = replaceNull(orderDoc.getElementsByTagName(conf[1])[number]);
  } else { // multiple value stores in array
  console.log(conf.length);
    for (i=1; i<conf.length; i++) {
      key = conf[i]
      data[key] = replaceNull(orderDoc.getElementsByTagName(key)[number]);
    }
  }
  ret['value']=data;
	return ret;
}
// conf holds keys
// conf[0] holds primary key
function loadConfig (conf, file) {
  var doc = loadXmlFile(file);
  var ret = new Array();
  var total = doc.getElementsByTagName(conf[0]).length;

  for (var i=0; i<total; i++) {
    var data = getDataByid(doc, conf, i);
    if (null != data['key']) {
      ret[data[conf[0]]] = data['value'];
    };
  }
  return ret;
}
// ====================== init
//获得页面内容
function getContent(){
	var file="./config/GameScene-ipad.xml";
  var conf = new Array('key', 'string');
  var ret = loadConfig(conf, file);
  dump_array(ret, 0);
	file="./config/GameSceneAtlas.xml";
  conf = new Array('key', 'string');
  ret = loadConfig(conf, file);
  dump_array(ret, 0);
}
// ====================== util
function dump_array (array, indent) {
  if (!(array instanceof Array))
    return false;
  var preStr = "";
  for (var j=0; j<indent; j++) {
    preStr+=" ";
  }
  for (var i in array) {
    var str = preStr;
    if (array[i] instanceof Array) {
      console.log(str+i+":");
      dump_array(array[i], indent+1);
    } else {
      str += i+":"+array[i];
      console.log(str);
    }
  }
  return true;
}
