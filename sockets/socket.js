
const { io } = require('../index');
const { comprobarJWT } = require('../helpers/jwt');
const {usuarioConectado, usuarioDesconectado, guardarMensaje} = require('../controllers/socket')
//Mensajes de Sockets
io.on('connection', client => {
    console.log('Cliente conectado...');

    // Verificar autenticación
    const [valido, uid] = comprobarJWT(client.handshake.headers['x-token']);
    if(!valido){ return client.disconnect(); }

    // Cliente autenticado
    usuarioConectado(uid);

    // Ingresar al usuario a una sala en particular
    client.join(uid);

    // Escuchar del cliente el mensaje-personal
    client.on('mensaje-personal', async (data) => { 
        await guardarMensaje(data);
        io.to(data.para).emit('mensaje-personal', data);
    });

    client.on('disconnect', () => { 
        usuarioDesconectado(uid);
    });
});