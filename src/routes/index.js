const express = require('express');
const router = express.Router();

const autor = require('../models/autor');
const autorea = require('../models/autorea');
const copia = require('../models/copia');
const edicion = require('../models/edicion');
const libro = require('../models/libro');
const prestamo = require('../models/prestamo');
const usuario = require('../models/usuario');

const querys = require('../querys');

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

router.get('/:name(q1|q2)', async (req, res) => {
    queryNumber = req.params.name[1];
    console.log(queryNumber)
    let llavesCons;
    let sol;
    if (queryNumber == "1") {
        llavesCons = ['Nombre del autor', 'Titulo del libro', 'ISBN de la edición', 'Año de publicación', 'Idioma de la edición', 'Numero de la copia'];
        sol = await querys.q1(collections.autorea);
        res.render("cons1", {
            registros: sol,
            llaves: llavesCons
        });
    } else {
        llavesCons = ['Nombre del usuario', 'Titulo del libro'];
        sol = await querys.q2(collections.prestamo);
        console.log("SOL>", sol);
        res.render("cons2", {
            registros: sol,
            llaves: llavesCons
        });

    }

})

router.get('/add/:col', async (req, res) => {
    let error;
    try {
        error = req.query.error;
    } catch (error) {
        error = '';
    }

    const {
        col
    } = req.params;
    let objetos;
    if (col == 'prestamo') {
        objetos = await collections[col].aggregate([{
            $project: {
                copia: 1,
                usuario: 1,
                fecha_Prestamo: {
                    $dateToString: {
                        format: "%d-%m-%Y",
                        date: "$fecha_Prestamo"
                    }
                },
                fecha_Devolucion: {
                    $dateToString: {
                        format: "%d-%m-%Y",
                        date: "$fecha_Devolucion"
                    }
                }
            }
        }]);
    } else {
        objetos = await collections[col].find();
    }
    const con = await foreignKeys(col);
    res.render('show', {
        coleccion: col,
        registros: objetos,
        llaves: llaves[col],
        tipoDato: tipoDato[col],
        conections: con,
        error
    });
});

router.post('/add/:col', async (req, res) => {
    const {
        col
    } = req.params;
    const p = new collections[col](req.body);
    if (col == 'prestamo') {
        let {
            fecha_Prestamo,
            fecha_Devolucion
        } = req.body;
        let diferencia = new Date(fecha_Devolucion).getTime() - new Date(fecha_Prestamo).getTime();
        if (diferencia < 0) {
            res.redirect(`/add/${col}?error=La fecha de préstamo no puede ser posterior a la fecha de devolución.`);
        } else {
            try {
                await p.save();
                res.redirect(`/add/${col}`);
            } catch (error) {
                res.redirect(`/add/${col}?error=Se encontró que la llave primaria ingresada ya fue utilizada en otro documento de la colección (puede ser más de un campo). O bien dejó un campo vacío.`);
            }
        }
    } else {
        try {
            await p.save();
            if (col == 'edicion') {
                let {
                    titulo
                } = req.body;
                const edicion = await collections[col].findById(p._id);
                let json = {
                    titulo,
                    edicion
                }
                let l = new collections.libro(json);
                try {
                    await l.save();
                    res.redirect(`/add/${col}`);
                } catch (error) {
                    res.redirect(`/add/${col}?error=Se encontró que la llave primaria ingresada ya fue utilizada en otro documento de la colección (puede ser más de un campo). O bien dejó un campo vacío.`);
                }
            } else {
                res.redirect(`/add/${col}`);
            }
        } catch (error) {
            res.redirect(`/add/${col}?error=Se encontró que la llave primaria ingresada ya fue utilizada en otro documento de la colección (puede ser más de un campo). O bien dejó un campo vacío.`);
        }
    }
});

router.get('/edit/:col/:id', async (req, res) => {
    let error;
    try {
        error = req.query.error;
    } catch (error) {
        error = '';
    }

    const {
        col,
        id
    } = req.params;
    const objeto = await collections[col].findById(id);
    const con = await foreignKeys(col);
    res.render('edit', {
        coleccion: col,
        registro: objeto,
        llaves: llaves[col],
        tipoDato: tipoDato[col],
        conections: con,
        error
    });
});

router.post('/update/:col/:id', async (req, res) => {
    const {
        col,
        id
    } = req.params;
    try {
        if (col == 'prestamo') {
            let {
                fecha_Prestamo,
                fecha_Devolucion
            } = req.body;
            let diferencia = new Date(fecha_Devolucion).getTime() - new Date(fecha_Prestamo).getTime();
            if (diferencia < 0) {
                res.redirect(`/add/${col}?error=La fecha de préstamo no puede ser posterior a la fecha de devolución.`);
            }else {
                await collections[col].updateOne({
                    _id: id
                }, req.body);
                res.redirect(`/add/${col}`);
            }
        } else {
            await collections[col].updateOne({
                _id: id
            }, req.body);
            res.redirect(`/add/${col}`);
        }
    } catch (error) {
        res.redirect(`/edit/${col}/${id}?error=Se encontró que la llave primaria ingresada ya fue utilizada en otro documento de la colección (puede ser más de un campo). O bien dejó un campo vacío.`);
    }
});

router.get('/delete/:col/:id', async (req, res) => {
    const {
        col,
        id
    } = req.params;
    await collections[col].deleteOne({
        _id: id
    });
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

            const regCopia = await collections.copia.aggregate([{
                    $lookup: {
                        from: 'edicións',
                        localField: 'edicion',
                        foreignField: '_id',
                        as: 'copEd'
                    }
                }, {
                    $unwind: {
                        path: '$copEd'
                    }
                },
                {
                    $project: {
                        _id: 1,
                        'ident': {
                            $concat: ['$copEd.ISBN', '-', {
                                $toString: '$numero'
                            }]
                        }
                    }
                }
            ]);
            const regUsuario = await collections.usuario.find();

            conections = {
                copia: {
                    coleccion: regCopia,
                    key: 'ident'
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

module.exports = {
    router
};