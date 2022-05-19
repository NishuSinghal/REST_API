const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const AllUsers = require('../models/users');
const Product = require('../models/products')
const fetchuser = require('../middleware/getUser')
const csvtojson = require('csvtojson')

//login required to upload file
router.post('/uploadProduct', fetchuser, async (req, res) => {
    try {
        csvtojson().fromFile('./product.csv').then((csvData) => {
            console.log(csvData);
            csvData.forEach((e, index) => {
                if (req.userId) {
                    const product = new Product({
                        name: e.name, description: e.description, quantity: e.quantity, price: e.price, createdBy: req.userId
                    })
                    if (product) {
                        const savedProduct = product.save()
                        res.send(savedProduct)
                    }
                }
            })
        }).catch((e) => {
            console.log(e);
        })
    } catch (error) {
        console.log(error);
    }
})

//login required ,only login user products
router.get('/productDetails', fetchuser, async (req, res) => {
    try {
        console.log(req.userId);
        const product = await Product.find({ createdBy: req.userId });
        res.send(product)
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ errors: 'Internal Server Error' });
    }
})


module.exports = router