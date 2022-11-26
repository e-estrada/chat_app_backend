
const { io } = require('../index');
//Mensajes de Sockets
io.on('connection', client => {
    console.log('Cliente conectado...');
    
    client.on('mensaje', (data) => { 
        console.log(data);
        io.emit('mensaje', {admin: 'Nuevo mensaje'});
    });

    client.on('disconnect', () => { 
        console.log('Cliente desconectado...');   
    });
});