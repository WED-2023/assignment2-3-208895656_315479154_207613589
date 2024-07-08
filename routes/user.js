var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const user_utils = require("./utils/user_utils");
const recipe_utils = require("./utils/recipes_utils");

/**
 * Authenticate all incoming requests by middleware
 */
router.use(async function (req, res, next) {
  // console.log(req.session.user_id)
  // console.log(req.session)
  if (req.session && req.session.user_id) {
    DButils.execQuery("SELECT user_id FROM users").then((users) => {
      // console.log(users)
      if (users.find((x) => x.user_id === req.session.user_id)) {
        req.user_id = req.session.user_id;
        // console.log("user_id: ", req.user_id);
        next();
      }
    }).catch(err => next(err));
  } else {
    res.sendStatus(401);
  }
});


router.get("/kaki", (req, res) => res.send("pipi"));


/**
 * This path gets body with recipeId and save this recipe in the favorites list of the logged-in user
 */
router.post('/favorites', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipeId;
    console.log(recipe_id);
    console.log(user_id);
    await user_utils.markAsFavorite(user_id,recipe_id);
    res.status(200).send("The Recipe successfully saved as favorite");
    } catch(error){
    next(error);
  }
})

/**
 * This path returns the favorites recipes that were saved by the logged-in user
 */
router.get('/favorites', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    let favorite_recipes = {};
    const recipes_id = await user_utils.getFavoriteRecipes(user_id);
    let recipes_id_array = [];
    recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
    console.log(recipes_id_array);
    const results = await recipe_utils.getRecipesPreview(recipes_id_array);
    res.status(200).send(results);
  } catch(error){
    next(error); 
  }
});


router.post('/last_watch', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipeId;
    console.log(recipe_id)
    console.log(user_id)
    await user_utils.markAsWatched(user_id, recipe_id);
    res.status(200).send("The Recipe successfully saved as watched");
    } catch(error){
    next(error);
  }
})


router.get('/last_watch', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const recipes_id = await user_utils.getLastWatchedRecipes(user_id);
    const results = await recipe_utils.getRecipesPreview(recipes_id);
    res.status(200).send(results);
  } catch(error){
    next(error); 
  }
});


router.get('/meal_plan', async (req, res, next) => {
  try{
    const user_id = req.session.user_id;
    const recipes_id = await user_utils.getMealPlan(user_id);
    const results = await recipe_utils.getRecipesPreview(recipes_id);
    res.status(200).send(results);
  } catch(error){
    next(error);
  }
});

router.post('/meal_plan', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipeId;
    const isRecipeExist = await user_utils.checkIfRecipeExistInMealPlan(user_id, recipe_id);
    if (isRecipeExist) {
      res.status(400).send("Recipe already exists in meal plan");
    } else {
      await user_utils.add_to_meal_plan(user_id, recipe_id);
      res.status(200).send("The Recipe successfully saved as meal plan");
    }
  } catch(error){
    next(error);
  }
});



router.delete('/meal_plan', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipeId;
    await user_utils.deleteRecipeFromMealPlan(user_id, recipe_id);
    res.status(200).send("The Recipe successfully deleted from meal plan");
  } catch(error){
    next(error);
  }
});


router.put('/meal_plan', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const recipes_id = req.body.recipesId;
    await user_utils.update_meal_plan(user_id, recipes_id);
    res.status(200).send("The Recipe successfully updated in meal plan");
  } catch(error){
    next(error);
  }
});



module.exports = router;
