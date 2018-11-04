//LINK BETWEEN DATABASE AND WEBAPP
var mysql = require('mysql')
var express = require('express');
var app = express();

//connect to the jukebox database
var connection = mysql.createConnection({
    host     : 'junkeboxinstance.c4jsultqkn4z.us-east-2.rds.amazonaws.com',
    user     : 'EuraShin',
    password : 'mypassword',
    database : 'jukend'
});

var request = require('request');
var cors = require('cors');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');

var SpotifyWebApi = require('spotify-web-api-node');
var client_id = '690951f82905419d8342d9f33e3e6227'; // Your client id
var client_secret = 'bd8f410b044a4f16a17151c7d1c57601'; // Your secret
var redirect_uri = 'http://localhost:8080/callback'; // Your redirect uri

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = 'spotify_auth_state';

/************ START OUR APP ************/
// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8080;

/************ SPOTIFY WEBAPI WRAPPER SETUP ************/
var spotify_auth = "";
var access_token = "";

var spotifyApi = new SpotifyWebApi({
	clientId: client_id,
	clientSecret: client_secret,
	redirectUri: redirect_uri
});

// set the view engine to ejs
app.set('view engine', 'ejs');

// make express look in the public directory for assets (css/js/img)
app.use(express.static(__dirname + '/public')).use(cors()).use(cookieParser());

// set the home page route
app.get('/', function(req, res) {
    res.render('index');
});

app.get('/loggedin', function(req, res) {
	// set access token
	spotifyApi.setAccessToken(access_token);

	// get user and pass relevant information
	spotifyApi.getMe()
		.then(function(data) { // get user
		var name = data.body.display_name;
		var user_uri = data.body.uri;
		var user_id = data.body.id;

		connection.connect();
		connection.query("INSERT IGNORE INTO user(user_uri, user_name, user_id) VALUES ('" + user_uri + "','"
			+ name + "','" + user_id + "')");

		spotifyApi.getMyTopTracks({limit: 50})
		.then(function(data) { // get track
			for(var x in data.body.items) {
				connection.query("INSERT IGNORE INTO song(uri, title, album, artist) VALUES ('" + data.body.items[x].uri + "','" + mysqlEscape(data.body.items[x].name) + "','" + mysqlEscape(data.body.items[x].album.name) + "','" + mysqlEscape(data.body.items[x].artists[0].name) + "')");
				connection.query("INSERT IGNORE INTO stores(user_uri, s_uri) VALUE ('" + user_uri + "','" + data.body.items[x].uri + "')");
			}
		});

		// render page
		res.render("realFrontPage", {name: name, user_uri: user_uri, user_id: user_id});
	}).catch(function(err) {
		console.error(err.message);
	});
});

/********** SESSION FUNCTIONS *************/
//called when "start a session" button is pressed
//input: useruri
app.get('/create', function(req,res) {
    //generate random string
    var randString = generateRandomString(5);
    var link = 'https://jukebox-node-8080.herokuapp.com/join/' + randString;

    //start a session in the database
    connection.query("INSERT IGNORE INTO jam(uniqueLink, host) VALUES ('" + link + "','"+ req.headers.useruri + "')"); //make session
    connection.query("SELECT user_name, user_id FROM user WHERE user_uri = '" + req.headers.useruri + "'", function(err, rows, fields) { //
        if (err) throw err;

        //handle rendering the temp page by ID
        console.log(req.headers.useruri);
        var users = [].concat([rows[0].user_name]);
        res.render("session_page", {link: link, users:users, host_id: rows[0].user_id, host_uri: req.headers.useruri}); //makes the webpage
    });
});

//input
app.get('/session_start', function(req,res) {
	spotifyApi.createPlaylist(req.headers.userid, 'jukebox', { 'public' : true })
	.then(function(data) {
		// dependent upon radio button selection for method of constructing playlist
		var playlist = data.body.id;
		// select the users in this session
		connection.query("SELECT user_id FROM joins, user WHERE host_uri = '" + req.headers.useruri + "' "
			+ "AND joins.user_uri = user.user_uri",
		function(err, rows, fields) {
            //make list of users, append host user
            var users = [];
            for(var x in rows) {
			  console.log(rows[x].user_id);
                users.push(rows[x].user_id);
            }
            users.push(req.headers.userid);
			users.forEach(function(user) {
				//select the songs associated with this user
				connection.query("SELECT s_uri FROM stores WHERE user_uri = 'spotify:user:" + user + "'",
				function(err, rows, fields) {
					var songs = [];
					for(var z in rows) {
						songs.push(rows[z].s_uri);
					}
					spotifyApi.addTracksToPlaylist(playlist, songs)
					.then(function(data) {
						spotifyApi.play({context_uri: "spotify:playlist:" + playlist});
					}).catch(function(err) {
						console.error(err);
					});
				});
			});
		});
	});
});

