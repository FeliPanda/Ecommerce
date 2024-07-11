const express = require('express');
const router = express.Router();

const carts = []

router.get('/carts', (req, res) => {
    res.json(carts);
})
