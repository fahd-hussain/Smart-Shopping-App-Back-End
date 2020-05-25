const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const shelfSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        row: {
            type: Number,
            required: true,
        },
        column: {
            type: Number,
            required: true,
        },
        neighbors: [{
            neighbor: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Shelf",
            }
        }],
    },
    {
        timestamps: true,
    },
);

const shelves = mongoose.model("Shelf", shelfSchema);

module.exports = shelves;
