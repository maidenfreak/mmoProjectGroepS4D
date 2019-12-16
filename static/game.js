var socket = io();
var canvas = document.getElementById('canvas');
canvas.width = 640;
canvas.height = 640;
var context = canvas.getContext('2d');

const objects = [];
class object {
  constructor(name, x, y, width, height){
    this.name = name;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
  pushToArray(){
    objects.push(this);
    console.log(objects);
  }
  build(){
    context.beginPath();
    context.fillStyle = "black";
    context.rect(this.x, this.y, this.width, this.height);
    context.fill();
  }
}

var movement = {
    up: false,
    down: false,
    left: false,
    right: false
  }
  document.addEventListener('keydown', function(event) {
    switch (event.keyCode) {
      case 65: // A
        movement.left = true;
        break;
      case 87: // W
        movement.up = true;
        break;
      case 68: // D
        movement.right = true;
        break;
      case 83: // S
        movement.down = true;
        break;
    }
  });
  document.addEventListener('keyup', function(event) {
    switch (event.keyCode) {
      case 65: // A
        movement.left = false;
        break;
      case 87: // W
        movement.up = false;
        break;
      case 68: // D
        movement.right = false;
        break;
      case 83: // S
        movement.down = false;
        break;
    }
  });

socket.emit('new player');
setInterval(function() {
  socket.emit('movement', movement, objects);
}, 1000 / 60);

socket.on('message', function(data) {
  console.log(data);
});

//Functie die kijk op welke positie de muis staat, geeft x en y coordinaat terug
function getCursorPosition(canvas, event){
  const rect = canvas.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  return [x,y]
}

//Wanneer er geklikt wordt geeft deze de coordinaten van de muis.
setInterval(function() {
  canvas.onclick = function(event){
    var values = getCursorPosition(canvas, event)
    var x = values[0];
    var y = values[1];
    var coords = "x" + x + "y" + y;
    socket.emit('shoot-bullet', {x: 300, y: 300, speedY: 5},x,y);
  };
}, 16);

socket.on('state', function(players, bullets) {
  context.clearRect(0, 0, 640, 640);
  context.fillStyle = 'green';
  for (var id in players) {
    var player = players[id];
    context.beginPath();
    context.arc(player.x, player.y, 10, 0, 2 * Math.PI);
    context.fill();  
  }

  for(i=0; i<objects.length; i++){
    objects[i].build();
  }

  for (var id in bullets) {
    var bullet = bullets[id];
    context.beginPath();
    context.arc(bullet.x, bullet.y, 5, 0, 2 * Math.PI);
    context.fill();
  }
});

//alle objecten die worden getekend.
let wall1 = new object("wall1", 160, 0, 2, 30); wall1.pushToArray();
let wall2 = new object("wall2", 160, 60, 2, 100); wall2.pushToArray();
let wall3 = new object("wall3", 0, 160, 30, 2); wall3.pushToArray();
let wall4 = new object("wall4", 60, 160, 100, 2); wall4.pushToArray();
