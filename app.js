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

  //creates a new player
  socket.on('new player', function() {
    players[socket.id] = {
    team: 3,
    x: 315,
    y: 315
    };

  });

  socket.on('startGameServer', function(){
    if(playersInLobby.length > 1){
      io.emit('startGame');
      playersInLobby.length = 0;
    }
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

  socket.on('movement', function(data) {
    var player = players[socket.id] || {};
    if (data.left && player.x>10) {
      if(data.up || data.down){
      player.x-=1.41}
      else{
      player.x -= 2;
      }
    }
    if (data.up && player.y>10) {
      if(data.left || data.right){
        player.y-=1.41}
        else{
        player.y -= 2;
        }
    }
    if (data.right && player.x<630) {
      if(data.up || data.down){
        player.x+=1.41}
        else{
        player.x += 2;
        }
    }
    if (data.down && player.y<630) {
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
    newBullet.x = player.x
    newBullet.y = player.y
    newBullet.targetX = targetX;
    newBullet.targetY = targetY;
    var bulletSpeed = calculateBulletSpeed(newBullet);
    newBullet.xSpeed = bulletSpeed[0];
    newBullet.ySpeed = bulletSpeed[1];
    bullets.push(newBullet);
  })
});

setInterval(function() {
  io.sockets.emit('state', players, bullets);
}, 1000 / 60);

http.listen(3000, function(){
  console.log('listening on *:3000');
});

function calculateBulletSpeed(bullet){
    var vx = bullet.targetX - bullet.x
    var vy = bullet.targetY - bullet.y
    var dist = Math.sqrt(vx * vx + vy * vy)
    var dx = vx / dist
    var dy = vy / dist
    dx *= 10
    dy *= 10  
  return [dx, dy]
}

function serverGameLoop(){
  for(var i = 0; i < bullets.length; i++){
    var bullet = bullets[i]
   if(bullet.x >= 0 && bullet.x <= 640){
      bullet.x += bullet.xSpeed
    }
    else {
      bullet.x = 0
    }
    if(bullet.y >= 0 && bullet.y <= 640){
      bullet.y += bullet.ySpeed
    }
    else {
      bullet.y = 0
    }
  }

  for( var i = bullets.length - 1; i >= 0; i--){
    if(bullets[i].x === 0 || bullets[i].y === 0){
      bullets.splice(i,1);
    } 
  }
}

setInterval(serverGameLoop, 16);