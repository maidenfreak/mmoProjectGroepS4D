const express = require('express');
const app = express();
const passport = require('passport');
const flash = require('connect-flash');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var copyPlayers = {}
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/mmodb', {useNewUrlParser: true});
const Schema = mongoose.Schema
const highscoreSchema = new Schema({
    name: {type: String, required: true, unique: true} ,
    highscore: {type: Number, required: false, unique:false},
    winscore: {type: Number, required: false, unique:false}
})
const newModel = mongoose.model('highscoretable12', highscoreSchema)

//andere javascript bestanden die server side draaien
const collision = require('./collisionDetection.js');

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
            constructor(id,name, hp, maxHP, score, x, y, weapondamage, teamscore, color, teamname, isDead, maxAmmo, currentAmmo, classname, win, angle){
                super(id, name, teamscore, score, color, teamname, win, angle)
                this.hp = 150;
                this.maxHP = 150;
                this.x = 100;
                this.y = 100;
                this.weapondamage = 40;
                this.isDead = false;
                this.score = 0;
                this.maxAmmo = 20;
                this.currentAmmo = 20;
                this.classname = "Militant";
                this.fireRate = 200;
            }
        }
        //rebels 2
        class guerrilla extends rebels {
             constructor(id,name, hp, maxHP, score, x, y, weapondamage, teamscore, color, teamname, isDead, maxAmmo, currentAmmo, classname, win, angle){
                super(id, name, teamscore, score, color, teamname, win, angle)
                this.hp = 100;
                this.maxHP = 100;
                this.x = 130;
                this.y = 100;
                this.weapondamage = 80;
                this.isDead = false;
                this.score = 0;
                this.maxAmmo = 10;
                this.currentAmmo = 10;
                this.classname = "Guerrilla";
                this.fireRate = 1000;
            }        }
        //rebels 3
        class vigilante extends rebels {
             constructor(id,name, hp, maxHP, score, x, y, weapondamage, teamscore, color, teamname, isDead, maxAmmo, currentAmmo, classname, win, angle){
                super(id, name, teamscore, score, color, teamname, win, angle)
                this.hp = 200;
                this.maxHP = 200;
                this.x = 100;
                this.y = 130;
                this.weapondamage = 30;
                this.isDead = false;
                this.score = 0;
                this.maxAmmo = 25;
                this.currentAmmo = 25;
                this.classname = "Vigilante";
                this.fireRate = 100;
            }        }
        //rebels 4
        class separatist extends rebels {
             constructor(id,name, hp, maxHP, score, x, y, weapondamage, teamscore, color, teamname, isDead, maxAmmo, currentAmmo, classname, win, angle){
                super(id, name, teamscore, score, color, teamname, win, angle)
                this.hp = 240;
                this.maxHP = 240;
                this.x = 130;
                this.y = 130;
                this.weapondamage = 20;
                this.isDead = false;
                this.score = 0;
                this.maxAmmo = 30;
                this.currentAmmo = 30;
                this.classname = "Separatist"; 
                this.fireRate = 0;
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
            constructor(id,name, hp, maxHP, score, x, y, weapondamage, teamscore, color, teamname, isDead, maxAmmo, currentAmmo, classname, win, angle){
                super(id, name, teamscore, score, color, teamname, win, angle)
                this.hp = 150;
                this.maxHP = 150;
                this.x = 500;
                this.y = 500;
                this.weapondamage = 40;
                this.isDead = false;
                this.score = 0;
                this.maxAmmo = 20;
                this.currentAmmo = 20;
                this.classname = "Grenadier";
                this.fireRate = 200;
            }
    
        }
        //swat 2
        class breacher extends swat {
           constructor(id,name, hp, maxHP, score, x, y, weapondamage, teamscore, color, teamname, isDead, maxAmmo, currentAmmo, classname, win, angle){
                super(id, name, teamscore, score, color, teamname, win, angle)
                this.hp = 200;
                this.maxHP = 200;
                this.x = 530;
                this.y = 500;
                this.weapondamage = 20;
                this.isDead = false;
                this.score = 0;
                this.maxAmmo = 20;
                this.currentAmmo = 20;
               this.classname = "Breacher";
               this.fireRate = 0;
            }
        }
        //swat 3
        class observer extends swat {
            constructor(id,name, hp, maxHP, score, x, y, weapondamage, teamscore, color, teamname, isDead, maxAmmo, currentAmmo, classname, win, angle){
                super(id, name, teamscore, score, color, teamname, win, angle)
                this.hp = 100;
                this.maxHP = 100;
                this.x = 500;
                this.y = 530;
                this.weapondamage = 80;
                this.isDead = false;
                this.score = 0;
                this.maxAmmo = 10;
                this.currentAmmo = 10;
                this.classname = "Observer";
                this.fireRate = 1000;
            }        }
        //swat 4
        class charger extends swat {
            constructor(id,name, hp, maxHP, score, x, y, weapondamage, teamscore, color, teamname, isDead, maxAmmo, currentAmmo, classname, win, angle){
                super(id, name, teamscore, score, color, teamname, win, angle)
                this.hp = 240;
                this.maxHP = 240;
                this.x = 530;
                this.y = 530;
                this.weapondamage = 20;
                this.isDead = false;
                this.score = 0;
                this.maxAmmo = 20;
                this.currentAmmo = 20;
                this.classname = "Charger";
                this.fireRate = 300;
                
                
            } 

        } 
  
//creates a new player
socket.on('new player', function( playertype, name) {  
  if(playertype == "militant"){players[socket.id] = new militant(socket.id, name)}
  else if(playertype == "guerrilla"){players[socket.id] = new guerrilla(socket.id, name)}
  else if(playertype == "vigilante"){players[socket.id] = new vigilante(socket.id, name)}
  else if(playertype == "separatist"){players[socket.id] = new separatist(socket.id, name)}
  else if(playertype == "grenadier"){players[socket.id] = new grenadier(socket.id, name)}
  else if(playertype == "breacher"){players[socket.id] = new breacher(socket.id, name)}
  else if(playertype == "observer"){players[socket.id] = new observer(socket.id, name)}
  else if(playertype == "charger"){players[socket.id] = new charger(socket.id, name)}
  socket.emit('playerteam', players[socket.id]);
  endGame();
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
  //var winscore = 0
    if(swatscore  >= rebelsCount){
       // return "The SWAT unit has won the match with " + swatscore + " kills & " + rebelsCount + " deaths.";
      for (var id in players){
        if(players[id].teamname == "swat"){
          players[id].win = 1
        }
      updateHighscore(players[id])
    }
     swatCount = 0;
     rebelsCount = 0;
     swatscore = 0;
     rebelscore = 0;
     itemboxes.length = 0;
     copyPlayers = players 
     console.log(copyPlayers)
     io.emit('endOfGame');
     delete players[socket.id];
    }

    if(rebelscore >= swatCount){
      for (var id in players){
        if(players[id].teamname == "rebels"){
          players[id].win = 1        
        }
      updateHighscore(players[id])
    }
     swatCount = 0;
     rebelsCount = 0;
     swatscore = 0;
     rebelscore = 0;
     itemboxes.length = 0;
     copyPlayers = players  
     console.log(copyPlayers)
     io.emit('endOfGame');
     delete players[socket.id];
    }
}

   

      
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
      return swatCount, rebelsCount; 
    }    
    
socket.on('startGameServer', function(){
  hussledArray = randomFunc(playersInLobby)     
  teamconfig =  typeplayers.reduce(function(teamconfig, field, index) {
    teamconfig[hussledArray[index]] = field;
    return teamconfig;
  }, {});

  if(playersInLobby.length > 1){
    io.emit('startGame');
    playersInLobby.length = 0;
  }
  boxPlacement(null);
});

socket.on('teamconfig', function(){
  socket.emit('teamconfigReturn', teamconfig);
});
socket.on('getHighscore', function(){
  getHighscore();
});  
socket.on('getMatchHighscore', function(){    
socket.emit('getMatchHighscoreReturn', copyPlayers);    
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
  }else if(joined == 'false'){
    io.emit('playerLobbies', playersInLobby);
  }
});
  
