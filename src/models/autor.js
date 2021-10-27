const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const autorSchema = new Schema({
    nombre: {
        type: String,
        unique: true,
        required: true,
        index: true
    }
});

const autorModel = mongoose.model('Autor', autorSchema);
const llaves = ["_id", "nombre"];
const tipoDato = ["ObjectId", "text"];

module.exports = {
    autorModel,
    llaves,
    tipoDato
};