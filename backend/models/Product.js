import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    brand:{
        type:String,
    },
    price:{
        type:Number,
        required:true,
    },
    discount:{
        type:Number,
    },
    stock:{
        type:Number
    },
    images:[String],
    variants:[{size:String, color:String, storage:String}],
    description:String,
    category:String,
});

const Product = mongoose.models.Product ||  mongoose.model("Product", productSchema);
export default Product;