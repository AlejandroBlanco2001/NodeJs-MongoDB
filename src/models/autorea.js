const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const autoreaSchema = new Schema({
    autor: {
        type: Schema.Types.ObjectId,
        ref: 'Autor',
        required: true
    },
    libro: {
        type: Schema.Types.ObjectId,
        ref: 'Libro',
        required: true
    }
});

autoreaSchema.index({autor: 1, libro: 1}, {unique: true});
const autoreaModel = mongoose.model('Autorea', autoreaSchema);
const llaves = ["_id", "autor", "libro"];
const tipoDato = ["ObjectId", "select", "select"];

module.exports = {
    autoreaModel,
    llaves,
    tipoDato
};