var app = require('express')(),
  swig = require('swig'),
  express = require('express'),
  mysql = require('mysql'),
  bodyParser = require('body-parser'),
  http = require('http');

var expressWs = require('express-ws')(app);
var session = require('express-session')
var MySQLStore = require('express-mysql-session')(session);
var sessionStore = new MySQLStore({}, require("./service/mysql"));

/*
 * Root Path 설정
 */
require('app-module-path').addPath(__dirname);

app.engine('html', swig.renderFile);

app.set('port', process.env.PORT || 3010);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

app.use(session({
    key: 'session_cookie_name',
    secret: 'session_cookie_secret',
    store: sessionStore,
    resave: true,
    saveUninitialized: true
}));


app.use(require('express-domain-middleware'));


app.set('view cache', false);
swig.setDefaults({ cache: false });


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.all("/*.json", function(req, res, next){
	req.isJson = true;
	req.url = req.url.replace('.json', '.html');
	req.originalUrl = req.url.replace('.json', '.html');
	app.handle(req, res);
});

app.use(require("./routes/router"));

app.all("/", function(req, res) {
	res.redirect("/ohberry/login.html");
});

app.use(express.static(__dirname + '/public'));

//var clients = [];
//app.use("sendMessege", function (req, res, next) {
//
//	var storeId = req.body.storeId;
//	console.log(storeId);

//	if(clients['dfjkosdfkl0-12321-123-12312']) {
//		clients['dfjkosdfkl0-12321-123-12312'].forEach(function (ws) {
//			ws.send(JSON.stringify( {
//				message : 'ohohoho'
//			}));
//		});
//	}

//});
//
//app.ws('/:company/customer.html', function(ws, req) {
//
//	console.log("in socket");
//
//	clients.push(ws);
//
//	if(!clients['dfjkosdfkl0-12321-123-12312']) {
//		clients['dfjkosdfkl0-12321-123-12312'] = [];
//	}
//	clients['dfjkosdfkl0-12321-123-12312'] .push(ws);
//});
//
//
//app.listen(3010);


http.createServer(app).listen(app.get('port'), function(){
	  console.log('Express server listening on port ' + app.get('port'));
});
