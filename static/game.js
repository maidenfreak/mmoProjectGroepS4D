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
  socket.emit('checkBullets');
}, 1000 / 60);

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

        
    context.font = "20px Arial";
    context.fillText(player.hp, player.x, player.y, 100);
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
let wall1 = new object("wall1", 160, 0, 2, 25); wall1.pushToArray();
let wall2 = new object("wall2", 160, 55, 2, 107); wall2.pushToArray();
let wall3 = new object("wall3", 0, 160, 25, 2); wall3.pushToArray();
let wall4 = new object("wall4", 55, 160, 105, 2); wall4.pushToArray();
let wall5 = new object("wall5", 160, 80, 80, 2); wall5.pushToArray();
let wall6 = new object("wall6", 240, 80, 2, 25); wall6.pushToArray();
let wall7 = new object("wall7", 240, 135, 2, 50); wall7.pushToArray();
let wall45 = new object("wall45", 80, 215, 2, 25); wall45.pushToArray();
let wall46 = new object("wall46", 80, 160, 2, 25); wall46.pushToArray();
let wall47 = new object("wall47", 240, 215, 2, 27); wall47.pushToArray();
let wall48 = new object("wall48", 80, 240, 160, 2); wall48.pushToArray();
let wall8 = new object("wall8", 240, 160, 65, 2); wall8.pushToArray();
let wall9 = new object("wall9", 335, 160, 65, 2); wall9.pushToArray();
let wall10 = new object("wall10", 400, 0, 2, 25); wall10.pushToArray();
let wall11 = new object("wall11", 400, 55, 2, 105); wall11.pushToArray();
let wall12 = new object("wall12", 320, 0, 2, 80); wall12.pushToArray();
let wall13 = new object("wall13", 400,160,25,2); wall13.pushToArray();
let wall14 = new object("wall14", 455,160,105,2); wall14.pushToArray();
let wall15 = new object("wall15", 560,135,2,185); wall15.pushToArray();
let wall16 = new object("wall16", 560,0,2,105); wall16.pushToArray();
let wall17 = new object("wall17", 560,240,25,2); wall17.pushToArray();
let wall18 = new object("wall18", 615,240,25,2); wall18.pushToArray();
//let wall19 = new object("wall19", 560,320,25,2); wall19.pushToArray();
let wall20 = new object("wall20", 615,320,25,2); wall20.pushToArray();
let wall21 = new object("wall21", 400,160,2,80); wall21.pushToArray();
let wall22 = new object("wall22", 400,240,80,2); wall22.pushToArray();
let wall23 = new object("wall23", 480,160,2,25); wall23.pushToArray();
let wall24 = new object("wall24", 480,215,2,50); wall24.pushToArray();
let wall25 = new object("wall25", 480,295,2,50); wall25.pushToArray();
let wall26 = new object("wall26", 480,320,25,2); wall26.pushToArray();
let wall27 = new object("wall27", 535,320,50,2); wall27.pushToArray();
//let wall28 = new object("wall28", 480,320,2,25); wall28.pushToArray();
let wall29 = new object("wall29", 480,375,2,25); wall29.pushToArray();
let wall30 = new object("wall30", 400,400,160,2); wall30.pushToArray();
let wall31 = new object("wall31", 560,400,2,25); wall31.pushToArray();
let wall32 = new object("wall32", 560,455,2,25); wall32.pushToArray();
let wall33 = new object("wall33", 615,480,25,2); wall33.pushToArray();
let wall34 = new object("wall34", 480,480,105,2); wall34.pushToArray();
let wall35 = new object("wall35", 480,480,2,105); wall35.pushToArray();
let wall36 = new object("wall36", 480,615,2,25); wall36.pushToArray();
let wall37 = new object("wall37", 400,400,2,25); wall37.pushToArray();
let wall38 = new object("wall38", 400,455,2,50); wall38.pushToArray();
let wall39 = new object("wall39", 400,535,2,25); wall39.pushToArray();
let wall40 = new object("wall40", 400,560,80,2); wall40.pushToArray();
let wall41 = new object("wall41", 320,560,2,80); wall41.pushToArray();
let wall42 = new object("wall42", 215,480,90,2); wall42.pushToArray();
let wall43 = new object("wall43", 335,480,65,2); wall43.pushToArray();
let wall44 = new object("wall44", 240,400,2,185); wall44.pushToArray();
let wall49 = new object("wall49", 240,615,2,25); wall49.pushToArray();
let wall50 = new object("wall50", 80,480,105,2); wall50.pushToArray();
let wall51 = new object("wall51", 80,455,2,50); wall51.pushToArray();
let wall52 = new object("wall52", 80,535,2,105); wall52.pushToArray();
let wall53 = new object("wall53", 80,320,2,105); wall53.pushToArray();
let wall54 = new object("wall54", 55,320,50,2); wall54.pushToArray();
let wall55 = new object("wall55", 0,320,25,2); wall55.pushToArray();
let wall56 = new object("wall56", 55,400,25,2); wall56.pushToArray();
let wall57 = new object("wall57", 0,400,25,2); wall57.pushToArray();
let wall58 = new object("wall58", 160,375,2,50); wall58.pushToArray();
let wall59 = new object("wall59", 160,400,80,2); wall59.pushToArray();
let wall60 = new object("wall60", 160,455,2,25); wall60.pushToArray();
let wall61 = new object("wall61", 160,295,2,55); wall61.pushToArray();
let wall62 = new object("wall62", 160,240,2,25); wall62.pushToArray();
let wall63 = new object("wall63", 135,320,25,2); wall63.pushToArray();


