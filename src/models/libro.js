const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const libroSchema = new Schema({
    edicion: {
        type: Schema.Types.ObjectId,
        ref: 'Edición',
        unique: false,
        required: true,
        index: true
    },
    titulo: {
        type: String,
        unique: true,
        required: true,
        index: true
    }
});

const libroModel = mongoose.model('Libro', libroSchema);
const llaves = ["_id", "edicion", "titulo"];
const tipoDato = ["ObjectId", "select", "text"];

module.exports = {
    libroModel,
    llaves,
    tipoDato
};