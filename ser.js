var restify = require('restify');
var pg = require('pg');
var js2xmlparser = require("js2xmlparser");

//postgres
var conString = "postgres://postgres:josue@192.168.0.2/api";
var client = new pg.Client(conString);
client.connect();         
//

function respond(req, res, next) {
  var cuerpo_del_mensaje = {
    "mensaje": 'HOLA:' + req.params.name
  }
  res.send(cuerpo_del_mensaje);
  next();
}


function formato(arr,formato){
var texf = {};
for(var i=0; i<arr.length;i=i+2){
	texf[arr[i]]=arr[i+1];
} 
//console.log(String(formato));
if(formato==="text/plain"){
 texf=JSON.stringify(texf); 
}

if(formato==="application/xml"){
texf= js2xmlparser("Api",texf);
//return js2xmlparser("Agricultura",texf);
}

//console.log(texf);
return texf;       

}
var server = restify.createServer();
server.use(restify.queryParser());
server.use(restify.bodyParser());

server.get('/api/1.0/entidades', function(req, res, next) {
client.query('SELECT nombre FROM entidad',function(err, result) {
    if(result.rows.length>0){
			res.send(200, formato(["entidades",result.rows],req.headers.accept));
	}else{
			res.send(404,formato(["Error","404","descripcion","Not fount"],req.headers.accept));
		}
	});

});

server.get('/api/1.0/entidades/:id', function(req, res, next) {
	var idestado = req.params.id;
	if((/\d/.test(idestado))===true){
	client.query('SELECT nombre FROM entidad where ID = $1',[idestado],function(err, result) {
		if(result.rows.length>0){
			res.send(200, formato(["entidades",result.rows],req.headers.accept));
		}else{
			res.send(404,formato(["Error","404","descripcion","Not fount"],req.headers.accept));
		}
		});
	}else{
		res.send(400,formato(["Error","400","descripcion","Bad Request"],req.headers.accept));
	}
});

server.get('/api/1.0/entidades/:id/municipios', function(req, res, next) {
	var idestado = req.params.id;
	if((/\d/.test(idestado))===true){
	client.query('select * from municipio where identidad = $1',[idestado],function(err, result) {
	 if(result.rows.length>0){
			res.send(200, formato(["municipios",result.rows],req.headers.accept));
		}else{
			res.send(404,formato(["Error","404","descripcion","Not fount"],req.headers.accept));
		}
		});
    }else{
    	
		res.send(400,formato(["Error","400","descripcion","Bad Request"],req.headers.accept));
	}

});

server.get('/api/1.0/entidades/:id/municipios/:id2', function(req, res, next) {

	var idestado = req.params.id;
	var idmun = req.params.id2;
    if((/\d/.test(idestado))===true && (/\d/.test(idmun))===true ){
	client.query('select * from municipio where identidad = $1 and idmunicipio = $2',[idestado,idmun],function(err, result) {
        /*        if(req.accepts('text/plain')){
        	console.log("recibo plano");
        }*/
		if(result.rows.length>0){
			//console.log(formato(["municipios",result.rows],req.headers.accept));
			res.send(200, formato(["municipios",result.rows],req.headers.accept));
		}else{
			res.send(404,formato(["Error","404","descripcion","Not fount"],req.headers.accept));
		}
	});
    }else{
    	
		res.send(400,formato(["Error","400","descripcion","Bad Request"],req.headers.accept));
	}
});



server.get('/api/1.0/entidades/:id/municipios/:id2/localidades', function(req, res, next) {
	var idestado = req.params.id;
	var idmun = req.params.id2;
    if((/\d/.test(idestado))===true && (/\d/.test(idmun))===true ){
	client.query('select * from localidad where identidad=$1 and idmunicipio= $2',[idestado,idmun],function(err, result) {
		if(result.rows.length>0){
			res.send(200, formato(["localidades",result.rows],req.headers.accept));
		}else{
			res.send(404,formato(["Error","404","descripcion","Not fount"],req.headers.accept));
		}
	});
    }else{
    	
		res.send(400,formato(["Error","400","descripcion","Bad Request"],req.headers.accept));
	}
});


