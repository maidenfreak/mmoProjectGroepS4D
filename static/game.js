var socket = io();
socket.on('message', function(data) {
  console.log(data);
});

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
  socket.emit('movement', movement);
}, 1000 / 60);

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

var canvas = document.getElementById('canvas');
canvas.width = 640;
canvas.height = 640;
var context = canvas.getContext('2d');
socket.on('state', function(players, bullets) {
  context.clearRect(0, 0, 640, 640);
  context.fillStyle = 'green';
  for (var id in players) {
    var player = players[id];
    context.beginPath();
    context.arc(player.x, player.y, 10, 0, 2 * Math.PI);
    context.fill();  
  }

  for (var id in bullets) {
    var bullet = bullets[id];
    context.beginPath();
    context.arc(bullet.x, bullet.y, 5, 0, 2 * Math.PI);
    context.fill();
  }
});
