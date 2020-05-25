const mongoose = require("mongoose");
const Currency = mongoose.Types.Currency;
const Schema = mongoose.Schema;

const productSchema = new Schema({
    barcode: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Currency,
        required: true,
        min: 0,
    },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
