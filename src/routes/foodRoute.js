const express = require('express')
const { createFood, addFoodRating ,foods,food} = require('../controllers/foodController')
const checkAuth = require('../middleware/checkAuth')

const router = express.Router()


router.post('/', checkAuth, createFood)
router.post('/:foodId/rating', checkAuth, addFoodRating)
router.get("/",foods)
router.get("/:foodId",food)

module.exports = router
