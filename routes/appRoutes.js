var express = require('express');
var router = express.Router();
var mdAutenticacion = require('../middlewares/autenticacion');

var usuarioControler = require('../controllers/usuario.controller');
var loginController = require('../controllers/login.controller');


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
.post(loginController.loginUsuario)


module.exports = router;