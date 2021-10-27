const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const edicionSchema = new Schema({
    ISBN: {
        type: String,
        unique: true,
        required: true,
        index: true
    },
    año: {
        type: String,
        unique: false,
        required: false,
        index: false,
        default: new Date(Date.now()).getFullYear.toString()
    },
    idioma: {
        type: String,
        unique: false,
        required: false,
        index: false,
        default: 'Español'
    }
});

const edicionModel = mongoose.model('Edición', edicionSchema);
const llaves = ["_id", "ISBN", "año", "idioma"];
const tipoDato = ["ObjectId", "text", "text", "text"];

module.exports = {
    edicionModel,
    llaves,
    tipoDato
};