server.get('/api/1.0/entidades/:id/municipios/:id2/localidades/:id3', function(req, res, next) {
	var idestado = req.params.id;
	var idmun = req.params.id2;
	var idlo = req.params.id3;
    if(((/\d/.test(idestado))===true && (/\d/.test(idmun))===true ) && (/\d/.test(idlo))===true){
	client.query('select * from localidad where identidad=$1 and idmunicipio= $2 and idlocalidad=$3',[idestado,idmun,idlo],function(err, result) {
		if(result.rows.length>0){
			res.send(200, formato(["localidades",result.rows],req.headers.accept));
		}else{
			res.send(404,formato(["Error","404","descripcion","Not fount"],req.headers.accept));
		}
	});
    }else{
    	
		res.send(400,formato(["Error","400","descripcion","Bad Request"],req.headers.accept));
	}
});


server.get('/api/1.0/entidades/:id/municipios/:id2/localidades/:id3/empresas', function(req, res, next) {
	var idestado = req.params.id;
	var idmun = req.params.id2;
	var idlo = req.params.id3;

	var pa1= req.query.order || "id";
	var pa2= req.query.sorted_as || "desc";

    if(((/\d/.test(idestado))===true && (/\d/.test(idmun))===true ) && (/\d/.test(idlo))===true){

     console.log(pa1);

	client.query('select em.id,em.nombre,em.razon_social,em.scian,a.nombre as tipo_de_actividad,p.cantidad as personal,v.nombre as tipo_vialidad,v1.nombre as entrevialidad1,em.nombre_entrevialidad1,v2.nombre as entrevialidad2,em.nombre_entrevialidad2,v3.nombre as entrevialidad3,em.nombre_entrevialidad3,em.numero_exterior,em.letra_exterior,em.edificio,em.edificio_piso,em.numero_interior,em.letra_interior,sen.nombre as tipo_de_asentaminento,em.nombre_asentamiento,cen.nombre as centrocomercial,em.nombre_centrocomercial,em.numero_local,em.codigo_postal,ent.nombre as entidad,mun.nombre as municipio ,loc.nombre as localidad,em.area_geoestadistica,em.manzana,em.numero_telefonico,em.correo_electronico,em.sitio_internet,em.tipo_establecimiento,em.latitud,em.longitud,em.fecha from empresa as em  inner join  actividad as a on em.tipo_actividad = a.id inner join  personal as p on em.personal = p.id inner join  vialidad as v on em.tipo_vialidad = v.id inner join  vialidad as v1 on em.tipo_entrevialidad1 = v1.id inner join  vialidad as v2 on em.tipo_entrevialidad2 = v2.id inner join  vialidad as v3 on em.tipo_entrevialidad3 = v3.id inner join  asentamiento as sen on em.tipo_asentamiento = sen.id inner join  centrocomercial as cen on em.tipo_centrocomercial = cen.id inner join  entidad as ent on em.clave_entidad = ent.id inner join  municipio as mun on em.clave_municipio = mun.idmunicipio and em.clave_entidad= mun.identidad inner join  localidad as loc on em.clave_localidad = loc.idmunicipio and em.clave_entidad= loc.identidad and em.clave_localidad= loc.idlocalidad where em.clave_entidad=$1 and em.clave_municipio=$2 and em.clave_localidad=$3 order by id desc',[idestado,idmun,idlo],function(err, result) {
		if(result.rows.length>0){
			res.send(200, formato(["empresas",result.rows],req.headers.accept));
		}else{
			res.send(404,formato(["Error","404","descripcion","Not fount"],req.headers.accept));
		}
	});
    }else{
    	
		res.send(400,formato(["Error","400","descripcion","Bad Request"],req.headers.accept));
	}
});

