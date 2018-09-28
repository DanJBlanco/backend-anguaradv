// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');  // Permite hacer peticiones POST de forma x-www-form-urlencoded
var fileUpload = require('express-fileupload'); // subir imagenes


// Inicializar Variables
var app = express();


// Habilitacion del corse 
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, DELETE, PUT, OPTIONS");
    next();
  });

// Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())


// default options para subir archivos
app.use(fileUpload());

// Importar Rutas
var appRoutes = require('./routes/app');
var rutasApi = require('./routes/appRoutes');

// Conexion a la base de datos

mongoose.connection.openUri('mongodb://admin:admin123@ds263832.mlab.com:63832/hospitaldb',
( err, res) =>{
    if( err ) throw err;

    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online'); // \x1b[32m%s\x1b[0m', 'online') --> permite colocar color verde en consola '%s' importante

})

// Server index config
// var serverIndex = require('serve-index');
// app.use(express.static(__dirname+'/'));
// app.use('/uploads',serverIndex(__dirname + '/uploads'));

// Rutas
app.use('/', rutasApi);


// Escuchar Peticiones
app.listen(3000, () => {
    console.log('Express server corriendo en port 3000: \x1b[32m%s\x1b[0m', 'online');
});
