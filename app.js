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
const itemboxes = [];
const bullets = [];
var swatCount = 0;
var rebelsCount = 0 ;
var rebelscore =0;
var swatscore = 0;
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
        this.id = id;
        this.name = name;
        this.score = 0;
        this.angle = 0;
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

}
        //rebels 1
        class militant extends rebels {
            constructor(id,name, hp, score, x, y, weapondamage, teamscore, color, teamname, isDead, maxAmmo, currentAmmo, classname, win, angle){
                super(id, name, teamscore, score, color, teamname, win, angle)
                this.hp = 150;
                this.x = 100;
                this.y = 100;
                this.weapondamage = 20;
                this.isDead = false;
                this.score = 0;
                this.maxAmmo = 20;
                this.currentAmmo = 20;
                this.classname = "Militant";
            }
        }
        //rebels 2
        class guerrilla extends rebels {
             constructor(id,name, hp, score, x, y, weapondamage, teamscore, color, teamname, isDead, maxAmmo, currentAmmo, classname, win, angle){
                super(id, name, teamscore, score, color, teamname, win, angle)
                this.hp = 100;
                this.x = 130;
                this.y = 100;
                this.weapondamage = 20;
                this.isDead = false;
                this.score = 0;
                this.maxAmmo = 20;
                this.currentAmmo = 20;
                this.classname = "Guerrilla";
            }        }
        //rebels 3
        class vigilante extends rebels {
             constructor(id,name, hp, score, x, y, weapondamage, teamscore, color, teamname, isDead, maxAmmo, currentAmmo, classname, win, angle){
                super(id, name, teamscore, score, color, teamname, win, angle)
                this.hp = 200;
                this.x = 100;
                this.y = 130;
                this.weapondamage = 40;
                this.isDead = false;
                this.score = 0;
                this.maxAmmo = 20;
                this.currentAmmo = 20;
                this.classname = "Vigilante";
            }        }
        //rebels 4
        class separatist extends rebels {
             constructor(id,name, hp, score, x, y, weapondamage, teamscore, color, teamname, isDead, maxAmmo, currentAmmo, classname, win, angle){
                super(id, name, teamscore, score, color, teamname, win, angle)
                this.hp = 240;
                this.x = 130;
                this.y = 130;
                this.weapondamage = 20;
                this.isDead = false;
                this.score = 0;
                this.maxAmmo = 20;
                this.currentAmmo = 20;
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
     
}
        //swat 1
        class grenadier extends swat {
            constructor(id,name, hp, score, x, y, weapondamage, teamscore, color, teamname, isDead, maxAmmo, currentAmmo, classname, win, angle){
                super(id, name, teamscore, score, color, teamname, win, angle)
                this.hp = 150;
                this.x = 500;
                this.y = 500;
                this.weapondamage = 20;
                this.isDead = false;
                this.score = 0;
                this.maxAmmo = 20;
                this.currentAmmo = 20;
                this.classname = "Grenadier";
            }
    
        }
        //swat 2
        class breacher extends swat {
           constructor(id,name, hp, score, x, y, weapondamage, teamscore, color, teamname, isDead, maxAmmo, currentAmmo, classname, win, angle){
                super(id, name, teamscore, score, color, teamname, win, angle)
                this.hp = 200;
                this.x = 530;
                this.y = 500;
                this.weapondamage = 40;
                this.isDead = false;
                this.score = 0;
                this.maxAmmo = 20;
                this.currentAmmo = 20;
               this.classname = "Breacher";
            }
        }
        //swat 3
        class observer extends swat {
            constructor(id,name, hp, score, x, y, weapondamage, teamscore, color, teamname, isDead, maxAmmo, currentAmmo, classname, win, angle){
                super(id, name, teamscore, score, color, teamname, win, angle)
                this.hp = 100;
                this.x = 500;
                this.y = 530;
                this.weapondamage = 20;
                this.isDead = false;
                this.score = 0;
                this.maxAmmo = 20;
                this.currentAmmo = 20;
                this.classname = "Observer";
            }        }
        //swat 4
        class charger extends swat {
            constructor(id,name, hp, score, x, y, weapondamage, teamscore, color, teamname, isDead, maxAmmo, currentAmmo, classname, win, angle){
                super(id, name, teamscore, score, color, teamname, win, angle)
                this.hp = 240;
                this.x = 530;
                this.y = 530;
                this.weapondamage = 20;
                this.isDead = false;
                this.score = 0;
                this.maxAmmo = 20;
                this.currentAmmo = 20;
                this.classname = "Charger";
                
                
            } 

        }
   
   
  
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
  endGame();
  console.log("swat " + swatCount);
  console.log("rebels " + rebelsCount);
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

   function calculateWinner(){  
    if(swatscore  >= rebelsCount){
       // return "The SWAT unit has won the match with " + swatscore + " kills & " + rebelsCount + " deaths.";
     updateHighscore()
     
     swatCount = 0;
     rebelsCount = 0;
     swatscore = 0;
     rebelscore = 0;
     itemboxes.length = 0;
//     $(function () {
//     location.assign('/highscore');
//      });
          io.emit('endOfGame');
      }
      else if(rebelscore >= swatCount){
       // return "The rebel unit has won the match with " + rebelscore + " kills & " + swatCount + " deaths.";
     updateHighscore()
     swatCount = 0;
     rebelsCount = 0;
     swatscore = 0;
     rebelscore = 0;
     itemboxes.length = 0;
//     $(function () {
//     location.assign('/highscore');
//      });
          io.emit('endOfGame');    
      }
    }
//  }
   

      
function endGame(){
     swatCount = 0;
     rebelsCount = 0;
      for(var id in players){
        var player = players[id];
          if(player.teamname == "swat"){
            swatCount += 1;
          }
          else if(player.teamname == 'rebels'){
            rebelsCount += 1;
          }
      }
     ("swat" + rebelsCount)
     console.log("rebels" + swatCount)
      return swatCount, rebelsCount; 
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
    boxPlacement(null);
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
    endGame()
  });

  socket.on('leaveGame', function(){
    delete players[socket.id];
    endGame()
      
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
      calculateWinner()

    }

    if (data.left && player.x>=10 && checkCollisionLeft(player, players, objectArray, 9) == false ) {
      var packageValues = checkCollisionPackageLeft(player, itemboxes , 9);
      var packageCollision = packageValues[0];
      var packageData = packageValues[1];
      if(packageCollision == true){
        calculateAmmo(player, packageData[4]);
        boxPlacement(packageData);
      }
      if(data.up || data.down){
        player.x-=1.41
      } else {
        player.x -= 2;
      }
    }
    if (data.up && player.y>=1 && checkCollisionUp(player, players, objectArray, 9) == false) {
      var packageValues = checkCollisionPackageUp(player, itemboxes , 9);
      var packageCollision = packageValues[0];
      var packageData = packageValues[1];
      if(packageCollision == true){
        calculateAmmo(player, packageData[4]);
        boxPlacement(packageData);
      }
      if(data.left || data.right){
        player.y-=1.41}
        else{
        player.y -= 2;
        }
    }
    if (data.right && player.x<=630 && checkCollisionRight(player, players, objectArray, 9) == false) {
      var packageValues = checkCollisionPackageRight(player, itemboxes , 9);
      var packageCollision = packageValues[0];
      var packageData = packageValues[1];
      if(packageCollision == true){
        calculateAmmo(player, packageData[4]);
        boxPlacement(packageData);
      }
      if(data.up || data.down){
        player.x+=1.41}
        else{
        player.x += 2;
        }
    }
    if (data.down && player.y<=630 && checkCollisionDown(player, players, objectArray, 9) == false) {
      var packageValues = checkCollisionPackageDown(player, itemboxes , 9);
      var packageCollision = packageValues[0];
      var packageData = packageValues[1];
      if(packageCollision == true){
        calculateAmmo(player, packageData[4]);
        boxPlacement(packageData);
      }
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

    if(player.currentAmmo > 0){
      player.currentAmmo -= 1
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
      socket.emit('updatedAmmo', player.currentAmmo);
    }
  })

  function addKiller(naam, bullets){
    for (var id in players) {
      var player = players[id];
      var killer1 = naam
      if(player.name == killer1){ 
        player.score += 1
        if(player.teamname = "swat"){
          swatscore +=1;          
        }else{
          rebelscore +=1;
        }
        calculateAmmo(player, bullets);       
      }
    }  
  }

  function calculateAmmo(player, bullets){
    var oldAmmo = player.currentAmmo;
    player.currentAmmo += bullets;
    if(player.currentAmmo > player.maxAmmo){
      player.currentAmmo = player.maxAmmo;
    }    
    io.to(player.id).emit("addAmmo", oldAmmo, player.currentAmmo);
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
            var lostBullets = player.currentAmmo
            killer = bullet.comesFrom

            addKiller(killer, lostBullets) 
            calculateWinner()

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
  
function updateHighscore(){
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/";
    // create table if not exist
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("mmodb");
      dbo.createCollection("highscore6table", function(err, res) {
        if (err) throw err;
        console.log("Collection created!");
        db.close();
      });
    });
              
   for (var i in players) {
//    //for (var i = 0; i < players.length; i++){
//       console.log(players[i])
      var highscorePlayer = players[i];
        
     // var highscorePlayer = players[socket.id]
//      console.log(highscorePlayer)
//      console.log("test")
      MongoClient.connect(url, function(err, db) {
          if (err) throw err;
          var dbo = db.db("mmodb");
          var query = { username: highscorePlayer.name };
          dbo.collection("highscore6table").find(query).toArray(function(err, result) {
              console.log(result)
              console.log("bla")
            if (err) throw err;
              db.close();
            if(result.length){ 
                var newHighscore = result[0].highscore + highscorePlayer.score
                var newWinscore = result[0].winscore + highscorePlayer.win
                MongoClient.connect(url, function(err, db) {
                  if (err) throw err;
                  var dbo = db.db("mmodb");
                  var myquery = { username: highscorePlayer.name };
                  var newvalues = { $set: {username: highscorePlayer.name, highscore: newHighscore, winscore: newWinscore } };
                  dbo.collection("highscore6table").updateOne(myquery, newvalues, function(err, res) {
                    if (err) throw err;
                    console.log("1 document updated");
                    db.close();
                  });
                });    
            }else{
            MongoClient.connect(url, function(err, db) {
              if (err) throw err;
              var dbo = db.db("mmodb");
              var myobj = { username: highscorePlayer.name, highscore: highscorePlayer.score, winscore: highscorePlayer.win };
              dbo.collection("highscore6table").insertOne(myobj, function(err, res) {
                if (err) throw err;
                console.log("1 document inserted");
                db.close();
              });
            });
            }  });


});
   
 }
}  
  
  
  
  
});

