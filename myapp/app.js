var express = require('express');

var passport = require('passport');
var SpotifyStrategy = require('passport-spotify').Strategy;
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var keys = require('./keys');
var session = require('express-session');

var app = express();

var OAUTH_SCOPES = 'user-read-private user-read-email playlist-read-private playlist-modify-public playlist-modify-private';

app.use(bodyParser());
app.use(cookieParser());
app.use(session({secret: 'keyboard cat'}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

var tokens = {};
passport.use(
    new SpotifyStrategy({
        clientID: keys.clientId,
        clientSecret: keys.clientSecret,
        callbackURL: 'http://localhost:3000/callback'
    },
    function (accessToken, refreshToken, profile, done) {
        tokens[profile.id] = accessToken;
        console.log (accessToken);
        return done(null, profile);
    })
);

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static('public'));

app.engine('html', require('ejs').renderFile);



app.get('/', function (req, res) {
  res.render('index.html', {name:"Bed"});
});


app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});


function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return next();
    else res.redirect('/login');
}

app.get('/prompt', ensureAuthenticated, function (req, res) {
    res.end('You are user:' + req.user.displayName);
    // set route handler
    // res.render template
});

app.get('/login', 
    passport.authenticate('spotify', {scopes: OAUTH_SCOPES, showDialog: true}), 
    function (req, res) {
        res.redirect('/prompt');
    }
);

app.get('/callback',
    passport.authenticate('spotify', {failureRedirect: '/login', scope: OAUTH_SCOPES}),
    function (req, res) {
        res.redirect('/prompt');
    }
);


