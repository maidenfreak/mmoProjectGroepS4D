//gebruikte modules
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

//database
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
const { charger, observer, breacher, grenadier, separatist, vigilante, guerrilla, militant } = require('./playerClass');

//globale variabelen
var players = {}; // spelersobjecten hierin geplaatst als deze aangemaakt worden als het spel start.
var arrayMatchScore = [] // De spelers met bijbehorende scores van de laatste match worden bijgehouden in dit array
const playersInLobby = []; // In dit array staan de spelers die zich in de lobby bevinden
const itemboxes = [];
const bullets = [];
var swatCount = 0; // In deze count staan het aantal swat spelers
var rebelsCount = 0 ; // In deze count staan het aantal rebel spelers
var rebelscore =0; // In deze count staan het aantal kills van de rebels
var swatscore = 0; // In deze count staan het aantal kills van de swat
var rebelsActive = 0;
var swatActive = 0;
var typeplayers = ["militant", "grenadier", "vigilante" ,"breacher", "guerrilla", "observer","separatist", "charger" ]; // Lijst met alle mogelijke classes
var teamconfig = []; // 

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
  var path = require('path');

  app.use(express.static(__dirname + '/views'));
  app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
  })
  app.set('port', 3000);
  app.use('/static', express.static(__dirname + '/static'));

  // Routing
  app.get('/views/', function(request, response) {
    response.sendFile(path.join(__dirname, 'index.ejs'));
  });

  //voor het versturen van de messages in de chat
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });

  //chatmessages voor de lobby
  socket.on('chatmessage', function(msg){
    socket.emit('chatmessage', "Welcome " + msg + "! Click on the Join button to join the lobby."); 
    socket.emit('chatmessage', "Press the Start button if there are atleast 2 players in the lobby (or wait for more). ");
    socket.emit('chatmessage', "Press on the highscore button to see the top 10 and your rank. ");
    socket.emit('chatmessage', " Use the spectator mode to watch a started match. ");
    socket.emit('chatmessage', " To use the chat, type your message down below.  ");
  }); 
  
  //chatmessages voor ingame
  socket.on('chatgamemessage', function(msg){
    socket.emit('chatgamemessage', "The Russian rebels (red), hijacked an office building for organized crime. The objective is that either the Rebels or the Swatteam take out eachother."); 
    socket.emit('chatgamemessage', "Use the WASD keys to move around the office and click to shoot your enemy."); 
    socket.emit('chatgamemessage', "Each player per team has another class. Each class have there own weapon, firerate, bullets and health. ");
    socket.emit('chatgamemessage', "Pick up health and ammo boxes hidden in the office building if you need it.");
    socket.emit('chatgamemessage', " The game ends when all players of a team are taken down. ");
  });

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
    countPlayersInGame();
  });

  //checkt of er een game bezig is of niet.
  socket.on('checkIfGameIsGoing', function(spectator){
    if(Object.entries(players).length !== 0){
      socket.emit('startSpectating', spectator);
    }
  });

  socket.on('teamconfig', function(){
    socket.emit('teamconfigReturn', teamconfig);
  });

  socket.on('getHighscore', function(){
    getHighscore();
  }); 

  socket.on('getMatchHighscore', function(){ 
    var sortedArray = arrayMatchScore.sort( function(a, b) {
      return (b[1] - a[1] ) || (b[2] - a[2]);
    });
    socket.emit('getMatchHighscoreReturn', sortedArray)
  });    
    
  socket.on('connectedPeopleLobby', function(){
    var amountOfPlayers = playersInLobby.length;
    io.emit('connectedPeopleLobbyReturn', amountOfPlayers);
  });

  //kijkt in de lobby of de juiste hoeveelheid mensen hebben gejoined en zorgt ervoor dat een speler niet 2x kan joinen
  socket.on('playerLobby', function(playername, joined, idSocket){
    var playerAlreadyInLobby = false;
    for(i=0; i<playersInLobby.length; i++){
      if(playersInLobby[i][0] == playername){
        playerAlreadyInLobby = true;
      }
    }
    if(joined == 'true'){
      if(playerAlreadyInLobby == true){
        return console.log('you are already in the lobby!');
      }else if(playersInLobby.length < 8){
        playersInLobby.push([playername, idSocket]);
        io.emit('playerLobbies', playersInLobby);
      }
    }else if(joined == 'false'){
      io.emit('playerLobbies', playersInLobby);
    }
  });
  
  //verwijdert een speler als deze disconect van de game.
  socket.on('disconnect', function(){
    delete players[socket.id];
    countPlayersInGame(); 
  });

  //verwijdert een speler als deze op de leave knop drukt in game.
  socket.on('leaveGame', function(){
    delete players[socket.id];
    countPlayersInGame();  
    calculateWinner(); 
  });

  //update de "angle" van de speler dus de kant waar de speler naartoe kijkt.
  socket.on("anglePush", function(angle){
    var player = players[socket.id] || {};
    player.angle = angle;
  });

  //checkt of de speler een bepaalde kant kan opbewegen en update de coordinaten van de spelers als dit mogelijk is.
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
    if (data.up && player.y>=11 && collision.checkCollisionUp(player, players, objectArray, 10) == false) {
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
    if (data.right && player.x<=630 && collision.checkCollisionRight(player, players, objectArray, 10) == false) {
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
    if (data.down && player.y<=630 && collision.checkCollisionDown(player, players, objectArray, 10) == false) {
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
    
  socket.on('startGameServer', function(){
    hussledArray = randomFunc(playersInLobby)     
    teamconfig =  typeplayers.reduce(function(teamconfig, field, index) {
      try{
        teamconfig[hussledArray[index][0]] = field;
      }
      finally{
        return teamconfig;
      }
    }, {});
  
    if(playersInLobby.length > 1){
      if(Object.entries(players).length === 0){
        for(i=0; i<playersInLobby.length; i++){
          var spelerInLobby = playersInLobby[i];
          io.to(spelerInLobby[1]).emit('startGame');
        }
      }else{
        socket.emit('gameAlreadyStarted');
      }
      playersInLobby.length = 0;
    }
    boxPlacement(null);
  });  

  //Maakt aan de hand van de meegegeven gegevens een bullet en stopt deze in een array.
  socket.on('shoot-bullet', function(data, targetX, targetY){
    var player = players[socket.id] || {};
    if(players[socket.id] == undefined) return;
    if(player.currentAmmo > 0){
      player.currentAmmo -= 1
      var newBullet = data;
      if(targetX > player.x){
        newBullet.x = player.x
      }
      if(targetX < player.x){
        newBullet.x = player.x
      }
      if(targetY > player.y){
        newBullet.y = player.y
      }      
      if(targetY < player.y){
        newBullet.y = player.y
      }
      newBullet.targetX = targetX;
      newBullet.targetY = targetY;
      newBullet.comesFrom = player.name;
      newBullet.damage = player.weapondamage;
      newBullet.teamname = player.teamname
      var bulletSpeed = calculateBulletSpeed(newBullet);
      newBullet.xSpeed = bulletSpeed[0];
      newBullet.ySpeed = bulletSpeed[1];
      bullets.push(newBullet);
      socket.emit('updatedAmmo', player.currentAmmo);
      io.emit("playSoundEffect", player);
    }
  });

  //controleert waar de bullet zich bevind, aan de hand van die gegevens wordt er bepaald wie de killer is.
  socket.on('checkBullets', function(objectArray){
    var player = players[socket.id] || {};
    for(var i = 0; i < bullets.length; i++){
      var bullet = bullets[i]
      var killer;
      if(bullet.x >= player.x - 10 && bullet.x <= player.x + 10 && bullet.y >= player.y - 10 && bullet.y <= player.y + 10 && bullet.comesFrom != player.name && bullet.teamname != player.teamname){
        player.hp -= bullet.damage;
        io.emit("playerHit", bullet, player);
        socket.emit("updatedHP", player.hp);
        if(player.hp <= 0){
          var lostBullets = player.currentAmmo
          killer = bullet.comesFrom
          io.emit("playerKilled",player)
          addKiller(killer, lostBullets)
          calculateWinner()
        }
        bullet.isHit = true
      }
      if(bullet.x >= 0 && bullet.x <= 640 && collision.checkCollisionLeft(bullet, {}, objectArray, 2) == false && collision.checkCollisionRight(bullet, {}, objectArray, 2) == false){
        bullet.x += bullet.xSpeed  
      } else {
        io.emit("wallHit",bullet);
        bullet.x = -10
      }
      if(bullet.y >= 0 && bullet.y <= 640 && collision.checkCollisionUp(bullet, {}, objectArray, 2) == false && collision.checkCollisionDown(bullet, {}, objectArray, 2) == false){
        bullet.y += bullet.ySpeed
      } else {
        io.emit("wallHit",bullet);
        bullet.y = -10
      }
    }
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
    arrayMatchScore = [];
    if(swatscore  >= rebelsCount){
      for (var id in players){
        if(players[id].teamname == "Swat"){
          players[id].win = 1
        }
        updateHighscore(players[id])
      }
      endGame();
    }
    if(rebelscore >= swatCount){
      for (var id in players){
        if(players[id].teamname == "Rebels"){
          players[id].win = 1        
        }
      updateHighscore(players[id])
      }
      endGame(); 
    }
  }

  function endGame(){
    swatCount = 0;
    rebelsCount = 0;
    swatscore = 0;
    rebelscore = 0;
    itemboxes.length = 0;
    for(var x in players){
      arrayMatchScore.push ([players[x].name, players[x].score, players[x].win, players[x].teamname ]);
    }  
    io.emit('endOfGame');   
    for(var id in players){
      delete players[id];
    } 
  }
      
  function countPlayersInGame(){
    swatCount = 0;
    rebelsCount = 0;
    for(var id in players){
      var player = players[id];
      if(player.teamname == "Swat"){
        swatCount += 1;
      }
      else if(player.teamname == 'Rebels'){
        rebelsCount += 1;
      }
    }
    swatActive = swatCount
    rebelsActive = rebelsCount
    return swatCount, rebelsCount; 
  }    

  //bekijkt wat voor soort box er is opgepakt en stuurt deze informatie door naar de client.
  function addBoxItems (player, packageData){
    if(packageData[5] == 0){
      calculateAmmo(player, packageData[4]);
      socket.emit("boxPickUp", packageData[5]);
    }else if(packageData[5] == 1){
      calculateHealth(player, packageData[4]);
      socket.emit("boxPickUp", packageData[5]);
    }
    boxPlacement(packageData);
  }

  //zorgt ervoor dat de killer een kill erbij krijgt en de bullets van de speler die die gekillt heeft.
  function addKiller(naam, bullets){
    for (var id in players) {
      var player = players[id];
      var killer1 = naam
      if(player.name == killer1){ 
        player.score += 1

        if(player.teamname == "Swat"){
          swatscore +=1; 
          rebelsActive -=1;         
        }if(player.teamname == "Rebels"){
          rebelscore +=1;
          swatActive -=1;
        }
        calculateAmmo(player, bullets);       
      }
    }  
  }

  //berekend de ammo van een speler en stuurt dit vervolgens naar de client om te updaten
  function calculateAmmo(player, bullets){
    var oldAmmo = player.currentAmmo;
    player.currentAmmo += bullets;
    if(player.currentAmmo > player.maxAmmo){
      player.currentAmmo = player.maxAmmo;
    }    
    io.to(player.id).emit("addAmmo", oldAmmo, player.currentAmmo);

  }

  //berekend de health van een speler en stuurt dit vervolgens naar de client door om te updaten
  function calculateHealth(player, health){
    player.hp += health;
    if(player.hp > player.maxHP){
      player.hp = player.maxHP;
    }
    io.to(player.id).emit("updatedHP", player.hp);
  }
  
  //update de highscore van de spelers als een game is afgelopen.
  function updateHighscore(player){
    var currentPlayer = player;
    newModel.find({name: currentPlayer.name},function(err, doc) {
      if (doc.length){
        var newHighscore = doc[0].highscore + currentPlayer.score;
        var newWinscore = doc[0].winscore + currentPlayer.win;
        newModel.update({name: currentPlayer.name}, {$set: { highscore: newHighscore, winscore: newWinscore}}, function (err, user) {});
      }else{
        const newDocument = newModel({name: currentPlayer.name, highscore: currentPlayer.score, winscore: currentPlayer.win});
        newDocument.save();
      }
    });
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
//einde socket.io

setInterval(function() {
  io.sockets.emit('state', players, bullets, itemboxes);
  io.sockets.emit('updateScoreInHud', rebelsActive, swatActive);
}, 1000 / 60);

http.listen(3000, function(){
  console.log('listening on *:3000');
});

//berekent de snelheid van de afgevuurde bullets.
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

//verwijderd de bullets wanneer deze de muur of een vijand raken.
function serverGameLoop(){
  for( var i = bullets.length - 1; i >= 0; i--){
    if(bullets[i].x === -10 || bullets[i].y === -10 || bullets[i].isHit === true){
      bullets.splice(i,1);
    } 
  }
}

//pakt uit een vooropgestelde array een random positie
function randomBoxPlacement(){
  var coordinates = [[20, 610],[100,490],[88, 385],[605,9],[514, 11],[526,230],[288,611],[307,307],[330,8],[448,527],[170,91]];
  var randomBox = Math.floor((Math.random() * coordinates.length) )
  var x = coordinates[randomBox][0];
  var y = coordinates[randomBox][1];
  return [x,y];
}

//zorgt ervoor dat er 3 random boxes op het veld worden geplaatst
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