socket.on('disconnect', function(){
  delete players[socket.id];
  endGame();

  //calculateWinner();

});

socket.on('leaveGame', function(){
  delete players[socket.id];
  endGame();   
});

socket.on("anglePush", function(angle){
  var player = players[socket.id] || {};
  player.angle = angle;
});

socket.on('movement', function(data, objectArray) {
  var player = players[socket.id] || {};
  if(player.hp <= 0){
    player.x = -30;
    player.y = -30;
    player.isDead = true;
  }
  if (data.left && player.x>=10 && collision.checkCollisionLeft(player, players, objectArray, 9) == false ) {
    var packageValues = collision.checkCollisionPackageLeft(player, itemboxes , 9);
    if(packageValues[0] == true){
      addBoxItems(player, packageValues[1]);
    }
    if(data.up || data.down){
      player.x-=1.41;
    } else {
      player.x -= 2;
    }
  }
  if (data.up && player.y>=11 && collision.checkCollisionUp(player, players, objectArray, 9) == false) {
    var packageValues = collision.checkCollisionPackageUp(player, itemboxes , 9);
    if(packageValues[0] == true){
      addBoxItems(player, packageValues[1]);
    }
    if(data.left || data.right){
      player.y-=1.41;
    } else {
      player.y -= 2;
    }
  }
  if (data.right && player.x<=630 && collision.checkCollisionRight(player, players, objectArray, 9) == false) {
    var packageValues = collision.checkCollisionPackageRight(player, itemboxes , 9);
    if(packageValues[0] == true){
      addBoxItems(player, packageValues[1]);
    }
    if(data.up || data.down){
      player.x+=1.41;
    } else {
      player.x += 2;
    }
  }
  if (data.down && player.y<=630 && collision.checkCollisionDown(player, players, objectArray, 9) == false) {
    var packageValues = collision.checkCollisionPackageDown(player, itemboxes , 9);
    if(packageValues[0] == true){
      addBoxItems(player, packageValues[1]);
    }
    if(data.left || data.right){
      player.y+=1.41;
    } else {
      player.y += 2;
    }
  }
});

