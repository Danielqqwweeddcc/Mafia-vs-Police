function extend(Child, Parent)
{
  var F = function () {};
  F.prototype = Parent.prototype;
  Child.prototype = new F();
  Child.prototype.constructor = Child;
  Child.uber = Parent.prototype;
}

g_Index = 0;
function Token(){
  this.flag = false;
  this.index = g_Index; // Token's GUID
  g_Index++;
  var canvas = document.getElementById('playGround');
  this.context = canvas.getContext('2d');
  this.initialized = false;
  this.x = 0;
  this.y = 0;
  // collision info
  this.colWidth = eval(g_config['scene'].cellWidth);
  this.colHeight = eval(g_config['scene'].cellWidth);
  this.colX = 0;
  this.colY = 0;
  this.level = 0;
  this.loaded = false;
}
Token.prototype.setCollistionRect = function (width, height) {
  this.colWidth = width;
  this.colHeight = height;
  this.moveTo(this.x, this.y);
}
Token.prototype.collisionCheck = function (x, y) {
  var px, py, width, height;
  px = this.colX;
  py = this.colY;
  height = this.colHeight;
  width = this.colWidth;

  if (x > px && x < (px+width) &&
      y > py && y < (py+height)){
        return true;
      }
  return false;
}
Token.prototype.selectTexture = function (key) {
  // console.log("selectTexture("+this.index+"):"+key);
  if (null == key) {
    this.loaded = false;
    this.key = null;
    return null;
  }
  var conf = g_config.atlas.frames[key];
  this.colorRect = str2rect(conf.spriteColorRect);
  this.textureRect = str2rect(conf.textureRect);
  this.offset = str2pt(conf.spriteOffset);
  var size = str2pt(conf.spriteSize);
  this.height = size[1];
  this.width = size[0];
  this.sourceSize = str2pt(conf.spriteSourceSize);
  this.rotated = conf.textureRotated;
  this.trimmed = conf.textureTrimmed;
  this.pic = new Image();
  this.pic.src = g_gameAtlasPic;
  this.loaded = false;
  this.initialized = true;
  this.key = key;
  var that = this;

  this.setCollistionRect(this.width, this.height);
  this.pic.onload = function () {
    that.loaded = true;
  }
}

Token.prototype.moveTo = function (x, y) {
  //console.log("moveTo("+this.index+"), ("+x+", "+y+")");
  //console.log(this.width+" "+this.height+" "+this.rotated);
  this.x = x;
  this.y = y;

  this.colX = x-this.colWidth*0.5;
  this.colY = y-this.colHeight*0.5;
}
var g_showCollBox = false;
Token.prototype.draw = function (key) {
  var ctx = this.context;
  var textureRect = this.textureRect;
  var pic = this.pic;
  var x = this.x-this.width*0.5; // center align
  var y = this.y-this.height*0.5;
  var width = textureRect[2];
  var height = textureRect[3];

  if (g_showCollBox)
  {
    ctx.beginPath();
    ctx.moveTo(this.colX, this.colY);
    ctx.lineTo(this.colX, this.colY+this.colHeight);
    ctx.moveTo(this.colX, this.colY);
    ctx.lineTo(this.colX+this.colWidth, this.colY);
    ctx.moveTo(this.colX+this.colWidth, this.colY+this.colHeight);
    ctx.lineTo(this.colX+this.colWidth, this.colY);
    ctx.moveTo(this.colX+this.colWidth, this.colY+this.colHeight);
    ctx.lineTo(this.colX, this.colY+this.colHeight);
    ctx.stroke();
  }

  ctx.save();
  if ('true' == this.rotated){
    // translated position
    y = this.x-this.width*0.5;
    x = pic.height-(this.y-this.height*0.5)-textureRect[2];

    ctx.translate(pic.width * 0.5, pic.height * 0.5);
    ctx.rotate(-3.1415926*0.5);
    ctx.translate(-pic.width * 0.5, -pic.height * 0.5);
  }
  ctx.drawImage(pic, textureRect[0], textureRect[1], textureRect[2], textureRect[3], x, y, width, height);
  ctx.restore();
}
Token.prototype.render = function (key) {
  if (this.initialized){
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
}
