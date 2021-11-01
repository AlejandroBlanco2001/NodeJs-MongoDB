const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const copiaSchema = new Schema({
    edicion: {
        type: Schema.Types.ObjectId,
        ref: 'Edición',
        required: true
    },
    numero: {
        type: Number,
        required: true
    }
});

copiaSchema.index({edicion: 1, numero: 1}, {unique: true});
const copiaModel = mongoose.model('Copia', copiaSchema);
const llaves = ["_id", "edicion", "numero"];
const tipoDato = ["ObjectId", "select", "number"];

module.exports = {
    copiaModel,
    llaves,
    tipoDato
};