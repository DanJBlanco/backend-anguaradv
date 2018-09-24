var Hospital = require('../models/hospital.model');

module.exports = {

    // ==============================
    //  Obtener todos los hopitales
    // ==============================
    getAll: (req, res, next) => {
        var desde = req.query.desde || 0;
        desde = Number(desde);
        Hospital.find({})
            .skip(desde)
            .limit(5)
            .populate('usuario', 'nombre email')
            .exec(
            (err, hospitales) => {
            if(err){
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando hospital',
                    errors: err
                });
            }
            Hospital.count({}, (err, conteo) =>{

                res.status(200).json({
                    ok: true,
                    hospitales: hospitales,
                    total: conteo
                })
            });
        });

    },

    // ==============================
    //  Crear hospitales, insertar en la base de datos
    // ==============================
    crearHospital: (req, res, next) => {

        var body = req.body;
        var hospital = new Hospital({
            nombre: body.nombre,
            img: body.img,
            usuario: req.usuario
        });

        hospital.save( (err, hospitalGuardado) => {
            if(err){
                return res.status(400).json({
                    ok:false,
                    mensaje:'Error al crear hospital',
                    errors:err
                }
            )};

            res.status(201).json({
                ok: true,
                hospital: hospitalGuardado,
                usuarioToken: req.usuario,  // usuario guardado en el token, contiene informacion del usuario que creo el token
            })
        });

    },

    // ==============================
    // Actualizar datos de un Hospital
    // ==============================
    actualizarHospital: (req, res, next) => {
        

        var id = req.params.id;
        var body = req.body;
        
        Hospital.findById(req.params.id, (err,  hospital) => {

            if ( err ) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar hospital',
                    errors: err
                })
            }

            if ( !hospital ){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El hospital con el id ' + id + ' no existe',
                    errors: {message: 'No existe un hospital con ese ID'}
                })
            }

            hospital.nombre = body.nombre;
            hospital.img = body.img;
            hospital.usuario = req.usuario;
    
            hospital.save( (err, hospitalGuardado) => {
                
                if ( err ) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error al actualizar hospital',
                        errors: err
                    })
                };

                res.status(201).json({
                    ok: true,
                    hospital: hospitalGuardado
                });
            });


        });

    },

    // ==============================
    // Eliminar Hospital
    // ==============================
    eliminarHospital: (req, res, next) => {
        

        var id = req.params.id;

        Hospital.findByIdAndRemove(id, (err,  hospitalBorrado) => {

            if ( err ) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al borrar hospital',
                    errors: err
                })
            };
            if ( !hospitalBorrado ) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No existe hospital con id: ' + id,
                    errors: {message:err}
                })
            };

            return res.status(200).json({
                ok: true,
                hospital: hospitalBorrado
        });

        });
    },
}