server.get('/api/1.0/entidades/:id/municipios/:id2/localidades/:id3/empresas/:id4', function(req, res, next) {
	var idestado = req.params.id;
	var idmun = req.params.id2;
	var idlo = req.params.id3;
	var idem = req.params.id4;

    if(((/\d/.test(idestado))===true && (/\d/.test(idmun))===true ) && ((/\d/.test(idlo))===true && (/\d/.test(idem))===true)){
	client.query('select em.id,em.nombre,em.razon_social,em.scian,a.nombre as tipo_de_actividad,p.cantidad as personal,v.nombre as tipo_vialidad,v1.nombre as entrevialidad1,em.nombre_entrevialidad1,v2.nombre as entrevialidad2,em.nombre_entrevialidad2,v3.nombre as entrevialidad3,em.nombre_entrevialidad3,em.numero_exterior,em.letra_exterior,em.edificio,em.edificio_piso,em.numero_interior,em.letra_interior,sen.nombre as tipo_de_asentaminento,em.nombre_asentamiento,cen.nombre as centrocomercial,em.nombre_centrocomercial,em.numero_local,em.codigo_postal,ent.nombre as entidad,mun.nombre as municipio ,loc.nombre as localidad,em.area_geoestadistica,em.manzana,em.numero_telefonico,em.correo_electronico,em.sitio_internet,em.tipo_establecimiento,em.latitud,em.longitud,em.fecha from empresa as em  inner join  actividad as a on em.tipo_actividad = a.id inner join  personal as p on em.personal = p.id inner join  vialidad as v on em.tipo_vialidad = v.id inner join  vialidad as v1 on em.tipo_entrevialidad1 = v1.id inner join  vialidad as v2 on em.tipo_entrevialidad2 = v2.id inner join  vialidad as v3 on em.tipo_entrevialidad3 = v3.id inner join  asentamiento as sen on em.tipo_asentamiento = sen.id inner join  centrocomercial as cen on em.tipo_centrocomercial = cen.id inner join  entidad as ent on em.clave_entidad = ent.id inner join  municipio as mun on em.clave_municipio = mun.idmunicipio and em.clave_entidad= mun.identidad inner join  localidad as loc on em.clave_localidad = loc.idmunicipio and em.clave_entidad= loc.identidad and em.clave_localidad= loc.idlocalidad where em.clave_entidad=$1 and em.clave_municipio=$2 and em.clave_localidad=$3 and em.id=$4',[idestado,idmun,idlo,idem],function(err, result) {
		if(result.rows.length>0){
			res.send(200, formato(["empresas",result.rows],req.headers.accept));
		}else{
			res.send(404,formato(["Error","404","descripcion","Not fount"],req.headers.accept));
		}
	});
    }else{
		res.send(400,formato(["Error","400","descripcion","Bad Request"],req.headers.accept));
	}
});





server.post('/api/1.0/entidades/:id/municipios/:id2/localidades/:id3/empresas', function(req, res, next) {
	var idestado = req.params.id;
	var idmun = req.params.id2;
	var idlo = req.params.id3;
	
	if(req.is('application/json')){
	var data = {
		clave_entidad : idestado,
		clave_localidad:idlo,
		clave_municipio:idmun,
		nombre : req.body.nombre || "",
		};

    if(((/\d/.test(idestado))===true && (/\d/.test(idmun))===true ) && (/\d/.test(idlo))===true){
	client.query("INSERT INTO empresa (nombre, clave_entidad,clave_localidad, clave_municipio) values($1, $2, $3, $4)", [data.nombre,data.clave_entidad, data.clave_localidad, data.clave_municipio]);

	client.query("select id from empresa where clave_entidad= $1 and clave_localidad=$2 and clave_municipio=$3 and nombre=$4", [data.clave_entidad, data.clave_localidad, data.clave_municipio,data.nombre],function(err, result) {
		if(result.rows.length>0){
			res.send(201, formato(["empresas",result.rows],req.headers.accept));
		}else{
			res.send(404,formato(["Error","404","descripcion","Not fount"],req.headers.accept));
		}
	});

    }else{
    	
		res.send(400,formato(["Error","400","descripcion","Bad Request"],req.headers.accept));
	}

   }else{
   	res.send(415,formato(["Error","415","descripcion","Unsupported Media Type"],'application/json'));
   }


});


