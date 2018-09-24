
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

module.exports = {
    verificarToken: ( req, res, next) => {
        var token = req.query.token;
        jwt.verify(token, SEED, ( err, decoded) => {  // Permite verificar si el token es seguro 
            if (err){
                return res.status(400).json({
                    ok:false,
                    mensaje: 'Token incorrecto',
                    errros: err
                })
            };
            req.usuario = decoded.usuario;
            next();
            // return res.status(200).json({
            //     ok:false,
            //     decoded: decoded
            // })
        });
    }
}