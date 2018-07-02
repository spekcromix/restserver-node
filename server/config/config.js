// ============================
// Puerto
// ============================
process.env.PORT = process.env.PORT || 3000;


// ============================
// Entorno
// ============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'


// ============================
// Base de Datos
// ============================
let urlDB;

if( process.env.NODE_ENV === 'dev' ) {
	urlDB = 'mongodb://localhost:27017/cafe';
} else {
	urlDB = 'mongodb://user_cafe:123456@ds125021.mlab.com:25021/cafe'
}
process.env.URLDB = urlDB;