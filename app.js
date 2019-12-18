const express = require('express');
const mongoose = require('mongoose');
const app = express();
const passport = require('passport');
const flash = require('connect-flash');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var players = {};
const playersInLobby = [];
const bullets = [];
var typeplayers = ["militant", "grenadier", "guerrilla", "observer", "vigilante" ,"breacher", "separatist", "charger" ];
var teamconfig = [];
require('dotenv').config();

app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

mongoose.connect('mongodb://localhost:27017/mmodb');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('connected');
});

app.use(session({secret : 'mmosecretnodekey',
  resave: false,
  saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./config/passport')(passport);
require('./routes/index')(app,passport);
io.on('connection', function(socket) {
});

io.on('connection', function(socket) {
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
app.use(express.static(__dirname + '/views'));

app.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})

function checkGameStarted(req, res, next){
  if(req.gameStarted()){
    return res.redirect('/index.ejs')
  }
}

var path = require('path');
var server = http;

app.set('port', 3000);
app.use('/static', express.static(__dirname + '/static'));

// Routing
app.get('/views/', function(request, response) {
  response.sendFile(path.join(__dirname, 'index.ejs'));
});

 class character {
    constructor(id, name, score){
        this.name = name;
        this.score = 0;
    }

    //Methode om score te getten

}

//rebels subclass welke erft van character class.
class rebels extends character {
    constructor(id, name, teamscore ,score, color, teamname){
        super(id, name, score)
        this.teamscore = 0;
        this.color = "red";
        this.teamname = "rebels";
    }
}
        //rebels 1
        class militant extends rebels {
            constructor(id,name, hp, score, x, y, weapondamage, teamscore, color, teamname){
                super(id, name, teamscore, score, color, teamname)
                this.hp = 150;
                this.x = 100;
                this.y = 100;
                this.weapondamage = 20;
            }
        }
        //rebels 2
        class guerrilla extends rebels {
             constructor(id,name, hp, score, x, y, weapondamage, teamscore, color, teamname){
                super(id, name, teamscore, score, color, teamname)
                this.hp = 100;
                this.x = 130;
                this.y = 100;
                this.weapondamage = 20;
            }        }
        //rebels 3
        class vigilante extends rebels {
             constructor(id,name, hp, score, x, y, weapondamage, teamscore, color, teamname){
                super(id, name, teamscore, score, color, teamname)
                this.hp = 200;
                this.x = 100;
                this.y = 130;
                this.weapondamage = 40;
            }        }
        //rebels 4
        class separatist extends rebels {
             constructor(id,name, hp, score, x, y, weapondamage, teamscore, color, teamname){
                super(id, name, teamscore, score, color, teamname)
                this.hp = 240;
                this.x = 130;
                this.y = 130;
                this.weapondamage = 20;
            }        }


//swat subclass welke erft van character class.
class swat extends character {
    constructor(id, name, teamscore, score, color, teamname){
        super(id, name, score)
        this.teamscore = 0;
        this.color = "blue";
        this.teamname = "swat";
    }
        
}
        //swat 1
        class grenadier extends swat {
            constructor(id,name, hp, score, x, y, weapondamage, teamscore, color, teamname){
                super(id, name, teamscore, score, color, teamname)
                this.hp = 150;
                this.x = 500;
                this.y = 500;
                this.weapondamage = 20;
            }
    
        }
        //swat 2
        class breacher extends swat {
           constructor(id,name, hp, score, x, y, weapondamage, teamscore, color, teamname){
                super(id, name, teamscore, score, color, teamname)
                this.hp = 200;
                this.x = 530;
                this.y = 500;
                this.weapondamage = 40;
            }
        }
        //swat 3
        class observer extends swat {
            constructor(id,name, hp, score, x, y, weapondamage, teamscore, color, teamname){
                super(id, name, teamscore, score, color, teamname)
                this.hp = 100;
                this.x = 500;
                this.y = 530;
                this.weapondamage = 20;
            }        }
        //swat 4
        class charger extends swat {
            constructor(id,name, hp, score, x, y, weapondamage, teamscore, color, teamname){
                super(id, name, teamscore, score, color, teamname)
                this.hp = 240;
                this.x = 530;
                this.y = 530;
                this.weapondamage = 20;
            }        }
   
  
  //creates a new player
  socket.on('new player', function( playertype, name) {

if(playertype == "militant"){players[socket.id] = new militant(socket.id, name)}
else if(playertype == "guerrilla"){players[socket.id] = new guerrilla(socket.id, name)}
else if(playertype == "vigilante"){players[socket.id] = new vigilante(socket.id, name)}
else if(playertype == "seperatist"){players[socket.id] = new seperatist(socket.id, name)}
else if(playertype == "grenadier"){players[socket.id] = new grenadier(socket.id, name)}
else if(playertype == "breacher"){players[socket.id] = new breacher(socket.id, name)}
else if(playertype == "observer"){players[socket.id] = new observer(socket.id, name)}
else if(playertype == "charger"){players[socket.id] = new charger(socket.id, name)}
  });
    
  function randomFunc(myArr) {      
            var l = myArr.length, temp, index;  
            while (l > 0) {  
               index = Math.floor(Math.random() * l);  
               l--;  
               temp = myArr[l];          
               myArr[l] = myArr[index];          
               myArr[index] = temp;      
            }    
            return myArr;    
         }     

socket.on('startGameServer', function(){
    hussledArray = randomFunc(playersInLobby)     
    teamconfig =  typeplayers.reduce(function(teamconfig, field, index) {
      teamconfig[hussledArray[index]] = field;
      return teamconfig;
    }, {})

    if(playersInLobby.length > 1){
      io.emit('startGame');
      playersInLobby.length = 0;
    }
  });

  socket.on('teamconfig', function(){
     io.emit('teamconfigReturn', teamconfig);
  });
  

  socket.on('connectedPeopleLobby', function(){
    var amountOfPlayers = playersInLobby.length;
    io.emit('connectedPeopleLobbyReturn', amountOfPlayers);
  });

  socket.on('playerLobby', function(playername, joined){
    var playerAlreadyInLobby = false;

    for(i=0; i<playersInLobby.length; i++){
      if(playersInLobby[i] == playername){
        playerAlreadyInLobby = true;
      }
    }
    if(joined == 'true'){
      if(playerAlreadyInLobby == true){
        return console.log('you are already in the lobby!');
      }else{
        playersInLobby.push(playername);
        io.emit('playerLobbies', playersInLobby);
      }
    }
    else if(joined == 'false'){
      io.emit('playerLobbies', playersInLobby);
    }
  });
  
  socket.on('disconnect', function(){
    delete players[socket.id];
  });

  socket.on('leaveGame', function(){
    delete players[socket.id];
  });

  socket.on('movement', function(data, objectArray) {
    var player = players[socket.id] || {};

    if(player.hp == 0){
      player.x = -30
      player.y = -30
    }

    if (data.left && player.x>=10 && checkCollisionLeft(player, objectArray) == false) {
      if(data.up || data.down){
        player.x-=1.41
      } else {
        player.x -= 2;
      }
    }
    if (data.up && player.y>=10 && checkCollisionUp(player, objectArray) == false) {
      if(data.left || data.right){
        player.y-=1.41}
        else{
        player.y -= 2;
        }
    }
    if (data.right && player.x<=630 && checkCollisionRight(player, objectArray) == false) {
      if(data.up || data.down){
        player.x+=1.41}
        else{
        player.x += 2;
        }
    }
    if (data.down && player.y<=630 && checkCollisionDown(player, objectArray) == false) {
      if(data.left || data.right){
        player.y+=1.41}
        else{
        player.y += 2;
        }
    }
  });
//Maakt aan de hand van de meegegeven gegevens een bullet en stopt deze in een array.
  socket.on('shoot-bullet', function(data, targetX, targetY){
    var player = players[socket.id] || {};
    if(players[socket.id] == undefined) return;
    var newBullet = data;
    if(targetX > player.x){
      newBullet.x = player.x + 11
    }
    if(targetX < player.x){
      newBullet.x = player.x - 11
    }
    if(targetY > player.y){
      newBullet.y = player.y + 11
    }      
    if(targetY < player.y){
      newBullet.y = player.y - 11
    }
    newBullet.targetX = targetX;
    newBullet.targetY = targetY;
    var bulletSpeed = calculateBulletSpeed(newBullet);
    newBullet.xSpeed = bulletSpeed[0];
    newBullet.ySpeed = bulletSpeed[1];
    bullets.push(newBullet);
  })

  socket.on('checkBullets', function(objectArray){
    var player = players[socket.id] || {};
    for(var i = 0; i < bullets.length; i++){
       var bullet = bullets[i]
       if(bullet.x >= player.x - 10 && bullet.x <= player.x + 10 && bullet.y >= player.y - 10 && bullet.y <= player.y + 10){
         player.hp -= 10;
         bullet.isHit = true
        }

       if(bullet.x >= 0 && bullet.x <= 640 && checkCollisionLeft(bullet, objectArray) == false && checkCollisionRight(bullet, objectArray) == false){
        bullet.x += bullet.xSpeed
       }
       else {
        bullet.x = -10
      }

      if(bullet.y >= 0 && bullet.y <= 640 && checkCollisionUp(bullet, objectArray) == false && checkCollisionDown(bullet, objectArray) == false){
        bullet.y += bullet.ySpeed
      }
      else {
        bullet.y = -10
      }
     }
   })
});

setInterval(function() {
  io.sockets.emit('state', players, bullets);
}, 1000 / 60);

http.listen(3000, function(){
  console.log('listening on *:3000');
});

function checkCollisionRight(player, objectArray){
  for(i=0; i<objectArray.length; i++){
    if(objectArray[i].position == "vertical"){
      if(player.x + 10 >= objectArray[i].x && player.x + 10 <= objectArray[i].x + objectArray[i].width){
        if(player.y - 10 <= objectArray[i].y && player.y + 10 >= objectArray[i].y + objectArray[i].height || player.y - 10 >= objectArray[i].y && player.y + 10 <= objectArray[i].y + objectArray[i].height){
          console.log(111);
          return true;
        }
        else if(player.y - 10 >= objectArray[i].y && player.y - 10 <= objectArray[i].y + objectArray[i].height || player.y + 9 >= objectArray[i].y && player.y + 9 <= objectArray[i].y + objectArray[i].height){
          console.log(111);
          return true;
        }
      }
    }
  }
  return false;
}
function checkCollisionDown(player, objectArray){
  for(i=0; i<objectArray.length; i++){
    if(objectArray[i].position == "horizontal"){
      if(player.y + 10 >= objectArray[i].y && player.y + 10 <= objectArray[i].y + objectArray[i].height){
        if(player.x - 10 <= objectArray[i].x && player.x + 10 >= objectArray[i].x + objectArray[i].width || player.x - 10 >= objectArray[i].x && player.x + 10 <= objectArray[i].x + objectArray[i].width){
          console.log(222);
          return true;
        }
        else if(player.x - 10 >= objectArray[i].x && player.x - 10 <= objectArray[i].x + objectArray[i].width || player.x + 9 >= objectArray[i].x && player.x + 9 <= objectArray[i].x + objectArray[i].width){
          console.log(222);
          return true;
        }
      }
    }
  }
  return false;
}
function checkCollisionLeft(player, objectArray){
  for(i=0; i<objectArray.length; i++){
    if(objectArray[i].position == "vertical"){
      if(player.x - 10 >= objectArray[i].x && player.x - 10 <= objectArray[i].x + objectArray[i].width){
        if(player.y - 10 >= objectArray[i].y && player.y + 10 <= objectArray[i].y + objectArray[i].height || player.y - 10 <= objectArray[i].y && player.y + 10 >= objectArray[i].y + objectArray[i].height){
          console.log(333);
          return true;
        }
        else if(player.y - 10 >= objectArray[i].y && player.y - 10 <= objectArray[i].y + objectArray[i].height || player.y + 9 >= objectArray[i].y && player.y + 9 <= objectArray[i].y + objectArray[i].height){
          console.log(333);
          return true;
        }
      }
    }
  }
  return false;
}
function checkCollisionUp(player, objectArray){
  for(i=0; i<objectArray.length; i++){
    if(objectArray[i].position == "horizontal"){   
      if(player.y - 10 >= objectArray[i].y && player.y - 10 <= objectArray[i].y + objectArray[i].height){
        if(player.x - 10 <= objectArray[i].x && player.x + 10 >= objectArray[i].x + objectArray[i].width || player.x - 10 >= objectArray[i].x && player.x + 10 <= objectArray[i].x + objectArray[i].width){
          console.log(444);
          return true;
        }
        else if(player.x - 10 >= objectArray[i].x && player.x - 10 <= objectArray[i].x + objectArray[i].width || player.x + 9 >= objectArray[i].x && player.x + 9 <= objectArray[i].x + objectArray[i].width){
          console.log(444);
          return true;
        }
      }
    }
  }
  return false;
}

function calculateBulletSpeed(bullet){
    var vx = bullet.targetX - bullet.x
    var vy = bullet.targetY - bullet.y
    var dist = Math.sqrt(vx * vx + vy * vy)
    var dx = vx / dist
    var dy = vy / dist
    dx *= 3
    dy *= 3  
  return [dx, dy]
}

function serverGameLoop(){

  for( var i = bullets.length - 1; i >= 0; i--){
    if(bullets[i].x === -10 || bullets[i].y === -10 || bullets[i].isHit === true){
      bullets.splice(i,1);
    } 
  }
}

setInterval(serverGameLoop, 16);