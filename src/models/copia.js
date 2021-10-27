const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const copiaSchema = new Schema({
    edicion: {
        type: Schema.Types.ObjectId,
        ref: 'Edición',
        unique: false,
        required: true,
        index: true
    },
    numero: {
        type: Number,
        unique: true,
        required: true,
        index: true
    }
});

const copiaModel = mongoose.model('Copia', copiaSchema);
const llaves = ["_id", "edicion", "numero"];
const tipoDato = ["ObjectId", "select", "number"];

module.exports = {
    copiaModel,
    llaves,
    tipoDato
};