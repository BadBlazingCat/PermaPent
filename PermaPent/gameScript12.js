var canvas = document.getElementById("canvas");

canvas.width = window.innerWidth * 2.3;
canvas.height = window.innerHeight * 0.7;

var c = canvas.getContext("2d");
var $myCanvas = $("#canvas");

$myCanvas.drawImage({
  source: "Images/House.png",
  x: 600, y: -30,
  fromCenter: false,
  scale: 1.6,
});


var player_Img = new Image();
player_Img.onload = function() {
  c.drawImage(player_Img, 600, 460, 80, 130);
}
player_Img.src = "Images/Boy_Character.png";

function Sprite(x, y, w, h, src){
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h ;
  this.src = src;

// Draws Sprite to Given Canvas
  this.draw = function() {
    $myCanvas.drawImage({
      source: this.src,
      x: this.x, y: this.x,
      fromCenter: false,
      scale: 1.6,
      layer: true,
      name: "layer",
      mousedown: function(layer) {
        $(this).animateLayer(layer, {
          x: "+=100"
        });
      }
    });
  }
}


function CanvasState(canvas) {
  this.canvas = canvas;
  this.width = canvas.width;
  this.height = canvas.height;
  this.c = canvas.getContext('2d');

  // This complicates things a little but but fixes mouse co-ordinate problems
  // when there's a border or padding. See getMouse for more detail
  var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop;
  if (document.defaultView && document.defaultView.getComputedStyle) {
    this.stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10)      || 0;
    this.stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10)       || 0;
    this.styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 10)  || 0;
    this.styleBorderTop   = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 10)   || 0;
  }
  // Some pages have fixed-position bars (like the stumbleupon bar) at the top or left of the page
  // They will mess up mouse coordinates and this fixes that
  var html = document.body.parentNode;
  this.htmlTop = html.offsetTop;
  this.htmlLeft = html.offsetLeft;

  //Keep Track of State
  this.valid = false; //when set to true, the canvas will redraw everythin
  this.sprites = [];
  console.log(this.sprites);
  this.dragging = false;
  this.selection = null;
  this.dragoffx = 0;
  this.dragoffy = 0;

  var myState = this;

//fixes a problem where double clicking causes text to get selected on the canvas
  canvas.addEventListener("selectstart", function(e) {e.preventDefault(); return false; }, false);

  canvas.addEventListener("mousedown", function(e) {
    var mouse = myState.getMouse(e);
    var mx = mouse.x;
    var my = mouse.y;
    var sprites = myState.sprites;
    var l = myState.length;

    for(var i = l-1; i>=0; i--){
      if (sprites[i].contains(mx, my)) {
        var mySel = sprites[i];

        myState.dragoffx = mx - mySel.x;
        myState.dragoffy = my - mySel.y;
        myState.dragging = true;
        myState.selection = mySel;
        myState.valid = false;
        return;
      }
    }
    // havent returned means we have failed to select anything.
    // If there was an object selected, we deselect it
    if (myState.selection){
      myState.selection = null;
      myState.valid = false; //Need to clear old selection border
    }
  }, true);

  canvas.addEventListener("mouseover", function(e) {
    if (myState.dragging) {
      var mouse = myState.getMouse(e);
      // We don't want to drag the object by its top-left corner, we want to drag it
      // from where we clicked. Thats why we saved the offset and use it here
      myState.selection.x = mouse.x - myState.dragoffx;
      myState.selection.y = mouse.y - myState.dragoffy;
      myState.valid = false; //Somwthing's dragging to must redraw
    }
  }, true);

  canvas.addEventListener("mouseup", function(e) {
    myState.dragging = false;
  }, true);

  this.interval = 30;
  setInterval(function () { myState.draw(); }, myState.interval);

  this.addSprite = function(sprite) {
    this.sprites.push(sprite);
    this.valid = false;
  }

  this.clear = function() {
    this.c.clearRect(0,0,this.width, this.height);
  }

  //background
  this.draw = function() {
    if(!this.valid) {
      var c = this.c;
      var sprites = this.sprites;
      this.clear();

      $myCanvas.drawImage({
        source: "Images/House.png",
        x: 600, y: -30,
        fromCenter: false,
        scale: 1.6,
      });
      //draw everthing
      var l = sprites.length;
      for (var i = 0; i < l; i++) {
        var sprite = sprites[i];
        //We can skip the drawing of elements that moved off screen
        if (sprite.x > this.width || sprite.y > this.height ||
        sprite.x + sprite.w < 0 || sprite.y + sprite.h < 0) continue;
        sprite.draw();
      }

      //draw selection
      if (this.selection != null) {
        c.strokeStyle = this.selectionColor;
        c.lineWidth = this.selctionWidth;
        var mySel = this.selection;
        c.strokeRect(mySel.x,mySel.y,mySel.w,mySel.h);
      }

      this.valid = true;
    }
  }

  this.getMouse = function(e) {
    var element = this.canvas, offsetX = 0, offsetY = 0, mx, my;

    // Compute the total offset
    if (element.offsetParent !== undefined) {
      do {
        offsetX += element.offsetLeft;
        offsetY += element.offsetTop;
      } while ((element = element.offsetParent));
    }

    // Add padding and border style widths to offset
    // Also add the <html> offsets in case there's a position:fixed bar
    offsetX += this.stylePaddingLeft + this.styleBorderLeft + this.htmlLeft;
    offsetY += this.stylePaddingTop + this.styleBorderTop + this.htmlTop;

    mx = e.pageX - offsetX;
    my = e.pageY - offsetY;

    // We return a simple javascript object (a hash) with x and y defined
    return {x: mx, y: my};
  }

}


init();

function init() {
  var p = new CanvasState(document.getElementById("canvas"));
  var sprite = new Sprite(100, 100, 50, 50, "Images/pic.jpg");
  p.addSprite(sprite);
}
