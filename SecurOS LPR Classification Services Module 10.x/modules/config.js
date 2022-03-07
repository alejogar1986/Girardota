// SecurOS 10.5  Dashboard //

//Securos  Information
var Securos_Server_IP = "127.0.0.1";
//Rest Api credentials 
var RestApi_port = '8888';
var RestApi_user = 'iss';
var RestApi_pass = 'iss';
var FaceApi_port = '21093';

//Postgres Information
var Postgres_server_ip = "127.0.0.1";
var Postgres_user = "postgres";
var Postgres_pass = "postgres";
var face_DB = "detections105";//"facex104";detections104
var watch_DB = "watchlist105";//"wl104";watchlist104
var Securos_DB = "securos";
var Postgres_port = "5432";
//use this port to access via webbrowser to SecurOS LPR Dashboard
//for Example http://127.0.0.1:8181

//Dashboard Port #
var Server_port = 2345;

//Do not modify this part
exports.restapi_port = RestApi_port;
exports.restapi_user = RestApi_user;
exports.restapi_pass = RestApi_pass;
exports.face_port = FaceApi_port; 
exports.ip   = Securos_Server_IP;
exports.serverPort = Server_port;
exports.postgres_port = Postgres_port;
exports.face_db = face_DB;
exports.watch_db = watch_DB;
exports.Securos_DB = Securos_DB;
exports.postgres_pass = Postgres_pass;
exports.postgres_user = Postgres_user;
exports.postgres_ip = Postgres_server_ip;
