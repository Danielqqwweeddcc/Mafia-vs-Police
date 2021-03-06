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
  g_config['scene'] = loadConfig(strDir+"GameScene-ipad.xml").plist[0];
  g_config['atlas'] = loadConfig(strDir+"GameSceneAtlas.xml").plist[0];
  g_config['helpScene'] = loadConfig(strDir+"HelpScene-ipad.xml");
  g_config['hintAtlas']=loadConfig(strDir+"HintAtlas.xml");
  g_config['init']=loadConfig(strDir+"init.xml");
  g_config['menu']=loadConfig(strDir+"Menu-ipad.xml");
//  dump_array(g_config.atlas.frames, 0);
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

  var index = 0;
  var probablity = 0;
  var item;
  for (var i in g_itemProbablity)
  {
    probablity += g_itemProbablity[i];
    g_tblProbabilty[index] = new Array();
    item = g_tblProbabilty[index];
    item.key = i;
    item.rate = probablity;
    index++;
  }
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
  if (null == res) {
    return null;
  }
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
// ====================== gameScene
function Scene() {
  var canvas = document.getElementById('playGround');
  this.context = canvas.getContext('2d');
}
Scene.prototype.load = function(key) {
  this.pic = new Image();
  console.log(this.pic.width+" "+this.pic.height);
  this.pic.src = g_gameScenePic[key];
  var that = this;

  that.loaded = false;
  this.pic.onload = function () {
    that.loaded = true;
  }
}

Scene.prototype.render = function(key) {
  var pic = this.pic;
  if (this.loaded) {
    this.context.drawImage(pic, 0, 0, 768, 1024);
  } else {
    var that = this;
    var interval = setInterval(function () {
      that.context.drawImage(pic, 0, 0, 768, 1024);
      clearInterval(interval);
    }, 10);
  }
}
// ====================== game
function Game(){
  this.canvas = document.getElementById('playGround');
  this.context = this.canvas.getContext('2d');
  this.height = 1024;
  this.width = 768;
}

Game.prototype.loadGameScene = function(key) {
  this.scene = new Scene();
  this.scene.load(key);
}

Game.prototype.setup = function () {
  this.loadGameScene('father');
  this.field = new Array();
  var width = eval(g_config['scene'].cellWidth);
  var pt = str2pt(g_config['scene'].fieldPosition);
  pt[1] = this.height-pt[1]-width;

  for (var i=0; i<6; i++) {
    this.field[i] = new Array();
    for (var j=0; j<6; j++) {
      this.field[i][j] = new Token();
      //this.field[i][j].selectTexture('godfather');
      this.field[i][j].moveTo(pt[0]+width*(j+0.5), pt[1]-width*(i-0.5));
      this.field[i][j].setCollistionRect(width, width);
    }
  }
  // change it into graph
  // left
  for (var i=0; i<6; i++) {
    for (var j=0; j<5; j++) {
      this.field[i][j].left = this.field[i][j+1];
    }
  }
  // right
  for (var i=0; i<6; i++) {
    for (var j=1; j<6; j++) {
      this.field[i][j].right = this.field[i][j-1];
    }
  }
  // up
  for (var i=1; i<6; i++) {
    for (var j=0; j<6; j++) {
      this.field[i][j].up = this.field[i-1][j];
    }
  }
  // down
  for (var i=0; i<5; i++) {
    for (var j=0; j<6; j++) {
      this.field[i][j].down = this.field[i+1][j];
    }
  }

  this.generatorFrame = new Token();
  this.islandFrame = new Token();
  this.generator = new Token();
  this.island = new Token();

  pt = str2pt(g_config['scene'].generatorPosition);
  var token = this.generatorFrame;
  token.selectTexture('generator');
  token.moveTo(pt[0], this.height-pt[1]);
  pt = str2pt(g_config['scene'].stockPosition);
  var token = this.islandFrame;
  token.selectTexture('stock');
  token.moveTo(pt[0], this.height-pt[1]);
  token = this.island;
 // token.selectTexture('angel');
  token.moveTo(pt[0], this.height-pt[1]);

  this.generate();
}

Game.prototype.findEmptyToken = function (token, fly) 
{
  if (fly)
  {
    while (true)
    {
      var seed = Math.random();
      seed *= 36;
      seed = Math.floor(seed);
      if (seed/6 != token.x && seed%6 != token.y &&
          this.field[seed/6][seed%6].key == null)
        return this.field[seed/6][seed%6];
    }
  }
  else 
  {
    if (null != token.left && null == token.left.key)
      return token.left;
    if (null != token.right && null == token.right.key)
      return token.right;
    if (null != token.up && null == token.up.key)
      return token.up;
    if (null != token.down && null == token.down.key)
      return token.down;
  }
}

