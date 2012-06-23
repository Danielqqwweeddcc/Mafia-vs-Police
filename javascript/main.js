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
// conf holds keys
// conf[0] holds primary key
function loadConfig (file) {
  var doc = loadXmlFile(file);
  var ret = myXMLParser(doc);
  return ret;
}
// ====================== init
g_config = new Array();
g_gameScenePic = Array();
g_gameAtlasPic = './pic/GameSceneAtlas.png';
function init(){
  var strDir = './config/'
  g_config['scene'] = loadConfig(strDir+"GameScene-ipad.xml");
  g_config['atlas'] = loadConfig(strDir+"GameSceneAtlas.xml").plist[0];
  g_config['helpScene'] = loadConfig(strDir+"HelpScene-ipad.xml");
  g_config['hintAtlas']=loadConfig(strDir+"HintAtlas.xml");
  g_config['init']=loadConfig(strDir+"init.xml");
  g_config['menu']=loadConfig(strDir+"Menu-ipad.xml");
  strDir = './pic/'
  g_gameScenePic['bandit'] = strDir+'bandit_theme-ipad.jpg';
  g_gameScenePic['family'] = strDir+'family_theme-ipad.jpg';
  g_gameScenePic['father'] = strDir+'father_theme-ipad.jpg';
  g_gameScenePic['fbi'] = strDir+'fbi_theme-ipad.jpg';
  g_gameScenePic['girls'] = strDir+'girls_theme-ipad.jpg';
  g_gameScenePic['heaven'] = strDir+'heaven_theme-ipad.jpg';
  g_gameScenePic['hell'] = strDir+'hell_theme-ipad.jpg';
  g_gameScenePic['inian'] = strDir+'inian_theme-ipad.jpg';
  g_gameScenePic['money'] = strDir+'money_theme-ipad.jpg';
  g_gameScenePic['police'] = strDir+'police_theme-ipad.jpg';
  g_gameScenePic['prison'] = strDir+'prison_theme-ipad.jpg';
}

function myXMLParser(doc) {
  var root = new Array();

  for (var i=0; i<doc.childNodes.length; i++) {
    var node = doc.childNodes[i];
    if (1 == node.nodeType) { // element
      var res = xml2array(node);
      root[node.nodeName] = array2kvTable(res);
    }
  }
  return root;
}

function xml2array(obj) {
  var ret = new Array();
  var node = null;
  var index = 0;

  if (1 == obj.nodeType &&
      1 == obj.childNodes.length &&
      3 == obj.childNodes[0].nodeType){
        return obj.childNodes[0].nodeValue;
      } else if (1 == obj.nodeType &&
                 ('true' == obj.nodeName ||
                  'false' == obj.nodeName)){
        return obj.nodeName;
      }

  for (var i=0; i<obj.childNodes.length; i++) {
    node = obj.childNodes[i];
    if (1 == node.nodeType) { // element
      ret[index] = new Array();
        ret[index]['key'] = node.nodeName;
        ret[index]['val'] = xml2array(node);
      index += 1;
    }
  }
	return ret;
}
// convert nested array to key-value table
function array2kvTable(array) {
  if (!(array instanceof Array))
    return array;
  var ret = new Array();
  var index = 0;
  var node = null;

  for (var i=0; i<array.length; i++) {
    node = array[i];
    if ('dict' == node.key) {
      ret[index] = array2kvTable(node.val);
    } else if ('key' == node.key) {
      ret[node.val] =  array2kvTable(array[i+1].val);
      i++;
    } else {
      ret[index] = node;
    }
    index ++;
  }

  return ret;
}
// ====================================== image opration
function str2pt(str){
  var res = str.match(/\{(-?[0-9]+), (-?[0-9]+)\}$/);
  var ret = new Array();
  ret[0] = Number(res[1]);
  ret[1] = Number(res[2]);

  return ret;
}
function str2rect(str){
  var res = str.match(/\{(\{.*\}), (\{.*\})\}$/);
  var ret = str2pt(res[1]);
  ret = ret.concat(str2pt(res[2]));

  return ret;
}

