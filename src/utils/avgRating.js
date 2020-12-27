module.exports = (ratings) => {
  const MAX_RATING_VALUE = 5 // rating will be from 1 to 5 like 3.5 , 5 , 3.2 etc....
  let totalRatings = 0
  let avgRating = 0
  let userCount = ratings.length // one user can rate once hence we get total users who rated for this food item

  let maxRating = userCount * MAX_RATING_VALUE // i have let that 5 is MAX_RATING_VALUE

  totalRatings = ratings.reduce((prev, curr) => prev + (curr.rating || 0), 0)
  // it is better to calculate average on server

  avgRating = (totalRatings * MAX_RATING_VALUE) / maxRating

  return avgRating
}
