require('dotenv').config()
const express = require('express');
const app = express();
const mongoose = require('mongoose')
const allUsers = require('./models/users')
const auth = require('./routes/authentication')
const products = require('./routes/products')
const port = process.env.PORT 

const DB = `mongodb+srv://${process.env.DATABASE_NAME}:${process.env.DATABSE_PASSWORD}@cluster0.efwgv.mongodb.net/w${process.env.DATABASE}?retryWrites=true&w=majority`

mongoose.connect(DB).then(()=>{
    console.log('Connection Succesfull Online');
}).catch((e)=>{
    console.log(e);
})

app.use(express.json())
app.use('/api/authentication', auth)
app.use('/api/products', products)

app.listen(port, () => {
    console.log(`listening to the port ${port}`);
})