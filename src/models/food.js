const mongoose = require('mongoose')

const { Schema, model } = mongoose

const foodSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },

    avgRating: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
)

module.exports = model('food', foodSchema)
