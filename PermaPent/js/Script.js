//Canvas Animation
  var canvas = document.querySelector("canvas");

  canvas.width = (window.innerWidth);
  canvas.height = (window.innerHeight / 2);

  var c = canvas.getContext('2d');

  var mouse = {x: undefined, y: undefined}
  var maxRadius = 60;
  var minRadius = 1;

  //coloring choices of circles
  colorArray = ["#ff6347", "#ff6347", "#6dc9dd", "#f4f3ea", "	#c2df55", "#a0e3db"]


  //Getting Location of Mouse
  window.addEventListener('mousemove', function(event){
    mouse.x = event.x;
    mouse.y = event.y;
    console.log(mouse);
  })

  //resizing browser
  window.addEventListener("resize", function(){
    canvas.width = (window.innerWidth);
    canvas.height = (window.innerHeight / 2);

    init();
  })

  function Circle(x, y, radius, dx , dy) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.minRadius = radius;
    this.color = colorArray[Math.floor(Math.random()* colorArray.length)];


    this.draw = function() {
      c.beginPath();
      c.arc(this.x, this.y, this.radius,0, Math.PI * 2);
      c.fillStyle = this.color;
      c.fill();
      c.strokeStyle = this.color;
      c.stroke();
      }

    this.update = function() {
      this.draw();

      if (this.x + this.radius > innerWidth || this.x - this.radius < 0) {
        this.dx = -this.dx;
      }

      if (this.y + this.radius > innerHeight|| this.y - this.radius < 0) {
        this.dy = -this.dy;
      }

      this.x += this.dx;
      this.y += this.dy;

      // interactive
      if (mouse.x - this.x < 50 && mouse.x - this.x > -50
        && mouse.y - this.y < 50 && mouse.y - this.y > -50) {
          if (this.radius < maxRadius){
          this.radius += 3;
        }
      }
      else if (this.radius > this.minRadius) {
        this.radius -= 3;
      }


      console.log("jndjkdns")

      this.draw();
    }
  }


  var circleArray = []

  for (var i = 0; i < 300; i++){
    var radius = (Math.random() + 1) * 7.5;
    var x = Math.random() * (innerWidth - radius * 2) + radius;
    var y = Math.random() * (innerHeight - radius * 2) + radius;
    var dx = (Math.random() - 0.5) * 3;
    var dy = (Math.random() - 0.5) * 3;
    circleArray.push(new Circle(x, y, radius, dx , dy));
  }

  function init (){

    circleArray = []

    for (var i = 0; i < 300; i++){
      var radius = (Math.random() + 1) * 10 ;
      var x = Math.random() * (innerWidth - radius * 2) + radius;
      var y = Math.random() * (innerHeight - radius * 2) + radius;
      var dx = (Math.random() - 0.5) * 3;
      var dy = (Math.random() - 0.5) * 3;
      circleArray.push(new Circle(x, y, radius, dx , dy));
    }
  }

  function animate(){
    requestAnimationFrame(animate)
    c.clearRect(0,0,innerWidth, innerHeight);

    for (var i = 0; i < circleArray.length; i++) {
      circleArray[i].update()
    }

  }

  animate();

//?
