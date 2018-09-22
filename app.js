// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// Inicializar Variables
var app = express();

// Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// Importar Rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/appRoutes');

// Conexion a la base de datos

mongoose.connection.openUri('mongodb://admin:admin123@ds263832.mlab.com:63832/hospitaldb',
( err, res) =>{
    if( err ) throw err;

    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');

})

// Rutas
app.use('/', usuarioRoutes);


// Escuchar Peticiones

app.listen(3000, () => {
    console.log('Express server corriendo en port 3000: \x1b[32m%s\x1b[0m', 'online');
});
