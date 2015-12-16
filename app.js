var express = require('express');
var passport = require('passport');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var SpotifyStrategy = require('passport-spotify').Strategy;
var request = require('request');

var CLIENT_ID = process.env['SPOTIFY_CLIENT_ID'];
var CLIENT_SECRET = process.env['SPOTIFY_CLIENT_SECRET'];
var REDIRECT_URI = 'http://localhost:8888/callback';
var OAUTH_SCOPES = 'user-read-private user-read-email playlist-read-private playlist-modify-public playlist-modify-private'

var tokens = {};
var playlists = {};
var removeLists = {};

passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(obj, done) {
	done(null, obj);
});

var app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(cookieParser());
app.use(bodyParser());
app.use(session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/static'));

passport.use(
	new SpotifyStrategy({
		clientID: CLIENT_ID,
		clientSecret: CLIENT_SECRET,
		callbackURL: "http://localhost:8888/callback"
	},
	function(accessToken, refreshToken, profile, done) {
        tokens[profile.id] = accessToken;
		return done(null, profile);
	}
));

function root(req, res) {
    res.render('login.html');
}

function refreshPlaylists(id, done) {
    request({
        url: "https://api.spotify.com/v1/users/" + id + "/playlists",
        headers: {
            Authorization: "Bearer " + tokens[id]
        }
    }, function (err, apiRes, body) {
        var data = JSON.parse(body);
        playlists[id] = data;
        done(err, data);
    });
}

function prompt(req, res) {
    refreshPlaylists(req.user.id, function (err, data) {
        if (err) {
            console.log(err);
            return res.send('error');
        }
        res.render('search.html', {user: req.user});
    });
}

function remove(req, res) {
    doRemove(req.user.id, req.body.album, done);

    function done() {
        res.send('done probably maybe');
    }
}

function doRemove(id, album, done) {
    console.log(' doRemove args', arguments);

    var list = playlists[id].items;
    var numDone = list.length;

    for (var i = 0; i < numDone; i++) {
        process(i);
    }

    function process(i) {
        request({
            url: list[i].href,
            headers: {Authorization: "Bearer " + tokens[id]}
        }, processPlaylist);
    }

    function processPlaylist(err, apiRes, body) {
        if (err) {
            return doneOne(err);
        }

        // loop over, send delete requests
        var toDelete = {};
        var data = JSON.parse(body);
        var tracks = data.tracks.items;
        var i;

        for (i = 0; i < tracks.length; i++) {
            if (tracks[i].track.album.name.indexOf(album) !== -1) {
                toDelete[tracks[i].track.uri] = toDelete[tracks[i].track.uri] || [];
                toDelete[tracks[i].track.uri].push(i);
            }
        }

        var deleteIds = Object.keys(toDelete);
        var deleteArray = [];

        if (deleteIds.length === 0) {
            return doneOne();
        }

        for (i = 0; i < deleteIds.length; i++) {
            deleteArray.push({
                uri: deleteIds[i],
                positions: toDelete[deleteIds[i]]
            });
        }

        request({
            method: "DELETE",
            url: data.href + "/tracks",
            headers: {Authorization: "Bearer " + tokens[id]},
            json: true,
            body: {
                tracks: deleteArray
            }
        }, doneOne);
    }

    function doneOne(err) {
        numDone -= 1;
        if (numDone < 1) {
            done();
        }

        if (err) {
            console.err(err);
        }
    }
}

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) { return next(); }
	res.redirect('/auth/spotify');
}

app.get('/auth/spotify',
  passport.authenticate('spotify', {scope: OAUTH_SCOPES, showDialog: true}),
  function(req, res){
// The request will be redirected to spotify for authentication, so this
// function will not be called.
});

app.get('/callback',
  passport.authenticate('spotify', { failureRedirect: '/auth/spotify', scope: OAUTH_SCOPES }),
  function(req, res) {
    res.redirect('/prompt');
  });

app.get('/', root);
app.get(
	'/prompt', 
	ensureAuthenticated,
	prompt
);
app.post(
	'/remove', 
	ensureAuthenticated,
	remove
);

app.listen(8888);
