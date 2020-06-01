const mongoose = require('mongoose')
const Schema = mongoose.Schema

const favoriteSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    promotion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Promotion'
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Favorite', favoriteSchema)