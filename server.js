if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const app = express()
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')

var http = require('http').createServer(app);
var io = require('socket.io')(http);

const initializePassport = require('./passport-config')
initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)

const users = []

app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

app.get('/', checkAuthenticated, (req, res) => {
  res.render('lobby.ejs', { name: req.user.name })
})

app.get('/index', checkAuthenticated, (req, res) =>{
  res.render('index.ejs', {name: req.user.name} )
})

app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs')
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register.ejs')
})

app.post('/register', checkNotAuthenticated, async (req, res) => {
  try {
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    })
    res.redirect('/login')
  } catch {
    res.redirect('/register')
  }
})

app.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}

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

// Starts the server.

// Add the WebSocket handlers
const players = {};
const playersInLobby = [];
io.on('connection', function(socket) {
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });

  socket.on('new player', function() {
    players[socket.id] = {
    x: 300,
    y: 300
    };
    console.log(players);
    console.log(users);
  });

  socket.on('startGameServer', function(){
    if(playersInLobby.length > 1){
      console.log(playersInLobby.length);
      io.emit('startGame');
      playersInLobby.length = 0;
    }
  });

  socket.on('playerLobby', function(playername){
    var playerAlreadyInLobby = false;

    for(i=0; i<playersInLobby.length; i++){
      if(playersInLobby[i] == playername){
        playerAlreadyInLobby = true;
      }
    }
    if(playerAlreadyInLobby == true){
      return console.log('you are already in the lobby!')
    }else{
      playersInLobby.push(playername);
      io.emit('playerLobbies', playersInLobby);
    }
  });
  
  socket.on('disconnect', function(){
    delete players[socket.id];
  });

  socket.on('movement', function(data) {
    var player = players[socket.id] || {};
    if (data.left && player.x>10) {
      player.x -= 5;
    }
    if (data.up && player.y>10) {
      player.y -= 5;
    }
    if (data.right && player.x<630) {
      player.x += 5;
    }
    if (data.down && player.y<470) {
      player.y += 5;
    }
  });
});

setInterval(function() {
  io.sockets.emit('state', players);
}, 1000 / 60);

http.listen(3000, function(){
  console.log('listening on *:3000');
});

