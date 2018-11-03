//LINK BETWEEN DATABASE AND WEBAPP 
var mysql = require('mysql');
var express = require('express');
var app = express();

//connect to the jukebox database
var connection = mysql.createConnection({
    host     : 'junkeboxinstance.c4jsultqkn4z.us-east-2.rds.amazonaws.com',
    user     : 'EuraShin',
    password : 'mypassword',
    database : 'jukend'
});

/************ START OUR APP ************/
// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8080;

// set the view engine to ejs
app.set('view engine', 'ejs');

// make express look in the public directory for assets (css/js/img)
app.use(express.static(__dirname + '/public'));

// set the home page route
app.get('/', function(req, res) {
    res.render('index');
});


/********** SESSION FUNCTIONS *************/
//called when "start a session" button is pressed
//input: userURI
app.post('/create', function(req,res){
    //start a session in the database
    connection.connect();
    connection.query("INSERT INTO jam(host) VALUES ('" + req.headers.useruri + "')"); //make session
    connection.query("SELECT user_name AS name FROM user WHERE user_uri = '" + req.headers.useruri + "'", function(err, rows, fields) { //
        if (err) throw err;
        //handle rendering the temp page by ID
        var link = '/' + req.headers.useruri + '/join'; 
        //res.render('sessionPage', {sessionLink: link, users: users}); 
        res.send(rows);
        connection.end(); 
    });

});

//called when "join a session" button is pressed
app.post('/join', function(req, res) {
    connection.connect();
    //add user to session
    connection.query("INSERT INTO joins(host_uri, user_uri) VALUES ('" + req.headers.hosturi + "','" + req.headers.useruri + "')");
    
    //handle rendering the temp page by ID
    var link = '/' + req.headers.hosturi + '/join'; 
    //select all the users in session
    connection.query("SELECT DISTINCT user_name FROM user,joins,jam WHERE jam.host ='" +  req.headers.hosturi + 
            "' AND user.user_uri = joins.user_uri", function(err, rows, fields) { 
        if (err) throw err;
        var other_users = rows; 
        //select the host user 
        connection.query("SELECT user_name AS name FROM user WHERE user_uri = '" + req.headers.hosturi + "'", function(err, rows, fields) { //
            if (err) throw err; 
            var host = rows;
            console.log(host);
            console.log(other_users);
            console.log(link);
//            res.render('sessionPage', {sessionLink: link, users: users}); 
            res.send(host.concat(other_users));
            connection.end();     
        });
    });
    
});

app.post('/:userURI/destroy', function(req,res){
    
});

app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});
