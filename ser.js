var restify = require('restify');
var pg = require('pg');

//postgres
var conString = "postgres://postgres:josue@127.0.0.1/api";;
var client = new pg.Client(conString);
client.connect();         
//


function consulta(req, res, next){

	client.query('SELECT * FROM ueconomicas',function(err, result) {
		//if(req.accepts('text/plain'))  res.setHeader('Content-Type', 'text/plain'); cabecera Accept
		
		res.setHeader('Content-Type', 'text/plain'); // text/plain
		res.send(result.rows);

		if(err){
			res.stats(404);
			res.send("404:Not fount");}
	});


	//client.query('SELECT * FROM ueconomicas $1', [idpelicula], function(err, result) {console.log(result.rows);});
	
};

function respond(req, res, next) {
  var cuerpo_del_mensaje = {
    "mensaje": 'HOLA:' + req.params.name
  }
  res.setHeader('Content-Type', 'application/json'); // text/plain
  res.send(cuerpo_del_mensaje);
  next();
}

var server = restify.createServer();
server.get('/hello/:name', respond);
server.get('/agricultura', consulta);

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});

