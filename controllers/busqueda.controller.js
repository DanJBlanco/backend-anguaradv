// ==============================
// Modulos
// ==============================
var Hospital = require('../models/hospital.model');
var Medico = require('../models/medico.model');
var Usuario = require('../models/usuario.model');

// ==============================
// Busqueda general en todas las tablas
// ==============================
var busquedaGeneral = {
    buscarHospitales: (regex) => {
        return new Promise((resolve, reject) => {
            Hospital
                .find({ nombre: regex })
                .populate('usuario', 'nombre email')
                .exec((err, hospitales) => {
                    if (err) {
                        reject('Error al buscar hospitales', err);
                    } else {
                        resolve(hospitales);
                    }
                });
        })
    },
    buscarMedicos: (regex) => {

        return new Promise((resolve, reject) => {
            Medico
                .find({ nombre: regex })
                .populate('usuario', 'nombre email')
                .populate('hospital')
                .exec((err, medicos) => {
                    if (err) {
                        reject('Error al buscar medicos', err);
                    } else {
                        resolve(medicos);
                    }
                });
        })
    },
    buscarUsuarios: (regex) => {
        return new Promise((resolve, reject) => {
            Usuario
                .find({}, 'nombre email role')
                .or([{ 'nombre': regex, 'email': regex }])
                .exec((err, usuarios) => {
                    if (err) {
                        reject('Error al buscar usuarios', err);
                    } else {
                        resolve(usuarios);
                    }
                });
        })
    }
};

// ==============================
// Busqueda especifica por coleccion
// ==============================
var busquedaColeccion = {

}

module.exports = {
    get: (req, res, next) => {

        var busqueda = req.params.busqueda;
        var regex = new RegExp(busqueda, 'i');

        Promise.all([ // Ejecuta todas las promesas paralelamente
            busquedaGeneral.buscarHospitales(regex),
            busquedaGeneral.buscarMedicos(regex),
            busquedaGeneral.buscarUsuarios(regex)
        ]).then(respuestas => {
            res.status(200).json({
                ok: true,
                hospitales: respuestas[0],
                medicos: respuestas[1],
                usuarios: respuestas[2]
            })

        });

    },
    getColeccion: (req, res, next) => {

        var tabla = req.params.tabla;
        var busqueda = req.params.busqueda;
        var regex = new RegExp(busqueda, 'i');

        var promesa;

        switch (tabla) {
            case 'usuarios':
                promesa = busquedaGeneral.buscarUsuarios(regex);
                break;

            case 'hospitales':
                promesa = busquedaGeneral.buscarHospitales(regex);
                break;

            case 'medicos':
                promesa = busquedaGeneral.buscarMedicos(regex);
                break;

            default:
                res.status(400).json({
                    ok:false,
                    mensaje: 'Los tipos de coleccion/tabla a buscar, solo son: usuarios, hospitales, medicos',
                    error: {message: 'Tipo de tabla/ collecton no válido'}
                });
        }

        promesa.then(data=>{
            res.status(200).json({
                ok: true,
                [tabla]: data // [tabla] usa como llave el valor de la variable tabla
            })
        })

    }
}