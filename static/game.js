var socket = io();
var canvas = document.getElementById('canvas');
canvas.width = 640;
canvas.height = 640;
var context = canvas.getContext('2d');

const objects = [];
const roomsArray = [];

class room {
  constructor(roomnum, x, y){
    this.roomnum = roomnum;
    this.x = x;
    this.y = y;
    this.size = 80;
    this.visible = false;
  }
  pushRooms(){
    roomsArray.push(this);
  }
  buildRoom(){
    if(this.visible==false){
      context.beginPath();
      context.fillStyle = "#666260";
      context.rect(this.x, this.y, this.size, this.size);
      context.fill();
    }
  }
}

class object {
  constructor(name, x, y, width, height){
    this.name = name;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.position = "position";
  }
  pushToArray(){
    if(this.width > this.height){
      this.position = "horizontal"
    }else{
      this.position = "vertical"
    }
    objects.push(this);
  }
  build(){
    context.beginPath();
    context.fillStyle = "#442E27";
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
      case 116: //disablen van de f5 key zodat pagina hiermee niet gerefreshed kan worden.
        event.returnValue = false;
        event.keyCode = 0;
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

setInterval(function() {
  socket.emit('checkBullets', objects);
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
canvas.onclick = function(event){
  var values = getCursorPosition(canvas, event)
  var x = values[0];
  var y = values[1];
  var coords = "x" + x + "y" + y;
  console.log(coords);
  socket.emit('shoot-bullet', {x: 300, y: 300, speedY: 5, isHit: false, damage: 0},x,y);
}

//deze socket staat op een interval en wordt continu uitgevoerd om het spel te updaten
socket.on('state', function(players, bullets, itemboxes) {
  context.clearRect(0, 0, 640, 640);
  checkRoom(players, roomsArray);

  //update de kant waar de speler naartoe kijkt wanneer er met de muis over het canvas bewogen wordt.
  canvas.onmousemove = function(event){
    var player = players[socket.id];
    mouseX = parseInt(event.clientX - canvas.offsetLeft);
    mouseY = parseInt(event.clientY - canvas.offsetTop);
    var dx = mouseX - player.x;
    var dy = mouseY - player.y;
    var angle = Math.atan2(dy, dx);
    socket.emit("anglePush", angle);
  }

  //tekent de verschillende spelers op het canvas.
  for (var id in players) {
    var player = players[id]; 
    context.fillStyle = "#FFD49C";
    context.beginPath();        
    context.font = "20px Arial";
    if(player.hp > 0){
      context.arc(player.x, player.y, 10, 0, 2 * Math.PI);
      context.fill();
      context.fillStyle = player.color;
      context.beginPath(); 
      context.arc(player.x, player.y, 10, 1.3+player.angle, 1.8+player.angle + Math.PI);
    }    
    context.fill();  
  }

  //for loop die de kogels tekent op het canvas
  for (var id in bullets) {
    var bullet = bullets[id];
    context.beginPath();
    context.arc(bullet.x, bullet.y, 2, 0, 2 * Math.PI);
    context.fill();
  }

  //for loop die de itemboxes tekent op het canvas
  for(i=0; i<itemboxes.length; i++){
    context.beginPath();
    context.fillStyle = "00FF00";
    context.rect(itemboxes[i][0], itemboxes[i][1], itemboxes[i][2], itemboxes[i][3]);
    context.fill();
  }

  //for loop die de rooms tekent op het canvas
  for(i=0; i<roomsArray.length; i++){
    roomsArray[i].buildRoom();
  } 

  //for loop die de muren tekent op het canvas
  for(i=0; i<objects.length; i++){
    objects[i].build();
  }
});

var myname
socket.on('playerteam', function(player){
  console.log(player.name);
  myname=player.name;
})

function checkRoom(players, roomsArray){
  for (i=0; i<roomsArray.length; i++){
    for (var id in players){
      if (players[id].name==myname){
        if (players[id].x>roomsArray[i].x && players[id].x<roomsArray[i].x+roomsArray[i].size && players[id].y>roomsArray[i].y && players[id].y<roomsArray[i].y+roomsArray[i].size){
          for (j=0; j<roomsArray.length; j++){
            if (roomsArray[j].roomnum==roomsArray[i].roomnum){
              roomsArray[j].visible=true;
            }
            else{
              roomsArray[j].visible=false;
            }
          }   
        }
      } 
    }
    if (roomsArray[i].roomnum==19){
      roomsArray[i].visible=true;
    }
  }
}

/*let itemBox1 = new itemBox("itemBox1", 0, 0, 20, 25);
let itemBox2 = new itemBox("itemBox2", 0, 0, 20, 25);*/

//alle objecten die worden getekend.
let wall1 = new object("wall1", 160, 0, 2, 25); wall1.pushToArray();
let wall2 = new object("wall2", 160, 55, 2, 105); wall2.pushToArray();
let wall3 = new object("wall3", 0, 160, 25, 2); wall3.pushToArray();
let wall4 = new object("wall4", 55, 160, 105, 2); wall4.pushToArray();
let wall5 = new object("wall5", 162, 80, 78, 2); wall5.pushToArray();
let wall6 = new object("wall6", 240, 82, 2, 25); wall6.pushToArray();
let wall7 = new object("wall7", 240, 135, 2, 50); wall7.pushToArray();
let wall45 = new object("wall45", 80, 215, 2, 25); wall45.pushToArray();
let wall46 = new object("wall46", 80, 160, 2, 25); wall46.pushToArray();
let wall47 = new object("wall47", 240, 215, 2, 26); wall47.pushToArray();
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
let wall23 = new object("wall23", 480,162,2,25); wall23.pushToArray();
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

let box1 = new room(1, 0, 0); box1.pushRooms();
let box2 = new room(1, 80, 0); box2.pushRooms();
let box3 = new room(1, 80, 80); box3.pushRooms();
let box4 = new room(1, 0, 80); box4.pushRooms();
let box5 = new room(2, 160, 0); box5.pushRooms();
let box6 = new room(2, 240, 0); box6.pushRooms();
let box7 = new room(2, 240, 80); box7.pushRooms();
let box8 = new room(2, 320, 80); box8.pushRooms();
let box9 = new room(2, 320, 0); box9.pushRooms();
let box10 = new room(3, 400, 0); box10.pushRooms();
let box11 = new room(3, 400, 80); box11.pushRooms();
let box12 = new room(3, 480, 0); box12.pushRooms();
let box13 = new room(3, 480, 80); box13.pushRooms();
let box14 = new room(4, 560, 0); box14.pushRooms();
let box15 = new room(4, 560, 80); box15.pushRooms();
let box16 = new room(4, 560, 160); box16.pushRooms();
let box17 = new room(5, 560, 240); box17.pushRooms();
let box18 = new room(6, 480, 320); box18.pushRooms();
let box19 = new room(6, 560, 320); box19.pushRooms();
let box20 = new room(6, 560, 400); box20.pushRooms();
let box21 = new room(7, 480, 160); box21.pushRooms();
let box22 = new room(7, 480, 240); box22.pushRooms();
let box23 = new room(8, 400, 160); box23.pushRooms();
let box24 = new room(9, 480, 400); box24.pushRooms();
let box25 = new room(9, 400, 400); box25.pushRooms();
let box26 = new room(9, 400, 480); box26.pushRooms();
let box27 = new room(10, 480, 480); box27.pushRooms();
let box28 = new room(10, 480, 560); box28.pushRooms();
let box29 = new room(10, 560, 560); box29.pushRooms();
let box30 = new room(10, 560, 480); box30.pushRooms();
let box31 = new room(11, 400, 560); box31.pushRooms();
let box32 = new room(11, 240, 560); box32.pushRooms();
let box33 = new room(11, 240, 480); box33.pushRooms();
let box34 = new room(11, 320, 480); box34.pushRooms();
let box35 = new room(11, 320, 560); box35.pushRooms();
let box36 = new room(12, 80, 480); box36.pushRooms();
let box37 = new room(12, 80, 560); box37.pushRooms();
let box38 = new room(12, 160, 480); box38.pushRooms();
let box39 = new room(12, 160, 560); box39.pushRooms();
let box40 = new room(13, 0, 400); box40.pushRooms();
let box41 = new room(13, 0, 480); box41.pushRooms();
let box42 = new room(13, 0, 560); box42.pushRooms();
let box43 = new room(14, 160, 400); box43.pushRooms();
let box44 = new room(15, 80, 400); box44.pushRooms();
let box45 = new room(15, 80, 320); box45.pushRooms();
let box46 = new room(16, 0, 320); box46.pushRooms();
let box47 = new room(17, 0, 160); box47.pushRooms();
let box48 = new room(17, 0, 240); box48.pushRooms();
let box49 = new room(17, 80, 240); box49.pushRooms();
let box50 = new room(18, 80, 160); box50.pushRooms();
let box51 = new room(18, 160, 80); box51.pushRooms();
let box52 = new room(18, 160, 160); box52.pushRooms();
let box53 = new room(19, 240, 160); box53.pushRooms();
let box54 = new room(19, 320, 160); box54.pushRooms();
let box55 = new room(19, 160, 240); box55.pushRooms();
let box56 = new room(19, 240, 240); box56.pushRooms();
let box57 = new room(19, 320, 240); box57.pushRooms();
let box58 = new room(19, 400, 240); box58.pushRooms();
let box59 = new room(19, 160, 320); box59.pushRooms();
let box60 = new room(19, 240, 320); box60.pushRooms();
let box61 = new room(19, 320, 320); box61.pushRooms();
let box62 = new room(19, 400, 320); box62.pushRooms();
let box63 = new room(19, 240, 400); box63.pushRooms();
let box64 = new room(19, 320, 400); box64.pushRooms();
