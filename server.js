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

/************** UPDATE THE DATABASE **********/


/********** SESSION FUNCTIONS *************/
//called when "start a session" button is pressed
//input: userURI
app.get('/:userURI/create', function(req,res){
    //start a session in the database
    connection.connect();
    connection.query("INSERT INTO jam(host) VALUES (" + req.params.userURI + ")");
    res.send("MADE");
    //handle rendering the temp page by ID
//    res.setHeader('Content-Type', 'application/json');
//    res.send(JSON.stringify({ a: 1 }));
});


app.post('/:userURI/destroy', function(req,res){
    // remove page from db
});




app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});