server.put('/api/1.0/entidades/:id/municipios/:id2/localidades/:id3/empresas/:id4', function(req, res, next) {
	var idestado = req.params.id;
	var idmun = req.params.id2;
	var idlo = req.params.id3;
	var idem = req.params.id4;

	if(req.is('application/json')){
    var salida= "";
		for(var llave in req.body){
			//console.log(llave+" = "+req.body[llave]);
			salida+=llave+" = "+req.body[llave];
		}

		console.log(salida);

	var data = {
	razon_social : req.body.razon_social || "default",
	scian : req.body.scian || "default",
	tipo_actividad : req.body.tipo_actividad || 1,
	personal : req.body.personal || 1,
	tipo_vialidad : req.body.tipo_vialidad || 1,
	nombre_vialidad : req.body.nombre_vialidad || 1,
	tipo_entrevialidad1 : req.body.tipo_entrevialidad1 || 1,
	nombre_entrevialidad1 : req.body.nombre_entrevialidad1 || 1,
	tipo_entrevialidad2 : req.body.tipo_entrevialidad2 || 1,
	nombre_entrevialidad2 : req.body.nombre_entrevialidad2 || 1,
	tipo_entrevialidad3 : req.body.tipo_entrevialidad3 || 1,
	nombre_entrevialidad3 : req.body.nombre_entrevialidad3 || 1,
	numero_exterior : req.body.numero_exterior || 1,
	letra_exterior : req.body.letra_exterior || "default",
	edificio : req.body.edificio || "default",
	edificio_piso : req.body.edificio_piso || "default",
	numero_interior : req.body.numero_interior || 1,
	letra_interior : req.body.letra_interior || "default",
	tipo_asentamiento : req.body.tipo_asentamiento || 1,
	nombre_asentamiento : req.body.nombre_asentamiento || "default",
	tipo_centrocomercial : req.body.tipo_centrocomercial || 1,
	nombre_centrocomercial : req.body.nombre_centrocomercial || "default",
	numero_local : req.body.numero_local || "default",
	codigo_postal : req.body.codigo_postal || "default",
	area_geoestadistica : req.body.area_geoestadistica || "default",
	manzana : req.body.manzana || "default",
	numero_telefonico : req.body.numero_telefonico || "default",
	correo_electronico : req.body.correo_electronico || "default",
	sitio_internet : req.body.sitio_internet || "default",
	tipo_establecimiento : req.body.tipo_establecimiento || "default",
	latitud : req.body.latitud || 32.62893467,
	longitud : req.body.longitud || 32.62893467
	};

    if(((/\d/.test(idestado))===true && (/\d/.test(idmun))===true ) && ((/\d/.test(idlo))===true && (/\d/.test(idem))===true)){

	client.query("UPDATE empresa SET razon_social=($1),scian=($2),tipo_actividad=($3),personal=($4),tipo_vialidad=($5),nombre_vialidad=($6),tipo_entrevialidad1=($7),nombre_entrevialidad1=($8),tipo_entrevialidad2=($9),nombre_entrevialidad2=($10),tipo_entrevialidad3=($11),nombre_entrevialidad3=($12),numero_exterior=($13),letra_exterior=($14),edificio=($15),edificio_piso=($16),numero_interior=($17),letra_interior=($18),tipo_asentamiento=($19),nombre_asentamiento=($20),tipo_centrocomercial=($21),nombre_centrocomercial=($22),numero_local=($23),codigo_postal=($24),area_geoestadistica=($25),manzana=($26),numero_telefonico=($27),correo_electronico=($28),sitio_internet=($29),tipo_establecimiento=($30),latitud=($31),longitud=($32) where id=($33)", [data.razon_social,data.scian,data.tipo_actividad,data.personal,data.tipo_vialidad,data.nombre_vialidad,data.tipo_entrevialidad1,data.nombre_entrevialidad1,data.tipo_entrevialidad2,data.nombre_entrevialidad2,data.tipo_entrevialidad3,data.nombre_entrevialidad3,data.numero_exterior,data.letra_exterior,data.edificio,data.edificio_piso,data.numero_interior,data.letra_interior,data.tipo_asentamiento,data.nombre_asentamiento,data.tipo_centrocomercial,data.nombre_centrocomercial,data.numero_local,data.codigo_postal,data.area_geoestadistica,data.manzana,data.numero_telefonico,data.correo_electronico,data.sitio_internet,data.tipo_establecimiento,data.latitud,data.longitud,idem],function(err, result) {
		//console.log(result);
		console.log(err);
		if(err===null) res.send(200, formato(["estatus","actualizado"],req.headers.accept));

	});

    }else{
    	
		res.send(400,formato(["Error","400","descripcion","Bad Request"],req.headers.accept));
	}

   }else{
   	res.send(415,formato(["Error","415","descripcion","Unsupported Media Type"],'application/json'));
   }


});





server.del('/api/1.0/entidades/:id/municipios/:id2/localidades/:id3/empresas/:id4',function(req,res){
	var idestado = req.params.id;
	var idmun = req.params.id2;
	var idlo = req.params.id3;
	var idem = req.params.id4;
	if(((/\d/.test(idestado))===true && (/\d/.test(idmun))===true ) && ((/\d/.test(idlo))===true && (/\d/.test(idem))===true)){

        client.query("DELETE from empresa where clave_entidad= $1 and clave_localidad=$2 and clave_municipio=$3 and id=$4",[idestado,idlo,idmun,idem], function(err, result) {

	  console.log(err);
		if(err===null) res.send(200, formato(["estatus","eliminado"],req.headers.accept));

	});

    }else{
    	
		res.send(400,formato(["Error","400","descripcion","Bad Request"],req.headers.accept));
	}

});








	
	

        
        

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});

