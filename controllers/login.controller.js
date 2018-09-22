var express = require('express');
var Usuario = require('../models/usuario.model');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

module.exports = {
    loginUsuario: ( req, res, next ) => {

        var body = req.body;

        Usuario.findOne({email: body.email}, ( err, usuarioDB ) => {
            if(err){
                return res.status(500).json({
                    ok: false,
                    message: 'Error al buscar Usuario',
                    errors: err
                })
            }

            if( !usuarioDB ){
                return res.status(400).json({
                    ok:false,
                    message:'Credenciales Incorrectas - email',
                })
            }

            if( !bcrypt.compareSync( body.password , usuarioDB.password)) {
                return res.status(400).json({
                    ok:false,
                    message:'Credenciales Incorrectas - password',
                })
            }

            // Crear un Toker!!!
            usuarioDB.password=':)';
            var token = jwt.sign(
                {usuario: usuarioDB},
                SEED,
                { expiresIn:14400 } //4 horas
            );

            return res.status(200).json({
                ok: true,
                usuario:usuarioDB,
                token:token,
                id: usuarioDB._id
            })

        });
    }
}