function addBoxItems (player, packageData){
  if(packageData[5] == 0){
    calculateAmmo(player, packageData[4]);
  }else if(packageData[5] == 1){
    calculateHealth(player, packageData[4]);
  }
  boxPlacement(packageData);
}

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
    newBullet.damage = player.weapondamage;
    var bulletSpeed = calculateBulletSpeed(newBullet);
    newBullet.xSpeed = bulletSpeed[0];
    newBullet.ySpeed = bulletSpeed[1];
    bullets.push(newBullet);
    socket.emit('updatedAmmo', player.currentAmmo);
  }
});

  function addKiller(naam, bullets){
    for (var id in players) {
      var player = players[id];
      var killer1 = naam
      if(player.name == killer1){ 
        player.score += 1
        if(player.teamname == "swat"){
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

  function calculateHealth(player, health){
    var oldHealth = player.hp;
    player.hp += health;
    if(player.hp > player.maxHP){
      player.hp = player.maxHP;
    }
    io.to(player.id).emit("updatedHP", player.hp);
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

       if(bullet.x >= 0 && bullet.x <= 640 && collision.checkCollisionLeft(bullet, {}, objectArray, 2) == false && collision.checkCollisionRight(bullet, {}, objectArray, 2) == false){
        bullet.x += bullet.xSpeed
       }
       else {
        bullet.x = -10
      }

      if(bullet.y >= 0 && bullet.y <= 640 && collision.checkCollisionUp(bullet, {}, objectArray, 2) == false && collision.checkCollisionDown(bullet, {}, objectArray, 2) == false){
        bullet.y += bullet.ySpeed
      }
      else {
        bullet.y = -10
      }
     }
   })
  
function updateHighscore(player){
   var currentPlayer = player
   newModel.find({name: currentPlayer.name},function(err, doc) {
     if (doc.length){
        var newHighscore = doc[0].highscore + currentPlayer.score
        var newWinscore = doc[0].winscore + currentPlayer.win
        newModel.update({name: currentPlayer.name}, {$set: { highscore: newHighscore, winscore: newWinscore}}, function (err, user) {
        })
     }else{
        const newDocument = newModel({name: currentPlayer.name, highscore: currentPlayer.score, winscore: currentPlayer.win})
        newDocument.save()
    }
  })
 }

//return complete highscore in een array, gesorteerd op de highscore en winscore.
  function getHighscore(){
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/";
    var arrayName = [];
    var arrayHighscore = [];
    var arrayWinscore = [];

    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("mmodb");
      var sort = { highscore: -1, winscore: -1 };

      dbo.collection("highscoretable12").find().sort(sort).toArray(function(err, result) {
        for(var x in result){
          arrayName.push (result[x].name);
          arrayWinscore.push (result[x].winscore);
          arrayHighscore.push(result[x].highscore);
        }
        socket.emit('getHighscoreReturn', arrayName, arrayHighscore, arrayWinscore);
        db.close(); 
      });
    });
  };  
});

