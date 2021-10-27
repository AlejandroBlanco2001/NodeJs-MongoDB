const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usuarioSchema = new Schema({
    RUT: {
        type: String,
        unique: true,
        required: true,
        index: true
    },
    nombre: {
        type: String,
        unique: false,
        required: false,
        index: false,
        default: ' - '
    }
});

const usuarioModel = mongoose.model('Usuario', usuarioSchema);
const llaves = ["_id", "RUT", "nombre"];
const tipoDato = ["ObjectId", "text", "text"];

module.exports = {
    usuarioModel,
    llaves,
    tipoDato
};