//called when "join a session" button is pressed
app.get('/join/:uniqueLink', function(req, res) {
    //find hosturi
    var link = 'https://jukebox-node-8080.herokuapp.com/join/' + req.params.uniqueLink;
    console.log(link);
    connection.query("SELECT host FROM jam WHERE jam.uniqueLink = '" +  link + "'", function(err, rows, fields ) {
        hosturi = rows[0].host;
        console.log(hosturi);
        //add user to session
        connection.query("INSERT IGNORE INTO joins(host_uri, user_uri) VALUES ('" + hosturi + "','" + req.headers.useruri + "')");
        //handle rendering the temp page by ID
        //select all the users in session
        connection.query("SELECT DISTINCT user_name FROM user,joins,jam WHERE jam.host ='" +  hosturi +
                "' AND user.user_uri = joins.user_uri", function(err, rows, fields) {
            if (err) throw err;
            var other_users = [];
            for(var i=0; i<rows.length; i++) {
                other_users.push(rows[i].user_name);
            }
            other_users = [].concat(other_users);
            //select the host user
            connection.query("SELECT user_name FROM user WHERE user_uri = '" + hosturi + "'", function(err, rows, fields) { //
                if (err) throw err;
                var host = rows[0].user_name;
                var users = other_users.concat(host);
                console.log(users);
                res.render('session_page', {link: link, users:users, hosturi:hosturi});
            });
        });
    });

});

app.get('/destroy', function(req,res){
    //delete songs associated with users
    hosturi = req.headers.useruri;
    connection.query("DELETE FROM stores");

    //delete host users session
    connection.query("DELETE FROM joins WHERE host_uri='" +hosturi+"'");
    connection.query("DELETE FROM jam WHERE host='" +hosturi+"'");

    connection.end();

    //redirect to homepage
    res.render('index');
});

// spotify authentication verification
// upon clicking login button redirect to prompt user for authorization
app.get('/login', function(req, res) {

  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = 'user-read-private user-read-email user-top-read user-read-playback-state'
  	+ ' user-modify-playback-state playlist-modify-private playlist-read-private playlist-modify-public';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

// receive the response and establish authentication code global variable
app.get('/callback', function(req, res) {

	// your application requests refresh and access tokens
     // after checking the state parameter

     spotify_auth = req.query.code || null;
	console.log(spotify_auth);
     var state = req.query.state || null;
     var storedState = req.cookies ? req.cookies[stateKey] : null;

     if (state === null || state !== storedState) {
       res.redirect('/#' +
         querystring.stringify({
           error: 'state_mismatch'
         }));
     } else {
       res.clearCookie(stateKey);
       var authOptions = {
         url: 'https://accounts.spotify.com/api/token',
         form: {
           code: spotify_auth,
           redirect_uri: redirect_uri,
           grant_type: 'authorization_code'
         },
         headers: {
           'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
         },
         json: true
       };

       request.post(authOptions, function(error, response, body) {
         if (!error && response.statusCode === 200) {

           access_token = body.access_token;
           var refresh_token = body.refresh_token;

           var options = {
             url: 'https://api.spotify.com/v1/me',
             headers: { 'Authorization': 'Bearer ' + access_token },
             json: true,
           };

           // use the access token to access the Spotify Web API
           request.get(options, function(error, response, body) {
             console.log(body);
           });

           // we can also pass the token to the browser to make requests from there
           res.redirect('/loggedin#' +
             querystring.stringify({
               access_token: access_token,
               refresh_token: refresh_token,
             }));
         } else {
           res.redirect('/#' +
             querystring.stringify({
               error: 'invalid_token'
             }));
         }
       });
     }
});

function mysqlEscape(stringToEscape){
    return stringToEscape
        .replace("\\", "\\\\")
        .replace("\'", "\\\'")
        .replace("\"", "\\\"")
        .replace("\n", "\\\n")
        .replace("\r", "\\\r")
        .replace("\x00", "\\\x00")
        .replace("\x1a", "\\\x1a");
}

app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});
