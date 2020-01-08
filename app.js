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
    constructor(id, name, score, angle){
        this.name = name;
        this.score = 0;
        this.angle = 0;
    }

    endGame(){
      for(var id in players){
        var player = players[id];
          if(player.teamname == "swat"){
            var swatCount =+ 1;
          }
          else if(player.teamname == 'rebels'){
            var rebelsCount =+ 1;
          }
      }
      return swatCount, rebelsCount; 
    } 
  

    calculateWinner(){
      if(swat.teamscore >= rebels.teamscore){
        return "The SWAT unit has won the match with " + swat.teamscore + " kills & " + rebels.teamscore + " deaths.";
      }
      else if(rebels.teamscore >= swat.teamscore){
        return "The rebel unit has won the match with " + rebels.teamscore + " kills & " + swat.teamscore + " deaths.";
      }
    }
  }


//rebels subclass welke erft van character class.
class rebels extends character {
    constructor(id, name, teamscore ,score, color, teamname, win, angle){
        super(id, name, score, angle)
        this.teamscore = 0;
        this.color = "red";
        this.teamname = "rebels";
        this.win = 0;
    }
      setTeamScore(){
        this.teamscore = militant.score + guerrilla.score + vigilante.score + separatist.score;
      }

      getTeamScore(){
        return this.teamscore;
      }
}
        //rebels 1
        class militant extends rebels {
            constructor(id,name, hp, score, x, y, weapondamage, teamscore, color, teamname, isDead, ammo, classname, win, angle){
                super(id, name, teamscore, score, color, teamname, win, angle)
                this.hp = 150;
                this.x = 100;
                this.y = 100;
                this.weapondamage = 20;
                this.isDead = false;
                this.score = 0;
                this.ammo = 100;
                this.classname = "Militant";
            }
        }
        //rebels 2
        class guerrilla extends rebels {
             constructor(id,name, hp, score, x, y, weapondamage, teamscore, color, teamname, isDead, ammo, classname, win, angle){
                super(id, name, teamscore, score, color, teamname, win, angle)
                this.hp = 100;
                this.x = 130;
                this.y = 100;
                this.weapondamage = 20;
                this.isDead = false;
                this.score = 0;
                this.ammo = 100;
                this.classname = "Guerrilla";
            }        }
        //rebels 3
        class vigilante extends rebels {
             constructor(id,name, hp, score, x, y, weapondamage, teamscore, color, teamname, isDead, ammo, classname, win, angle){
                super(id, name, teamscore, score, color, teamname, win, angle)
                this.hp = 200;
                this.x = 100;
                this.y = 130;
                this.weapondamage = 40;
                this.isDead = false;
                this.score = 0;
                this.ammo = 100;
                this.classname = "Vigilante";
            }        }
        //rebels 4
        class separatist extends rebels {
             constructor(id,name, hp, score, x, y, weapondamage, teamscore, color, teamname, isDead, ammo, classname, win, angle){
                super(id, name, teamscore, score, color, teamname, win, angle)
                this.hp = 240;
                this.x = 130;
                this.y = 130;
                this.weapondamage = 20;
                this.isDead = false;
                this.score = 0;
                this.ammo = 100;
                this.classname = "Separatist"; 
            }        }

//swat subclass welke erft van character class.
class swat extends character {
    constructor(id, name, teamscore, score, color, teamname, win, angle){
        super(id, name, score, angle)
        this.teamscore = 0;
        this.color = "blue";
        this.teamname = "swat";
        this.win = 0;
    }
      setTeamScore(){
       this.teamscore = militant.score + guerrilla.score + vigilante.score + separatist.score;
      }

