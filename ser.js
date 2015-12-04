var restify = require('restify');

function respond(req, res, next) {
  var cuerpo_del_mensaje = {
    "mensaje": 'HOLA:' + req.params.name
  }
  res.setHeader('Content-Type', 'application/json');
  res.send(cuerpo_del_mensaje);
  next();
}

var server = restify.createServer();
server.get('/hello/:name', respond);


server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});

