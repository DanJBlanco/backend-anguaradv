var express = require('express');
var Usuario = require('../models/usuario.model');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');


var SEED = require('../config/config').SEED;
var GOOGLE_CLIENT_ID = require('../config/config').GOOGLE_CLIENT_ID;
var GOOGLE_SECRET = require('../config/config').GOOGLE_SECRET;

const { OAuth2Client } = require('google-auth-library');


module.exports = {

    // ============================================================
    // Autenticación de Google
    // ============================================================
    loginGoogle: (req, res, next) => {

        var token = req.body.token;
        const client = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_SECRET, '');

        client.verifyIdToken({
            idToken: token,
            audience: GOOGLE_CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        }, (err, loginTicket) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al autenticar token',
                    err: { message: 'Error al autenticar token' }
                })
            }
            const payload = loginTicket.getPayload();
            const userid = payload['sub'];
            // If request specified a G Suite domain:
            //const domain = payload['hd'];

            Usuario.findOne({ email: payload.email }, (err, usuario) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al buscar usuario - google',
                    });
                }

                if (usuario) {
                    // Crear un Toker!!!
                    usuario.password = ':)';
                    var token = jwt.sign({ usuario: usuario },
                        SEED, { expiresIn: 14400 } //4 horas
                    );

                    return res.status(200).json({
                        ok: true,
                        usuario: usuario,
                        token: token,
                        id: usuario._id
                    })

                } else { // si el usuario no existe

                    var usuarioG = new Usuario();
                    usuarioG.nombre = payload.name;
                    usuarioG.email = payload.email;
                    usuarioG.password = 'GooglePassword';
                    usuarioG.img = payload.picture;
                    usuarioG.google = true;

                    usuarioG.save((err, usuarioDB) => {
                        if (err) {
                            return res.status(500).json({
                                ok: false,
                                mensaje: 'Error al crear usuario - google',
                            });
                        }

                        // Crear un Toker!!!
                        usuarioDB.password = ':)';
                        var token = jwt.sign({ usuario: usuarioDB },
                            SEED, { expiresIn: 14400 } //4 horas
                        );

                        return res.status(200).json({
                            ok: true,
                            usuario: usuarioDB,
                            token: token,
                            id: usuarioDB._id
                        })


                    });
                }

            });

        });

    },

    // ============================================================
    // Autenticacion Normal
    // ============================================================
    loginUsuario: (req, res, next) => {

        var body = req.body;

        Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error al buscar Usuario',
                    errors: err
                })
            }

            if (!usuarioDB) {
                return res.status(400).json({
                    ok: false,
                    message: 'Credenciales Incorrectas - email',
                })
            }

            if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
                return res.status(400).json({
                    ok: false,
                    message: 'Credenciales Incorrectas - password',
                })
            }

            // Crear un Toker!!!
            usuarioDB.password = ':)';
            var token = jwt.sign({ usuario: usuarioDB },
                SEED, { expiresIn: 14400 } //4 horas
            );

            return res.status(200).json({
                ok: true,
                usuario: usuarioDB,
                token: token,
                id: usuarioDB._id
            })

        });
    }
}