// ====================== ImageBlock
function ImageBlock(){
  this.context =  document.getElementById('playGround').getContext('2d');
}
ImageBlock.prototype.loadAtlas = function(key){
  var conf = g_config.atlas.frames[key];
  var colorRect = str2rect(conf.spriteColorRect);
  var textureRect = str2rect(conf.textureRect);
  var offset = str2pt(conf.spriteOffset);
  var size = str2pt(conf.spriteSize);
  var sourceSize = str2pt(conf.spriteSourceSize);
  var rotated = conf.textureRotated;
  var trimmed = conf.textureTrimmed;
  this.pic = new Image();
  pic.src = g_gameAtlasPic;
  dump_array(g_config.atlas.frames[key], 0);

  pic.onload = function () {
      var canvas = document.getElementById('playGround');
      var context = canvas.getContext('2d');

      context.save();
      context.translate(pic.width * 0.5, pic.height * 0.5);
      context.rotate(-3.1415926*0.5);
      context.translate(-pic.width * 0.5, -pic.height * 0.5);
      context.drawImage(pic, textureRect[0], textureRect[1], textureRect[2], textureRect[3], 900, 0, textureRect[2], textureRect[3]);
      context.restore();
  }

  this.pic = loadImage(key);
}
ImageBlock.prototype.init = function(key){
  var conf = g_config.atlas.frames[key];
  var colorRect = str2rect(conf.spriteColorRect);
  var textureRect = str2rect(conf.textureRect);
  var offset = str2pt(conf.spriteOffset);
  var size = str2pt(conf.spriteSize);
  var sourceSize = str2pt(conf.spriteSourceSize);
  var rotated = conf.textureRotated;
  var trimmed = conf.textureTrimmed;
  var pic = new Image();
  pic.src = g_gameAtlasPic;
  dump_array(g_config.atlas.frames[key], 0);

  pic.onload = function () {
      var canvas = document.getElementById('playGround');
      var context = canvas.getContext('2d');

      context.save();
      context.translate(pic.width * 0.5, pic.height * 0.5);
      context.rotate(-3.1415926*0.5);
      context.translate(-pic.width * 0.5, -pic.height * 0.5);
      context.drawImage(pic, textureRect[0], textureRect[1], textureRect[2], textureRect[3], 900, 0, textureRect[2], textureRect[3]);
      context.restore();
  }

  this.pic = loadImage(key);
}
ImageBlock.prototype.reset = function(){
}
ImageBlock.prototype.draw = function(){
}
ImageBlock.prototype.translate = function(){
}
// ===========================Atlas block
function AtlasBlock(){
  var canvas = document.getElementById('playGround');
  this.context = canvas.getContext('2d');

  var context = this.context;
  canvas.onclick = function(e){
    context.beginPath();
    context.moveTo(e.x, e.y);
    context.lineTo(0, 0);
    context.stroke();

    console.log(e);
    ge = e;
  }
}
AtlasBlock.prototype.selectTexture = function (key) {
  var conf = g_config.atlas.frames[key];
  this.colorRect = str2rect(conf.spriteColorRect);
  this.textureRect = str2rect(conf.textureRect);
  this.offset = str2pt(conf.spriteOffset);
  this.size = str2pt(conf.spriteSize);
  this.sourceSize = str2pt(conf.spriteSourceSize);
  this.rotated = conf.textureRotated;
  this.trimmed = conf.textureTrimmed;
  this.pic = new Image();
  this.pic.src = g_gameAtlasPic;
  this.x = 0;
  this.y = 0;
  var that = this;
  that.loaded = false;
  this.pic.onload = function () {
    that.loaded = true;
  }
}

AtlasBlock.prototype.moveTo = function (x, y) {
  this.x = x;
  this.y = y;
  this.render();
}

AtlasBlock.prototype.draw = function (key) {
  var ctx = this.context;
  var textureRect = this.textureRect;
  var pic = this.pic;
  var x = this.x;
  var y = this.y;
  var width = textureRect[2];
  var height = textureRect[3];

  ctx.save();
  if ('true' == this.rotated){
    // translated position
    x = pic.height-y-textureRect[2];

    ctx.translate(pic.width * 0.5, pic.height * 0.5);
    ctx.rotate(-3.1415926*0.5);
    ctx.translate(-pic.width * 0.5, -pic.height * 0.5);
  }
  ctx.drawImage(pic, textureRect[0], textureRect[1], textureRect[2], textureRect[3], x, y, width, height);
  ctx.restore();
}
AtlasBlock.prototype.render = function (key) {
  var that = this;
  var fnLocal_draw = function () {
    that.draw();
  }
  if (this.loaded){
    fnLocal_draw();
  } else {
    var interval = setInterval(function (){
      if (that.loaded){
        fnLocal_draw();
        clearInterval(interval);
      }
    }, 300);
  }
}
// ====================== gameScene
function Scene() {
  var canvas = document.getElementById('playGround');
  this.context = canvas.getContext('2d');
}
Scene.prototype.load = function(key) {
  this.pic = new Image();
  this.pic.src = g_gameScenePic[key];
  var that = this;

  that.loaded = false;
  this.pic.onload = function () {
    that.loaded = true;
    that.render();
  }
}

Scene.prototype.render = function(key) {
  var pic = this.pic;
  if (this.loaded) {
    this.context.drawImage(pic, 0, 0, 600, 800);
  } else {
    var that = this;
    var interval = setInterval(function () {
      that.context.drawImage(pic, 0, 0, 600, 800);
      clearInterval(interval);
    }, 10);
  }
}
// ====================== game
function Game(){
  this.canvas = document.getElementById('playGround');
  this.context = this.canvas.getContext('2d');
}

Game.prototype.loadGameScene = function(key) {
  this.scene = new Scene();
  this.scene.load(key);
}

Game.prototype.setup = function () {
  this.loadGameScene('father');
  atlas_gun = new AtlasBlock();
  atlas_gun.selectTexture('gunItem');
  atlas_father = new AtlasBlock();
  atlas_father.selectTexture('godfather');
}
Game.prototype.start = function () {
  px = 0;
  py = 0;
  var that = this;
  setInterval(function () {
    that.tick();
  }, 300);
}
Game.prototype.tick = function () {
  this.scene.render();

  px += 10;
  py += 10;
  atlas_father.moveTo(px, py);
  atlas_father.render();
}
// ====================== util
function dump_array (array, indent) {
  if (!(array instanceof Array))
    return false;
  if (indent > 16)
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
// ========= 
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
    for (i=1; i<conf.length; i++) {
      key = conf[i]
      data[key] = replaceNull(orderDoc.getElementsByTagName(key)[number]);
    }
  }
  ret['value']=data;
	return ret;
}
