var express = require('express');
var router = express.Router();
var mdAutenticacion = require('../middlewares/autenticacion');


// ==============================
//  Controladores
// ==============================
var usuarioControler = require('../controllers/usuario.controller');
var loginController = require('../controllers/login.controller');
var hospitalController = require('../controllers/hospital.controller');
var medicoController = require('../controllers/medico.controller');
var busquedaController = require('../controllers/busqueda.controller');
var subirArchivoController = require('../controllers/subirArchivo.controller');
var imagenesController = require('../controllers/imagenes.controller');


// ==============================
//  Rutas Usuarios
// ==============================
router.route('/usuario')
.get(usuarioControler.getAllUser)
.post(mdAutenticacion.verificarToken, usuarioControler.registrarUsuario);
router.route('/usuario/:id')
.put(mdAutenticacion.verificarToken, usuarioControler.actualizarUsuario)
.delete(mdAutenticacion.verificarToken, usuarioControler.eliminarUsuario);

// ==============================
//  Rutas Login
// ==============================
router.route('/login')
.post(loginController.loginUsuario);
router.route('/login/google')
.post(loginController.loginGoogle);


// ==============================
//  Rutas Hospitales
// ==============================
router.route('/hospital')
.get(hospitalController.getAll)
.post(mdAutenticacion.verificarToken, hospitalController.crearHospital);
router.route('/hospital/:id')
.put(mdAutenticacion.verificarToken, hospitalController.actualizarHospital)
.delete(mdAutenticacion.verificarToken, hospitalController.eliminarHospital);

// ==============================
// Rutas Médicos
// ==============================
router.route('/medico')
.get(medicoController.getAll)
.post(mdAutenticacion.verificarToken, medicoController.post);
router.route('/medico/:id')
.put(mdAutenticacion.verificarToken, medicoController.put)
.delete(mdAutenticacion.verificarToken, medicoController.delete);

// ==============================
// Rutas busqueda
// ==============================
router.route('/busqueda/todo/:busqueda')
.get(busquedaController.get)
router.route('/busqueda/coleccion/:tabla/:busqueda')
.get(busquedaController.getColeccion)

// ============================================================
// Rutas subir archivos
// ============================================================
router.route('/upload/:coleccion/:id')
.put(subirArchivoController.subirImagen)

// ============================================================
// Ruta de Imagenes
// ============================================================
router.route('/img/:coleccion/:img')
.get(imagenesController.getAll);

module.exports = router;