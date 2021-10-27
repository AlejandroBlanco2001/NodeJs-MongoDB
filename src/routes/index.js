const express = require('express');
const router = express.Router();

const autor = require('../models/autor');
const autorea = require('../models/autorea');
const copia = require('../models/copia');
const edicion = require('../models/edicion');
const libro = require('../models/libro');
const prestamo = require('../models/prestamo');
const usuario = require('../models/usuario');

const collections = {
    autor: autor.autorModel,
    autorea: autorea.autoreaModel,
    copia: copia.copiaModel,
    edicion: edicion.edicionModel,
    libro: libro.libroModel,
    prestamo: prestamo.prestamoModel,
    usuario: usuario.usuarioModel
};

const llaves = {
    autor: autor.llaves,
    autorea: autorea.llaves,
    copia: copia.llaves,
    edicion: edicion.llaves,
    libro: libro.llaves,
    prestamo: prestamo.llaves,
    usuario: usuario.llaves
};

const tipoDato = {
    autor: autor.tipoDato,
    autorea: autorea.tipoDato,
    copia: copia.tipoDato,
    edicion: edicion.tipoDato,
    libro: libro.tipoDato,
    prestamo: prestamo.tipoDato,
    usuario: usuario.tipoDato
};

router.get('/', async (req, res) => {
    res.render('home');
});

router.get('/add/:col', async (req, res) => {
    const { col } = req.params;
    const objetos = await collections[col].find();
    console.log(objetos);
    const con = await foreignKeys(col);
    res.render('show', {
        coleccion: col,
        registros: objetos,
        llaves: llaves[col],
        tipoDato: tipoDato[col],
        conections: con
    });
});

router.post('/add/:col', async (req, res) => {
    const { col } = req.params;
    const p = new collections[col](req.body);
    await p.save();
    res.redirect(`/add/${col}`);
});

router.get('/edit/:col/:id', async (req, res) => {
    const { col, id } = req.params;
    const objeto = await collections[col].findById(id);
    const con = await foreignKeys(col);
    res.render('edit', {
        coleccion: col,
        registro: objeto,
        llaves: llaves[col],
        tipoDato: tipoDato[col],
        conections: con
    });
});

router.post('/update/:col/:id', async (req, res) => {
    const { col, id } = req.params;
    await collections[col].updateOne({ _id: id }, req.body);
    res.redirect(`/add/${col}`);
});

router.get('/delete/:col/:id', async (req, res) => {
    const { col, id } = req.params;
    await collections[col].deleteOne({ _id: id });
    res.redirect(`/add/${col}`);
});

async function foreignKeys(coleccion) {
    var conections = {};
    switch (coleccion) {
        case 'autorea':
            const regAutor = await collections.autor.find();
            const regLibro = await collections.libro.find();
            conections = {
                autor: {
                    coleccion: regAutor,
                    key: 'nombre'
                },
                libro: {
                    coleccion: regLibro,
                    key: 'titulo'
                }
            }
            break;
        case 'copia':
        case 'libro':
            conections = {
                edicion: {
                    coleccion: await collections.edicion.find(),
                    key: 'ISBN'
                }
            }
            break;
        case 'prestamo':
            const regCopia = await collections.copia.find();
            const regUsuario = await collections.usuario.find();
            conections = {
                copia: {
                    coleccion: regCopia,
                    key: 'numero'
                },
                usuario: {
                    coleccion: regUsuario,
                    key: 'RUT'
                }
            }
            break;
    }
    return conections;
}

module.exports = router;