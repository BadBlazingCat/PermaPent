var canvas = document.getElementById("canvas");

canvas.width = window.innerWidth * 2.3;
canvas.height = window.innerHeight * 0.7;

var c = canvas.getContext("2d");
var $myCanvas = $("#canvas");

function Sprite(x, y, scale, src, layerName, layerGroup, nonDraggable){
  this.x = x;
  this.y = y;
  this.scale = scale;
  this.src = src;
  this.layerName = layerName;
  var layer = this.layerName;
  this.layerGroup = layerGroup || null;
  this.nonDraggable = nonDraggable || false;
  //for rectangle's layer layerName
  var layerRect = this.layerName + $myCanvas.getLayerIndex(this.layerName);

  $myCanvas.drawImage({
    source: this.src,
    x: this.x, y: this.y,
    fromCenter: false,
    scale: this.scale,
    layer: true,
    name: this.layerName,
    draggable: true,
    intangible: this.nonDraggable,
    dblclick: function(layer){
      $myCanvas.drawRect({
        fillStyle: "#ccc",
        layer: true,
        name: "box",
        x: layer.eventX , y: layer.eventY,
        height: 150,
        width: 165,
      });
    }
  });
  if (this.layerGroup != null){
    $myCanvas.addLayerToGroup(this.layerName, this.layerGroup);
  }
  console.log($myCanvas.getLayers());
}



$myCanvas.drawImage({
  source: "Images/House.png",
  x: 600, y: -30,
  fromCenter: false,
  scale: 1.6,
  draggable: true,
  intangible: true,
});


$myCanvas.drawImage({
  source: "Images/Boy_Character.png",
  x: 600 , y: 480,
  scale: 0.5,
  draggable:true,
  bringToFront: true,
});


// Draws Sprite to Given Canvas

new Sprite (150,150, 1.6, "Images/pic.jpg", "BadBoss", "Art");
