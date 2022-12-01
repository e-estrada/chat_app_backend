const express = require('express');
const usuario = require('../models/usuario');


const getUsuarios = async (req, res = response) => {

    const desde = Number(req.query.desde) || 0;

    const usuarios = await usuario.find({ _id: { $ne: req.uid } }).sort('-online').skip(desde).limit(20);

    return res.json({
        ok: true,
        usuarios,
        // desde,
    })
}

module.exports = {
    getUsuarios,
}