      getTeamScore(){
       return this.teamscore;
      }
        
}
        //swat 1
        class grenadier extends swat {
            constructor(id,name, hp, score, x, y, weapondamage, teamscore, color, teamname, isDead, ammo, classname, win, angle){
                super(id, name, teamscore, score, color, teamname, win, angle)
                this.hp = 150;
                this.x = 500;
                this.y = 500;
                this.weapondamage = 20;
                this.isDead = false;
                this.score = 0;
                this.ammo = 100;
                this.classname = "Grenadier";
            }
    
        }
        //swat 2
        class breacher extends swat {
           constructor(id,name, hp, score, x, y, weapondamage, teamscore, color, teamname, isDead, ammo, classname, win, angle){
                super(id, name, teamscore, score, color, teamname, win, angle)
                this.hp = 200;
                this.x = 530;
                this.y = 500;
                this.weapondamage = 40;
                this.isDead = false;
                this.score = 0;
                this.ammo = 100;
               this.classname = "Breacher";
            }
        }
        //swat 3
        class observer extends swat {
            constructor(id,name, hp, score, x, y, weapondamage, teamscore, color, teamname, isDead, ammo, classname, win, angle){
                super(id, name, teamscore, score, color, teamname, win, angle)
                this.hp = 100;
                this.x = 500;
                this.y = 530;
                this.weapondamage = 20;
                this.isDead = false;
                this.score = 0;
                this.ammo = 100;
                this.classname = "Observer";
            }        }
        //swat 4
        class charger extends swat {
            constructor(id,name, hp, score, x, y, weapondamage, teamscore, color, teamname, isDead, ammo, classname, win, angle){
                super(id, name, teamscore, score, color, teamname, win, angle)
                this.hp = 240;
                this.x = 530;
                this.y = 530;
                this.weapondamage = 20;
                this.isDead = false;
                this.score = 0;
                this.ammo = 100;
                this.classname = "Charger";
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
  socket.emit('playerteam', players[socket.id]);
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

  socket.on("anglePush", function(angle){
    var player = players[socket.id] || {};
    player.angle = angle;
  });

  socket.on('movement', function(data, objectArray) {
    var player = players[socket.id] || {};

    if(player.hp <= 0){
      player.x = -30
      player.y = -30
      player.isDead = true
    }

    if (data.left && player.x>=10 && checkCollisionLeft(player, players, objectArray, 9) == false ) {
      if(data.up || data.down){
        player.x-=1.41
      } else {
        player.x -= 2;
      }
    }
    if (data.up && player.y>=1 && checkCollisionUp(player, players, objectArray, 9) == false) {
      if(data.left || data.right){
        player.y-=1.41}
        else{
        player.y -= 2;
        }
    }
    if (data.right && player.x<=630 && checkCollisionRight(player, players, objectArray, 9) == false) {
      if(data.up || data.down){
        player.x+=1.41}
        else{
        player.x += 2;
        }
    }
    if (data.down && player.y<=630 && checkCollisionDown(player, players, objectArray, 9) == false) {
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
    player.ammo -= 1
    var newBullet = data;
    if(targetX > player.x){
      newBullet.x = player.x //+ 11
    }
    if(targetX < player.x){
      newBullet.x = player.x //- 11
    }
    if(targetY > player.y){
      newBullet.y = player.y //+ 11
    }      
    if(targetY < player.y){
      newBullet.y = player.y //- 11
    }
    newBullet.targetX = targetX;
    newBullet.targetY = targetY;
    newBullet.comesFrom = player.name;
    newBullet.damage = player.weapondamage
    var bulletSpeed = calculateBulletSpeed(newBullet);
    newBullet.xSpeed = bulletSpeed[0];
    newBullet.ySpeed = bulletSpeed[1];
    bullets.push(newBullet);
    socket.emit('updatedAmmo', player.ammo);
  })

  function addKiller(naam, bullets){
    for (var id in players) {
      var player = players[id];
    var killer1 = naam
    if(player.name == killer1){
      player.score += 1
      player.ammo += bullets
      //console.log(player.name + " heeft " + player.score +  " kill")
    }
  }  
  }
  socket.on('checkBullets', function(objectArray){
    var player = players[socket.id] || {};
    for(var i = 0; i < bullets.length; i++){
       var bullet = bullets[i]
       var killer;
       if(bullet.x >= player.x - 10 && bullet.x <= player.x + 10 && bullet.y >= player.y - 10 && bullet.y <= player.y + 10 && bullet.comesFrom != player.name){
         player.hp -= bullet.damage;
         socket.emit("updatedHP", player.hp);
          if(player.hp <= 0){
            var lostBullets = player.ammo
            killer = bullet.comesFrom
            addKiller(killer, lostBullets)          
          }
         bullet.isHit = true
        }

       if(bullet.x >= 0 && bullet.x <= 640 && checkCollisionLeft(bullet, {}, objectArray, 2) == false && checkCollisionRight(bullet, {}, objectArray, 2) == false){
        bullet.x += bullet.xSpeed
       }
       else {
        bullet.x = -10
      }

      if(bullet.y >= 0 && bullet.y <= 640 && checkCollisionUp(bullet, {}, objectArray, 2) == false && checkCollisionDown(bullet, {}, objectArray, 2) == false){
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

function checkCollisionRight(player, playerArray, objectArray, radius){
  for(i=0; i<objectArray.length; i++){
    if(objectArray[i].position == "vertical"){
      if(player.x + radius >= objectArray[i].x && player.x + radius <= objectArray[i].x + objectArray[i].width){
        if(player.y - radius <= objectArray[i].y && player.y + radius >= objectArray[i].y + objectArray[i].height || player.y - radius >= objectArray[i].y && player.y + radius <= objectArray[i].y + objectArray[i].height){ 
          return true;
        }
        else if(player.y - radius >= objectArray[i].y && player.y - radius <= objectArray[i].y + objectArray[i].height || player.y + radius >= objectArray[i].y && player.y + radius <= objectArray[i].y + objectArray[i].height){
          return true;
        }
      }
    }
  }
  for(var id in playerArray){
    var otherPlayer = playerArray[id];
    if(otherPlayer.name == player.name){
    }
    else if(player.x + radius >= otherPlayer.x - radius && player.x + radius <= otherPlayer.x + radius){
      if(player.y - radius <= otherPlayer.y + radius && player.y - radius >= otherPlayer.y - radius || player.y + radius >= otherPlayer.y - radius && player.y + radius <= otherPlayer.y + radius){
        return true;
      }
    }
  }
  return false;
}
function checkCollisionDown(player, playerArray, objectArray, radius){
  for(i=0; i<objectArray.length; i++){
    if(objectArray[i].position == "horizontal"){
      if(player.y + radius >= objectArray[i].y && player.y + radius <= objectArray[i].y + objectArray[i].height){
        if(player.x - radius <= objectArray[i].x && player.x + radius >= objectArray[i].x + objectArray[i].width || player.x - radius >= objectArray[i].x && player.x + radius <= objectArray[i].x + objectArray[i].width){
          return true;
        }
        else if(player.x - radius >= objectArray[i].x && player.x - radius <= objectArray[i].x + objectArray[i].width || player.x + radius >= objectArray[i].x && player.x + radius <= objectArray[i].x + objectArray[i].width){
          return true;
        }
      }
    }
  }
  for(var id in playerArray){
    var otherPlayer = playerArray[id];
    if(otherPlayer.name == player.name){
    }
    else if(player.y + radius >= otherPlayer.y - radius && player.y + radius <= otherPlayer.y + radius){
      if(player.x - radius <= otherPlayer.x + radius && player.x - radius >= otherPlayer.x - radius || player.x + radius >= otherPlayer.x - radius && player.x + radius <= otherPlayer.x + radius){
        return true;
      }
    }
  }
  return false;
}
function checkCollisionLeft(player, playerArray, objectArray, radius){
  for(i=0; i<objectArray.length; i++){
    if(objectArray[i].position == "vertical"){
      if(player.x - radius >= objectArray[i].x && player.x - radius <= objectArray[i].x + objectArray[i].width){
        if(player.y - radius >= objectArray[i].y && player.y + radius <= objectArray[i].y + objectArray[i].height || player.y - radius <= objectArray[i].y && player.y + radius >= objectArray[i].y + objectArray[i].height){
          return true;
        }
        else if(player.y - radius >= objectArray[i].y && player.y - radius <= objectArray[i].y + objectArray[i].height || player.y + radius >= objectArray[i].y && player.y + radius <= objectArray[i].y + objectArray[i].height){
          return true;
        }
      }
    }
  }
  for(var id in playerArray){
    var otherPlayer = playerArray[id];
    if(otherPlayer.name == player.name){
    }
    else if(player.x - radius <= otherPlayer.x + radius && player.x - radius >= otherPlayer.x - radius){
      if(player.y - radius <= otherPlayer.y + radius && player.y - radius >= otherPlayer.y - radius || player.y + radius >= otherPlayer.y - radius && player.y + radius <= otherPlayer.y + radius){
        return true;
      }
    }
  }
  return false;
}
function checkCollisionUp(player, playerArray, objectArray, radius){
  for(i=0; i<objectArray.length; i++){
    if(objectArray[i].position == "horizontal"){   
      if(player.y - radius >= objectArray[i].y && player.y - radius <= objectArray[i].y + objectArray[i].height){
        if(player.x - radius <= objectArray[i].x && player.x + radius >= objectArray[i].x + objectArray[i].width || player.x - radius >= objectArray[i].x && player.x + radius <= objectArray[i].x + objectArray[i].width){
          return true;
        }
        else if(player.x - radius >= objectArray[i].x && player.x - radius <= objectArray[i].x + objectArray[i].width || player.x + radius >= objectArray[i].x && player.x + radius <= objectArray[i].x + objectArray[i].width){
          return true;
        }
      }
    }
  }
  for(var id in playerArray){
    var otherPlayer = playerArray[id];
    if(otherPlayer.name == player.name){
    }
    else if(player.y - radius <= otherPlayer.y + radius && player.y - radius >= otherPlayer.y - radius){
      if(player.x - radius <= otherPlayer.x + radius && player.x - radius >= otherPlayer.x - radius || player.x + radius >= otherPlayer.x - radius && player.x + radius <= otherPlayer.x + radius){
        return true;
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

