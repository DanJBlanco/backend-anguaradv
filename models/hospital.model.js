var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var hospitalScheme = new Schema({
    nombre: {type: String, required: [true, 'El Nombre es Necesario'] },
    img: {type: String, required: false },
    usuario: {type: Schema.Types.ObjectId, ref: 'Usuario' },
    },
    {collection: 'hospitales'} // Nombre de la coleccion
);

module.exports = mongoose.model('Hospital', hospitalScheme);