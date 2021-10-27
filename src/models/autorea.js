const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const autoreaSchema = new Schema({
    autor: {
        type: Schema.Types.ObjectId,
        ref: 'Autor',
        unique: false,
        required: true,
        index: true
    },
    libro: {
        type: Schema.Types.ObjectId,
        ref: 'Libro',
        unique: false,
        required: true,
        index: true
    }
});

const autoreaModel = mongoose.model('Autorea', autoreaSchema);
const llaves = ["_id", "autor", "libro"];
const tipoDato = ["ObjectId", "select", "select"];

module.exports = {
    autoreaModel,
    llaves,
    tipoDato
};