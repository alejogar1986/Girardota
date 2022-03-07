var express                 = require("express"); 
var app                     = express();
var server                  = require('http').createServer(app);
var bodyParser				= require('body-parser')	
var path					= require('path')	
const configuration         = require('./modules/config');
const http_modules		    = require('./modules/http-modules');
const lpr		            = require('./modules/lpr');
const register		        = require('./register');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.static(path.join(__dirname,"www")));
app.all('*', function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "X-Requested-With");
   res.send('SecurOS LPR Classification service running...');   
   next();
});

// ---- START UP SERVER -----
var port = 80// configuration.serverPort;
server.listen(port);
console.info('Server listening on port '+port)
// 
// HOMEPAGE
app.get('/', function(req, res) {
    res.write('SecurOS LPR Classification service running...');             
});
