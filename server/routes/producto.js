const express = require('express');

const { verificaToken } = require('../middlewares/autenticacion');

const app = express();

const Producto = require('../models/producto');


// ============================
// Obtener todos los productos
// ============================
app.get('/producto', verificaToken, (req, res) => {
	let desde = req.query.desde || 0;
	desde = Number(desde);

	let limite = req.query.limite || 5;
	limite = Number(limite);

	Producto.find({ disponible: true })
		.skip(desde)
		.limit(limite)
		.sort('nombre')
		.populate('usuario', 'nombre email')
		.populate('categoria', 'descripcion')
		.exec((err, productos) => {
		if( err ){
			return res.status(500).json({
				ok: false,
				err
			});
		}

		Producto.count({}, (err, conteo) => {

			res.json({
				ok: true,
				productos,
				cuantos: conteo
			});

		})

	})
});

// ============================
// Obtener un producto por ID
// ============================
app.get('/producto/:id', verificaToken, (req, res) => {
	// trae todos productos
	//populate: usuario categoria
	// paginado
	let id = req.params.id;
	Producto.findById(id)
		.sort('nombre')
		.populate('usuario', 'nombre email')
		.populate('categoria', 'descripcion')
		.exec((err, productoDB) => {
			if( err ){
				return res.status(400).json({
					ok: false,
					err
				});
			}

			if( !productoDB ) {
				return res.status(500).json({
					ok: false,
					err: {
						message: 'El producto con el id '+ id + ' no existe'
					}
				});
			}

			res.json({
				ok: true,
				producto: productoDB
			})

	})
});

// ============================
// Crear un nuevo producto
// ============================
app.post('/producto', verificaToken, (req, res) => {
	// grabar el usuario
	// grabar una categoria del listado

	let body = req.body;

    let producto = new Producto({
    	nombre: body.nombre,
    	precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });


    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });


    });
});

// ============================
// Buscar productos
// ============================
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {
	
	let termino = req.params.termino;

	let regex = new RegExp(termino, 'i')

	Producto.find({nombre: regex})
		.populate('categoria', 'nombre')
		.exec((err, productoDB) => {
			if( err ){
				return res.status(500).json({
					ok: false,
					err
				});
			}

			res.json({
			  	ok: true,
			  	producto: productoDB
			})
		});
})

// ============================
// Actualizar un nuevo producto
// ============================
app.put('/producto/:id', verificaToken, (req, res) => {
	// grabar el usuario
	// grabar una categoria del listado
	let id = req.params.id;
	let body = req.body;

	// let descProducto = {
	// 	descripcion: body.descripcion
	// }

	Producto.findByIdAndUpdate( id, body, { new: true , runValidators: true}, (err, productoDB) => {

		if( err ){
			return res.status(500).json({
				ok: false,
				err
			});
		}

		if( !productoDB ){
			return res.status(400).json({
				ok: false,
				err
			});
		}
		
		res.json({
		  	ok: true,
		  	producto: productoDB
		})
	})
});

// ============================
// Eliminzar un producto
// ============================
app.delete('/producto/:id', verificaToken, (req, res) => {
	let id = req.params.id;

  	let cambiarDisponibilidad = {
  		disponible: false
  	}

  	// 	Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
  	Producto.findByIdAndUpdate( id, cambiarDisponibilidad, { new: true }, (err, productoBorrado) => {

		if( err ){
			return res.status(400).json({
				ok: false,
				err
			});
		}
		
		res.json({
		  	ok: true,
		  	producto: productoBorrado,
		  	message: 'Producto borrado'
		})
	})
});

module.exports = app;