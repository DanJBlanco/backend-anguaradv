// Requires

var express = require('express');
var mongoose = require('mongoose');

// Inicializar Variables

var app = express();

// Conexion a la base de datos

mongoose.connection.openUri('mongodb://admin:admin123@ds263832.mlab.com:63832/hospitaldb',
( err, res) =>{
    if( err ) throw err;

    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');

})

// Rutas

app.get('/', (req, res, next ) => {
    
    res.status(201).json({
        ok: true,
        mensaje: 'Peticion realiza correctamente'
    })
});

// Escuchar Peticiones

app.listen(3000, () => {
    console.log('Express server corriendo en port 3000: \x1b[32m%s\x1b[0m', 'online');
});
