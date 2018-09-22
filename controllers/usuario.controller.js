var express = require('express');

var Usuario = require('../models/usuario.model');

var bcrypt = require('bcryptjs');

module.exports = {

    // ==============================
    //  Obtener todos los usuarios
    // ==============================

    getAllUser: (req, res, next ) => {
        Usuario.find({},'nombre email img role')
            .exec(
            (err, usuarios) => {
            if(err){
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando usuario',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                usuarios: usuarios
            })
        });

    },

    // ==============================
    //  Registrar usuario
    // ==============================

    registrarUsuario: (req, res, next ) => {

        var body = req.body;
        var salt = bcrypt.genSaltSync(10);
        var usuario = new Usuario({
            nombre: body.nombre,
            email: body.email,
            password: bcrypt.hashSync(body.password,salt),
            img: body.img,
            role: body.role
        });

        usuario.save( (err, usuarioGuardado) => {
            if(err){
                return res.status(400).json({
                    ok:false,
                    mensaje:'Error al crear usuario',
                    errors:err
                }
            )};
            
            res.status(201).json({
                ok: true,
                usuario: usuarioGuardado,
                usuarioToken: req.usuario,
            })
        });

    },

    // ==============================
    //  Actualizar usuario
    // ==============================

    actualizarUsuario: ( req, res, next ) => {

        var id = req.params.id;
        var body = req.body;
        
        Usuario.findById(req.params.id, (err,  usuario) => {

            if ( err ) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar usuario',
                    errors: err
                })
            }

            if ( !usuario ){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El usuario con el id ' + id + ' no existe',
                    errors: {message: 'No existe un usuario con ese ID'}
                })
            }

            usuario.nombre = body.nombre;
            usuario.email = body.email;
            usuario.role = body.role;
    
            usuario.save( (err, usuarioGuardado) => {
                
                if ( err ) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error al actualizar usuario',
                        errors: err
                    })
                };

                usuarioGuardado.password = ':)';

                res.status(201).json({
                    ok: true,
                    usuario: usuarioGuardado
                });
            });


        });

    },

    // ==============================
    //  Eliminar usuario
    // ==============================

    eliminarUsuario: ( req, res, next ) => {

        var id = req.params.id;

        Usuario.findByIdAndRemove(id, (err,  usuarioBorrado) => {

            if ( err ) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al borrar usuario',
                    errors: err
                })
            };
            if ( !usuarioBorrado ) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No existe usuario con id: ' + id,
                    errors: {message:err}
                })
            };

            return res.status(200).json({
                ok: true,
                usuario: usuarioBorrado
        });

        });
    }
}