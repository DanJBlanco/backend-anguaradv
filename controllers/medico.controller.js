var Medico = require('../models/medico.model');

module.exports = {

    // ==============================
    //  Obtener todos los medicos
    // ==============================
    getAll: (req, res, next) => {
        var desde = req.query.desde || 0;
        desde = Number(desde);
        Medico.find({})
            .skip(desde)
            .limit(5)
            .populate('usuario', 'nombre email')
            .populate('hospital')
            .exec(
            (err, medicos) => {
            if(err){
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando medico',
                    errors: err
                });
            }
            Medico.count({}, (err, conteo)=>{

                res.status(200).json({
                    ok: true,
                    medicos: medicos,
                    total: conteo
                })
            });
        });

    },

    // ==============================
    //  Crear Medicos, insertar en la base de datos
    // ==============================   
    post: (req, res, next) => {

        var body = req.body;
        var medico = new Medico({
            nombre: body.nombre,
            img: body.img,
            usuario: req.usuario,
            hospital: body.hospital
        });

        medico.save( (err, medicoGuardado) => {
            if(err){
                return res.status(400).json({
                    ok:false,
                    mensaje:'Error al crear medico',
                    errors:err
                }
            )};

            res.status(201).json({
                ok: true,
                medico: medicoGuardado,
                usuarioToken: req.usuario,  // hospital guardado en el token, contiene informacion del hospital que creo el token
            })
        });

    },

    // ==============================
    // Actualizar datos de un medico
    // ==============================
    put: (req, res, next) => {
        

        var id = req.params.id;
        var body = req.body;
        
        Medico.findById(req.params.id, (err,  medico) => {

            if ( err ) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar medico',
                    errors: err
                })
            }

            if ( !medico ){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El medico con el id ' + id + ' no existe',
                    errors: {message: 'No existe un medico con ese ID'}
                })
            }

            medico.nombre = body.nombre;
            medico.img = body.img;
            medico.usuario = req.usuario;
            medico.hospital = body.hospital
    
            medico.save( (err, medicoGuardado) => {
                
                if ( err ) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error al actualizar medico',
                        errors: err
                    })
                };

                res.status(201).json({
                    ok: true,
                    medico: medicoGuardado
                });
            });


        });

    },

    // ==============================
    // Eliminar Medico
    // ==============================
    delete: (req, res, next) => {
        

        var id = req.params.id;

        Medico.findByIdAndRemove(id, (err,   medicoBorrado) => {

            if ( err ) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al borrar hospital',
                    errors: err
                })
            };
            if ( !medicoBorrado ) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No existe medico con id: ' + id,
                    errors: {message:err}
                })
            };

            return res.status(200).json({
                ok: true,
                medico: medicoBorrado
        });

        });
    },
}