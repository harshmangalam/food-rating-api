const Food = require('../models/food')
const Rating = require('../models/rating')
const calcAvgRating = require('../utils/avgRating')

exports.createFood = async (req, res) => {
  const { name } = req.body
  //validation
  if (name.trim().length === 0)
    return res.status(422).json({ name: 'Food Name must be required' })
  try {
    const food = new Food({
      name,
    })

    const foodData = await food.save()

    return res.status(201).json(foodData)
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: 'Something went wrong' })
  }
}

exports.addFoodRating = async (req, res) => {
  const { rating,body } = req.body

  try {
    // check food exists for which user will rating

    const food = await Food.findById(req.params.foodId)
    if (!food) {
      return res.status(404).json({ error: 'Food item not found' })
    }

    // get rating on food item by current user
    const getUserRating = await Rating.findOne({
      user: res.locals.user.id,
      food: food.id,
    })

    // one user can review once 

    if (getUserRating) {
      return res.status(400).json({ error: 'Already rated' })
    }

    // create review by user
    const newRating = new Rating({
      user: res.locals.user.id,
      food: req.params.foodId,
      rating,
      body
    })

    const userRating = await newRating.save()

    const getRatingsForFood = await Rating.find({ food: req.params.foodId })

    const avgRating = calcAvgRating(getRatingsForFood)

    food.avgRating = avgRating
    await food.save()
    return res.status(201).json({...food._doc,userRating})
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: 'Something went wrong' })
  }
}

// get all foods
exports.foods = async (_, res) => {
  try {
    const foods = await Food.find()
    res.status(200).json(foods)
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: 'Something went wrong' })
  }
}

// get food and its all review  by food id
exports.food = async (req, res) => {
  try {
    const food = await Food.findById(req.params.foodId)
    const ratings = await Rating.find({ food: req.params.foodId })
    
    res.status(200).json({...food._doc,ratings})
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: 'Something went wrong' })
  }
}
