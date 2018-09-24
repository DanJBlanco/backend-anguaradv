var fs = require('fs');

// ============================================================
// Modelos
// ============================================================
var Usuario = require('../models/usuario.model');
var Hospital = require('../models/hospital.model');
var Medico = require('../models/medico.model');


// funciones que actualizan las imagenes en las colecciones

function actualizarImagenColeccion(coleccion, id, nombreArchivo, res) {

    // ============================================================
    // Actualizar imagen a usuario
    // ============================================================
    if (coleccion === 'usuarios') {
        Usuario.findById(id, (err, usuario) => {
            if (err) {
                errorEnSolicitud(res,500,'Error al buscar usuario',err);
            };

            // si existe imagen anterior, se elimina
            var pathAnterior = `./uploads/${coleccion}/${usuario.img}`;

            if (fs.existsSync(pathAnterior)) {
                fs.unlink(pathAnterior, (err) => {
                    if (err) {
                        errorEnSolicitud(res,500,'Error al eliminar imagen anterior',err);
                    }
                });
            };

            usuario.img = nombreArchivo; 

            usuario.save((err, usuarioActualizado) => {
                if (err) {
                    errorEnSolicitud(res,400,'Error al actualizar imagen en usuario', err);
                };

                usuarioActualizado.password= ':)';
                
                res.status(200).json({
                    ok: true,
                    mensaje: 'Usuario - Imagen actualizada',
                    usuario: usuarioActualizado
                });
            });
        });
    }

    // ============================================================
    // Actualizar imagen a hospital
    // ============================================================
    if (coleccion === 'hospitales') {
        Hospital.findById(id, (err, hospital)=>{
            if (err) {
                errorEnSolicitud(res,500,'Error al buscar hospital',err);
            };

            // si existe imagen anterior, se elimina
            var pathAnterior = `./uploads/${coleccion}/${hospital.img}`;

            if (fs.existsSync(pathAnterior)) {
                fs.unlink(pathAnterior, (err) => {
                    if (err) {
                        errorEnSolicitud(res,500,'Error al eliminar imagen anterior',err);
                    }
                });
            };

            hospital.img = nombreArchivo; 

            hospital.save((err, hospitalActualizado) => {
                if (err) {
                    errorEnSolicitud(res,400,'Error al actualizar imagen en hospital', err);
                };

                res.status(200).json({
                    ok: true,
                    mensaje: 'Hospital - Imagen actualizada',
                    hospital: hospitalActualizado
                });
            });
        })
    }

    // ============================================================
    // Actualizar imagen a medico
    // ============================================================
    if (coleccion === 'medicos') {
        Medico.findById(id,(err, medico)=>{
            if (err) {
                errorEnSolicitud(res,500,'Error al buscar medico',err);
            };

            // si existe imagen anterior, se elimina
            var pathAnterior = `./uploads/${coleccion}/${medico.img}`;

            if (fs.existsSync(pathAnterior)) {
                fs.unlink(pathAnterior, (err) => {
                    if (err) {
                        errorEnSolicitud(res,500,'Error al eliminar imagen anterior',err);
                    }
                });
            };

            medico.img = nombreArchivo; 

            medico.save((err, medicoActualizado) => {
                if (err) {
                    errorEnSolicitud(res,400,'Error al actualizar imagen en medico', err);
                };

                res.status(200).json({
                    ok: true,
                    mensaje: 'Medico - Imagen actualizada',
                    medico: medicoActualizado
                });
            });
        });
    }
}

function errorEnSolicitud(res, numError, mensaje, err){
    return res.status(numError).json({
        ok: false,
        mensaje: mensaje,
        error: err
    })
}

module.exports = {
    subirImagen: (req, res, next) => {

        var coleccion = req.params.coleccion;
        var id = req.params.id;

        // validacion de tipo de coleccion
        var coleccionValidas = ['usuarios', 'hospitales', 'medicos'];

        if (coleccionValidas.indexOf(coleccion) < 0) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error - Coleccion no valida',
                error: { message: 'las colecciones validas son ' + coleccion.join(', ') }
            })
        };

        // Validacion de que se cargara una imagen
        if (!req.files) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al cargar imagen',
                error: { message: 'No se cargo archivo para la imagen' }
            })
        };

        var archivo = req.files.imagen;
        var archivoSegmentado = archivo.name.split('.');
        var extensionArchivo = archivoSegmentado[archivoSegmentado.length - 1];
        var extensiones = ['jpg', 'png', 'gif', 'jpeg'];

        // VAlidacion de que el archivo sea una imagen
        if (extensiones.indexOf(extensionArchivo) < 0) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error - Extension no valida',
                error: { message: 'las extensiones validas son ' + extensiones.join(', ') }
            })
        };

        // Nombre personalizado de imagen
        // 12312312321-324.png
        var nombreArchivo = `${id}-${ new Date().getMilliseconds() }.${extensionArchivo}`;

        // Mover el archivo a un path en particular
        var path = `./uploads/${coleccion}/${nombreArchivo}`;

        archivo.mv(path, err => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al mover el archivo',
                    error: err
                })
            };
            actualizarImagenColeccion(coleccion, id, nombreArchivo, res);
        });
    }
};