setInterval(function() {
  io.sockets.emit('state', players, bullets, itemboxes);
}, 1000 / 60);

http.listen(3000, function(){
  console.log('listening on *:3000');
});



              

// return complete highscore in een array, gesorteerd op de highscore en winscore.
function getHighscore(){
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/";

    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("mydb");
      var sort = { highscore: 1, winscore: 1 };
      dbo.collection("highscoretable2").find().sort(sort).toArray(function(err, result) {
          if (err) throw err;
          console.log(result);
          db.close();
          return result

      });

    });   
}

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
function checkCollisionPackageRight(player, objectArray, radius){
  for(i=0; i<objectArray.length; i++){
    if(player.x + radius >= objectArray[i][0] && player.x + radius <= objectArray[i][0] + objectArray[i][2]){
      if(player.y - radius <= objectArray[i][1] && player.y + radius >= objectArray[i][1] + objectArray[i][3] || player.y - radius >= objectArray[i][1] && player.y + radius <= objectArray[i][1] + objectArray[i][3]){ 
        return [true, objectArray[i]];
      }
      else if(player.y - radius >= objectArray[i][1] && player.y - radius <= objectArray[i][1] + objectArray[i][3] || player.y + radius >= objectArray[i][1] && player.y + radius <= objectArray[i][1] + objectArray[i][3]){
        return [true, objectArray[i]];
      }
    }
  }
  return [false, null];
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
function checkCollisionPackageDown(player, objectArray, radius){
  for(i=0; i<objectArray.length; i++){
    if(player.y + radius >= objectArray[i][1] && player.y + radius <= objectArray[i][1] + objectArray[i][3]){
      if(player.x - radius <= objectArray[i][0] && player.x + radius >= objectArray[i][0] + objectArray[i][2] || player.x - radius >= objectArray[i][0] && player.x + radius <= objectArray[i][0] + objectArray[i][2]){
        return [true, objectArray[i]];
      }
      else if(player.x - radius >= objectArray[i][0] && player.x - radius <= objectArray[i][0] + objectArray[i][2] || player.x + radius >= objectArray[i][0] && player.x + radius <= objectArray[i][0] + objectArray[i][2]){
        return [true, objectArray[i]];
      }
    }
  }
  return [false, null];
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
function checkCollisionPackageLeft(player, objectArray, radius){
  for(i=0; i<objectArray.length; i++){
    if(player.x - radius >= objectArray[i][0] && player.x - radius <= objectArray[i][0] + objectArray[i][2]){
      if(player.y - radius >= objectArray[i][1] && player.y + radius <= objectArray[i][1] + objectArray[i][3] || player.y - radius <= objectArray[i][1] && player.y + radius >= objectArray[i][1] + objectArray[i][3]){
        return [true, objectArray[i]];
      }
      else if(player.y - radius >= objectArray[i][1] && player.y - radius <= objectArray[i][1] + objectArray[i][3] || player.y + radius >= objectArray[i][1] && player.y + radius <= objectArray[i][1] + objectArray[i][3]){
        return [true, objectArray[i]];
      }
    }
  }
  return [false, null];
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
function checkCollisionPackageUp(player, objectArray, radius){
  for(i=0; i<objectArray.length; i++){
    if(player.y - radius >= objectArray[i][1] && player.y - radius <= objectArray[i][1] + objectArray[i][3]){
      if(player.x - radius <= objectArray[i][0] && player.x + radius >= objectArray[i][0] + objectArray[i][2] || player.x - radius >= objectArray[i][0] && player.x + radius <= objectArray[i][0] + objectArray[i][2]){
        return [true, objectArray[i]];
      }
      else if(player.x - radius >= objectArray[i][0] && player.x - radius <= objectArray[i][0] + objectArray[i][2] || player.x + radius >= objectArray[i][0] && player.x + radius <= objectArray[i][0] + objectArray[i][2]){
        return [true, objectArray[i]];
      }
    }
  }
  return [false, null];
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

function randomBoxPlacement(){
  var coordinates = [[20, 610],[100,490],[100, 360],[605,9],[514, 11],[526,230]];
  var randomBox = Math.floor((Math.random() * coordinates.length) )
  var x = coordinates[randomBox][0];
  var y = coordinates[randomBox][1];
  return [x,y];
}

function boxPlacement(box){
  var coordinatesBox1 = randomBoxPlacement();
  if(itemboxes.length == 0){
    var coordinatesBox2 = randomBoxPlacement();
    while(coordinatesBox2[0] == coordinatesBox1[0] && coordinatesBox2[1] == coordinatesBox1[1]){
      coordinatesBox2 = randomBoxPlacement();
    }
    itemboxes.push([coordinatesBox1[0], coordinatesBox1[1], 20, 20, 10]);
    itemboxes.push([coordinatesBox2[0], coordinatesBox2[1], 20, 20, 10]);
  }else{
    var index = itemboxes.indexOf(box);
    var coordinatesBox2 = randomBoxPlacement();
    while(coordinatesBox2[0] == coordinatesBox1[0] && coordinatesBox2[1] == coordinatesBox1[1]){
      coordinatesBox2 = randomBoxPlacement();
    }
    if(index !== -1){
      itemboxes[index] = [coordinatesBox2[0], coordinatesBox2[1], 20, 20, 10];
    }
  } 
}

setInterval(serverGameLoop, 16);

