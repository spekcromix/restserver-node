// ============================
// Puerto
// ============================
process.env.PORT = process.env.PORT || 3000;


// ============================
// Entorno
// ============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// ============================
// Vencimiento del Token
// ============================
process.env.CADUCIDAD_TOKEN = '48h';

// ============================
// SEED de autenticación
// ============================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

// ============================
// Base de Datos
// ============================
let urlDB;

if( process.env.NODE_ENV === 'dev' ) {
	urlDB = 'mongodb://localhost:27017/cafe';
} else {
	urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;


// ============================
// Google Client ID
// ============================
process.env.CLIENT_ID = process.env.CLIENT_ID || '383996623861-ktc5sar1eaerg9ddrmok7uje6ihar43t.apps.googleusercontent.com';