setInterval(function() {
  io.sockets.emit('state', players, bullets, itemboxes);
}, 1000 / 60);

http.listen(3000, function(){
  console.log('listening on *:3000');
});



              

 
//function getHighscore() {
//  return new Promise(function(resolve, reject) {
//      var sort = { highscore: 1, winscore: 1 };
//      var dbo = db.db("mmodb");
//     dbo.collection("highscoretable12").find().sort(sort).toArray( function(err, docs) {
//      if (err) {
//        // Reject the Promise with an error
//        return reject(err)
//      }
//
//      // Resolve (or fulfill) the promise with data
//      return resolve(docs)
//    })
//  })
//}
    


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
  var coordinates = [[20, 610],[100,490],[88, 385],[605,9],[514, 11],[526,230],[288,611],[307,307],[330,8],[448,527],[170,91]];
  var randomBox = Math.floor((Math.random() * coordinates.length) )
  var x = coordinates[randomBox][0];
  var y = coordinates[randomBox][1];
  return [x,y];
}

function boxPlacement(box){
  if(itemboxes.length == 0){
    var coordinatesBox1 = randomBoxPlacement();
    var coordinatesBox2 = randomBoxPlacement();
    var coordinatesBox3 = randomBoxPlacement();
    while(coordinatesBox2[0] == coordinatesBox1[0] && coordinatesBox2[1] == coordinatesBox1[1]){
      coordinatesBox2 = randomBoxPlacement();
      coordinatesBox3 = randomBoxPlacement();
      while(coordinatesBox3[0] == coordinatesBox1[0] || coordinatesBox3[0] == coordinatesBox2[0] && coordinatesBox3[1] == coordinatesBox1[1] || coordinatesBox3[1] == coordinatesBox2[1]){
        coordinatesBox3 = randomBoxPlacement();
      }
    }
    itemboxes.push([coordinatesBox1[0], coordinatesBox1[1], 20, 20, 10, 0]);
    itemboxes.push([coordinatesBox2[0], coordinatesBox2[1], 20, 20, 10, 0]);
    itemboxes.push([coordinatesBox3[0], coordinatesBox3[1], 20, 20, 40, 1]);
  }else{
    var index = itemboxes.indexOf(box);
    var coordinatesBox = randomBoxPlacement();
    var duplicateCounter = 0;
    var ammountBox = 0;
    var boxType = 0;
    if(index !== -1){
      ammountBox = itemboxes[index][4];
      boxType = itemboxes[index][5];
      for(i=0; i<itemboxes.length; i++){
        if(itemboxes[index][0]==itemboxes[i][0]&&itemboxes[index][1]==itemboxes[i][1]){
          duplicateCounter++;
        }
      }
      if(duplicateCounter > 1){
        coordinatesBox = randomBoxPlacement();
      }
      itemboxes[index] = [coordinatesBox[0], coordinatesBox[1], 20, 20, ammountBox, boxType];
    }
  } 
}

setInterval(serverGameLoop, 16);