Game.prototype.tick = function () 
{
  var width = eval(g_config['scene'].cellWidth);
  var token = null;
  for (var i=0; i<6; i++) {
    for (var j=0; j<6; j++) {
      token = this.field[i][j];
      switch (token.key)
      {
        case 'policeman': // random walk
          token.flag = true;
          break;
        case 'fbi': // random fly
          token.flag = true;
          break;
      }
    }
  }
  for (var i=0; i<6; i++) {
    for (var j=0; j<6; j++) {
      token = this.field[i][j];
      if (token.flag)
      {
        switch (token.key)
        {
          case 'policeman': // random walk
            var pt = this.findEmptyToken(token, 0);
            if (pt == null) // nowhere to go, turn into detective
            {
              token.selectTexture('detective');
              token.setCollistionRect(width, width);
              this.matchingCheck(token);
            }
            else
            {
              token.selectTexture(null);
              token.setCollistionRect(width, width);
              pt.selectTexture('policeman');
              pt.setCollistionRect(width, width);
            }
            break;
          case 'fbi': // random fly
            var pt = this.findEmptyToken(token, 1);
            if (pt != null) // go~
            {
              token.selectTexture(null);
              token.setCollistionRect(width, width);
              pt.selectTexture('fbi');
              pt.setCollistionRect(width, width);
            }
            break;
        }
        token.flag = false;
      }
    }
  }
}
Game.prototype.applyToken = function (token, preToken) {
  var width = eval(g_config['scene'].cellWidth);
  if ('gunItem' == preToken.key) {
  } else if ('jokerItem' == preToken.key) {
  } else if ('policeman' == preToken.key) {
    token.selectTexture(preToken.key);
    token.setCollistionRect(width, width);
  } else if ('girlItem' == preToken.key) {
  } else if ('starItem' == preToken.key) {
  } else if ('fbi' == preToken.key) {
    token.selectTexture(preToken.key);
    token.setCollistionRect(width, width);
  } else {
    token.selectTexture(preToken.key);
    token.setCollistionRect(width, width);
    this.matchingCheck(token);
  } 
  this.tick();
}
g_itemProbablity = new Array();
g_itemProbablity['moneyItem'] = 0.712;
g_itemProbablity['banditItem'] = 0.11;
g_itemProbablity['banditcarItem'] = 0.0195;
g_itemProbablity['prison'] = 0.005;
g_itemProbablity['policeman'] = 0.1;
g_itemProbablity['gunItem'] = 0.024;
g_itemProbablity['jokerItem'] = 0.012;
g_itemProbablity['fbi'] = 0.005;
g_itemProbablity['girlItem'] = 0.012;
g_itemProbablity['starItem'] = 0.0005;
g_tblProbabilty = new Array();
Game.prototype.generate = function () {
  var width = eval(g_config['scene'].cellWidth);
  var pt = str2pt(g_config['scene'].generatorPosition);

  var token = this.generator;
  var rand = Math.random();
  var key = null;
  for (var i=0; i<g_tblProbabilty.length; i++)
  {
    if (g_tblProbabilty[i].rate >= rand)
    {
      key = g_tblProbabilty[i].key;
      break;
    }
  }
  token.selectTexture(key);
  token.moveTo(pt[0], this.height-pt[1]);
}

Game.prototype.generatorFlyBack = function () {
  var pt = str2pt(g_config['scene'].generatorPosition);
  var token = this.generator;

  token.moveTo(pt[0], this.height-pt[1]);
}

Game.prototype.islandFlyBack = function () {
  var pt = str2pt(g_config['scene'].stockPosition);
  var token = this.island;

  token.moveTo(pt[0], this.height-pt[1]);
}
g_matchingRule = new Array();
g_matchingRule['moneyItem'] = 'banditItem';
g_matchingRule['banditItem'] = 'banditcarItem';
g_matchingRule['banditcarItem'] = 'prison';
g_matchingRule['prison'] = 'gangster';
g_matchingRule['gangster'] = 'bar';
g_matchingRule['bar'] = 'family';
g_matchingRule['family'] = 'casino';
g_matchingRule['casino'] = 'godfather';
g_matchingRule['godfather'] = 'demon';
g_matchingRule['demon'] = 'hell';

g_matchingRule['detective'] = 'policecar';
g_matchingRule['policecar'] = 'segeant';
g_matchingRule['segeant'] = 'police';
g_matchingRule['police'] = 'chief';
g_matchingRule['chief'] = 'minister';
/*
president
*/
Game.prototype.matchingCheck = function (token) {
  var list = new Array();
  var tmpList = new Array();
  var key = token.key;
  var index = 0;
  var i = 0;
  var fnHelper = function ()
  {
    for (var j=0; j<tmpList.length; j++)
    {
      var k = 0;
      for (k=0; k<list.length; k++)
      {
        if (list[k] == tmpList[j])
          break;
      }
      if (k >= list.length)
        list[list.length] = tmpList[j];
    }
  }
  list[0] = token;
  while (i < list.length){
    index = 0;
    if (null != list[i].left && key == list[i].left.key)
      tmpList[index++] = list[i].left;
    if (null != list[i].right && key == list[i].right.key)
      tmpList[index++] = list[i].right;
    if (null != list[i].up && key == list[i].up.key)
      tmpList[index++] = list[i].up;
    if (null != list[i].down && key == list[i].down.key)
      tmpList[index++] = list[i].down;
    fnHelper();
    i++;
  }
  if (list.length >= 3)
  {
    var width = eval(g_config['scene'].cellWidth);
    console.log("matching:"+list.length);
    for (var k=1; k<list.length; k++)
    {
      list[k].selectTexture(null);
    }
    token.selectTexture(g_matchingRule[key]);
    token.setCollistionRect(width, width);

    // chain
    this.matchingCheck(token);
  }
}

