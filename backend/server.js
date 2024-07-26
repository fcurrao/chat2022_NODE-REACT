//////// BASICOS DE SERVIDOR
const express = require('express'); //////// QUE USA EXPRES
var path = require("path");
const app = express(); //////// CREO LA APP PARA LOS USE CON EXPRESS

const http = require('http'); //////// QUE USA HTTP
const server = http.createServer(app); //////// CREO SERVER CON EL HTTP Y EL APP

////  PARTE DONDE UTILIZO EL SOCKET.IO PARA DETERMINAR PARAMETROS DE PERMISOS
const io = require("socket.io")(server,{cors:{origin:"*",methods:["GET","POST"],credentials:true,allowedHeaders:["Access-Control-Allow-Origin:*"]}});

//// PARTE DONDE CONECTO AL FRONT Y PERMITO LAS CORS
const cors = require('cors');
app.use(express.static(path.join(__dirname, "public")));
app.use(cors({ origin: 'http://localhost:3000' })); 

//// IO ES IO (socket.io) QUE ME CONECTA CON EL FRONT! 
io.on('connection', socket => { //////// CUANDO EL FRONT ME DEVUELVE QUE ESTOY CONECTADO ENTRA A LA FUNCION
  console.log('Usuario conectado ' + socket.id);

  // let userId = socket.id  
  // socket.on('idUser', () => {     // ESCUCHO EL EVENTO IDUSER EN FRONT CUANDO UN USER SE CONECTO (sin importar si envio nada??), ENTONCES  REALIZO LA SIGUIENTE FUNCION FLECHA
  //  io.emit('idUser', userId);    //  QUE ENVIA ESE IDUSER A FRONT
  // });                            // luego podria recibirlo con un on en el front y seria su id de user.
//// DENTRO DEL CONNECTION , PONGO LOS ON ( EMIT DENTRO)                                      
  socket.on('chat message', message => {  //////// ESCUCHO EL EVENTO CHAT MESSAGE EN FRONT (cuando ni bien se envia por el usuario (formateado como objeto)) 
    io.emit('chat message', message);     //////// Y ENVIA ESE MENSAJE AL FRONT
  });

});
;


//////// levanto el servidor
server.listen(4000, () => { 
  console.log('Servidor está corriendo en el puerto 4000');
});
