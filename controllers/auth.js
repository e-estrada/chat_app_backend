const { response } = require("express");
const { validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');
const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/jwt");

const crearUsuario = async (req, res = response) => {

    const { email, password } = req.body;
    
    try {

        const existeEmail = await Usuario.findOne({ email });
        
        if(existeEmail){
            return res.status(400).json({
                ok: false,
                msg: 'El email ya esta registrado'
            });
        }

        const usuario = new Usuario(req.body);
        
        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);


        await usuario.save();

        // Generar JWT
        const token = await generarJWT(usuario.id);
    
        res.json({
            ok: true,
            usuario,
            token
        });

    } catch (error) {

        console.log(error);
        
        res.status(500).json({
            ok: false,
            msg: 'Error en la conexión a la BD'
        });

    }
    
}

const login = async (req, res = response) => {

    const { email, password } = req.body;

    try {
        
        const usuario = await Usuario.findOne({ email });

        if(!usuario){
            return res.status(404).json({
                ok: false,
                msg: 'Email no registrado'
            });
        }

        // Validar password
        const validPassword = bcrypt.compareSync(password, usuario.password);
        if(!validPassword){
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña incorrecta'
            });
        }

        // Generar JWT
        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            usuario,
            token
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error en el login'
        });
    }
    
}

const renewToken = async (req, res = response) => {

    const uid = req.uid;

    // generar un nuevo JWT
    const token = await generarJWT(uid);

    // Obtener el usuario por el uid
    const usuario = await Usuario.findById(uid);


    res.json({
        ok: true,
        usuario,
        token
    });
}


module.exports = {
    crearUsuario,
    login,
    renewToken
}