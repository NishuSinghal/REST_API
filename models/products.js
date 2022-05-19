const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true
    },
    price:{
        type:String,
        required:true
    },
    createdBy: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'allUsers'
    }
})

const allProducts = new mongoose.model("allProducts", productSchema);

module.exports=allProducts