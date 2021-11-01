const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const prestamoSchema = new Schema({
    copia: {
        type: Schema.Types.ObjectId,
        ref: 'Copia',
        unique: false,
        required: true,
        index: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        unique: false,
        required: true,
        index: true
    },
    fecha_Prestamo: {
        type: Date,
        unique: false,
        required: true,
        index: false,
        default: new Date(Date.now())
    },
    fecha_Devolucion: {
        type: Date,
        unique: false,
        required: true,
        index: false,
        default: new Date(Date.now())
    }
});

const prestamoModel = mongoose.model('Préstamo', prestamoSchema);
const llaves = ["_id", "copia", "edicion", "usuario", "fecha_Prestamo", "fecha_Devolucion"];
const tipoDato = ["ObjectId", "select", "select", "select", "date", "date"];

module.exports = {
    prestamoModel,
    llaves,
    tipoDato
};