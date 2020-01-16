module.exports = function(app,passport){

    
    app.get('/',isLoggedIn,(req,res)=>{
        res.render('lobby.ejs',{
            name : req.user.name
        });
    });


    app.get('/index', isLoggedIn, (req, res) =>{
      res.render('index.ejs', {name: req.user.name} )
    })

    
    app.get('/login',(req,res) => {
        res.render('login.ejs')
    });
    app.get('/highscore', isLoggedIn,(req,res) => {
        res.render('highscore.ejs', {name: req.user.name})
    });
    app.get('/matchhighscore', isLoggedIn,(req,res) => {
        res.render('matchhighscore.ejs', {name: req.user.name})
    });
    app.post('/login',passport.authenticate('local-login',{
            successRedirect : '/',
            failureRedirect : '/login',
            failureFlash: true
        }
    ));

    app.get('/register',(req,res) => {
        res.render('register.ejs');
    })

    app.post('/register', passport.authenticate('local-signup', {
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/register', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });


        // route middleware to make sure a user is logged in
    function isLoggedIn(req, res, next) {

        // if user is authenticated in the session, carry on 
        if (req.isAuthenticated())
            return next();

        // if they aren't redirect them to the home page
        res.redirect('/login');
    }
}