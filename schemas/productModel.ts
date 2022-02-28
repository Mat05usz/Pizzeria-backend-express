import { Product } from '../Interfaces/ProductInterfaces';
import mongoose, {Schema, model} from "mongoose";

const productSchema = new Schema<Product>({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
});

export const productModel =  model<Product>('Product', productSchema);
