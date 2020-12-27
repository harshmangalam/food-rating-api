const mongoose = require('mongoose')

const { Schema, model } = mongoose

const ratingSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },

    food: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },

    rating: {
      type: Number,
      default: 0,
    },
    body: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
)

module.exports = model('rating', ratingSchema)
