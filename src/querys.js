async function q1(model){
    let respuesta;
    await model.aggregate([{
        $lookup:{
            from: 'autors',
            localField: 'autor',
            foreignField: '_id',
            as: 'autores'
        }
    },
    {
        $lookup:{
            from: 'libros',
            localField: 'libro',
            foreignField: '_id',
            as: 'libro'
        }
    },
    {
        $lookup:{
            from: 'edicións',
            localField: 'libro.edicion',
            foreignField: '_id',
            as: 'libroEdicion'
        }    
    },
    {
        $lookup:{
            from: 'copias',
            localField: 'libroEdicion._id',
            foreignField: 'edicion',
            as: 'edicionCopias'
        }
    },
    {
        $project:
        {
            'Nombre del autor': '$autores.nombre',
            'Titulo del libro': '$libro.titulo',
            'ISBN de la edición': '$libroEdicion.ISBN',
            'Año de publicación': '$libroEdicion.año',
            'Idioma de la edición': '$libroEdicion.idioma',
            'Numero de la copia': '$edicionCopias.numero' 
        }
    }], function(req, res){
        respuesta = res;
    });
    return respuesta;
}

async function q2(model){
    let respuesta;
    await model.aggregate([{
        $lookup:{
            from: 'usuarios',
            localField: 'usuario',
            foreignField: '_id',
            as: 'prestamosUsers'
        }
    },
    {
        $lookup:{
            from: 'copias',
            localField: 'copia',
            foreignField: '_id',
            as: 'prestamoCopia'
        }
    },
    {
        $lookup:{
            from: 'edicións',
            localField: 'prestamoCopia.edicion',
            foreignField: '_id',
            as: 'prestamoEdicion'
        }    
    },
    {
        $lookup:{
            from: 'libros',
            localField: 'prestamoEdicion._id',
            foreignField: 'edicion',
            as: 'prestamoLibro'
        }
    },
    {
        $project:
        {
            'Nombre del usuario': '$prestamosUsers.nombre',
            'Titulo del libro': '$prestamoLibro.titulo',
        }
    }],function(req,res){
        respuesta = res;
    })
    return respuesta;
}

module.exports = {
    q1,q2
}