Game.prototype.matchingAnimate = function (list) {
    for (var k=1; k<list.length; k++)
    {
      list[k].selectTexture(null);
    }
    token.selectTexture(g_matchingRule[key]);
    token.setCollistionRect(width, width);
}

Game.prototype.onMouseMove = function (e) {
  if (null != this.activedToken) {
    if ('generator' == this.activedOp ||
        'island' == this.activedOp){
          this.activedToken.moveTo(e.offsetX+this.activedOffsetX, 
              e.offsetY+this.activedOffsetX);
        }
  }
}

Game.prototype.onMouseDown = function (e) {
  if (this.collCheck(e.offsetX, e.offsetY)) {
    this.activedOffsetX = this.activedToken.x-e.offsetX;
    this.activedOffsetY = this.activedToken.y-e.offsetY;
  } else {
    console.log("down");
  }
}

Game.prototype.onMouseUp = function (e) {
  var preToken = this.activedToken;
  console.log("onMouseUp src:"+this.activedOp);
  if ('generator' == this.activedOp) { // from generator
    if (this.collCheck(e.offsetX, e.offsetY)) {
      console.log("onMouseUp dst:"+this.activedOp+","+this.activedToken.loaded);
      if (!this.activedToken.loaded) {
        if ('field' == this.activedOp) {
          this.applyToken(this.activedToken, preToken);
          this.generate();
        } else if ('emptyIsland' == this.activedOp) {
          this.activedToken.selectTexture(preToken.key);
          this.generate();
        } else {
          this.generatorFlyBack();
        }
      } else {
        this.generatorFlyBack();
      }
    } else {
      this.generatorFlyBack();
    }
  } else if ('island' == this.activedOp) { // from island
    if (this.collCheck(e.offsetX, e.offsetY)) {
      if (!this.activedToken.loaded) {
        if ('field' == this.activedOp) {
          this.applyToken(this.activedToken, preToken);
          this.island.selectTexture(null);
          this.islandFlyBack();
        } else {
          this.islandFlyBack();
        }
      } else {
        this.islandFlyBack();
      }
    } else {
      this.islandFlyBack();
    }
  }
  this.activedOp = null;
  this.activedToken = null;
}

Game.prototype.collCheck = function (x, y) {
  for (var i=0; i<6; i++) {
    for (var j=0; j<6; j++) {
      if (this.field[i][j].collisionCheck(x, y)) {
        this.activedOp = 'field';
        this.activedToken = this.field[i][j];
        return true;
      }
    }
  }

  var tar;
  if (this.island.loaded) {
    tar = this.island;
    if (tar.collisionCheck(x, y)) {
      this.activedOp = 'island';
      this.activedToken = tar;
      return true;
    }
  } else {
    tar = this.islandFrame;  
    if (tar.collisionCheck(x, y)) {
      this.activedOp = 'emptyIsland';
      this.activedToken = this.island;
      return true;
    }
  }
  tar = this.generator;
  if (tar.collisionCheck(x, y)) {
    this.activedOp = 'generator';
    this.activedToken = tar;
    return true;
  }
  return false;
}

Game.prototype.start = function () {
  px = 0;
  py = 0;
  var that = this;
  this.canvas.onmousemove = function (e) {that.onMouseMove(e);};
  this.canvas.onmouseup = function (e) {that.onMouseUp(e);};
  this.canvas.onmousedown = function (e) {that.onMouseDown(e);};

  setInterval(function () {
    that.render();
  }, 10);
}

Game.prototype.render = function () {
  this.scene.render();

  for (var i in g_config['scene']) {
    if ('generatorPosition' == i ||
        'fieldPosition' ==i){
          continue
        }
    var pt = str2pt(g_config['scene'][i]);
    if (null != pt) {
      this.context.font = "12px impact";
      this.context.fillStyle = "#FFFFFF";
      this.context.textAlign = "center";
      this.context.fillText(i, pt[0], 1024-pt[1]);
    }
  }

  for (var i=0; i<6; i++) {
    for (var j=0; j<6; j++) {
      this.field[i][j].render();
    }
  }

  this.generatorFrame.render();
  this.islandFrame.render();
  this.island.render();
  this.generator.render();
}
// ====================== util
function dump_array (array, indent) {
  if (!(array instanceof Array))
    return false;
  if (indent > 10)
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

/*
add
angel
arrow
bag1
bag2
bag3
bag4
closeButton
coin1
coin2
coin3
coin4
coin5
generator
generator-free
heaven
inian
pause
question
selection
stock
stock2
storeButton
toilet
*/
