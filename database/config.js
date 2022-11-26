const mongoose = require('mongoose');

const dbConnection = async() => {
    try {
        mongoose.connect(process.env.DB_CONN, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
            autoIndex: true
        });
        console.log('DB Online');
    } catch (error) {
        console.log(error)
        throw new Error('Error en la conexión a la base de datos...');
    }
}

module.exports = {
    dbConnection
}