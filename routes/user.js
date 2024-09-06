var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const user_utils = require("./utils/user_utils");
const recipe_utils = require("./utils/recipes_utils");

/**
 * Authenticate all incoming requests by middleware
 */
router.use(async function (req, res, next) {
  let cookie_user_id = parseInt(req.headers['x-user-id'], 10); // Convert to integer
  // console.log("cookie_user_id in users: ", cookie_user_id);
  if (cookie_user_id > 0) {
    try {
      const users = await DButils.execQuery("SELECT user_id FROM users");
      // console.log("users- ", users);
      const user = users.find((x) => x.user_id === cookie_user_id);
      if (user) {
        req.user_id = cookie_user_id;
        // console.log("success");
        next();
      } else {
        res.sendStatus(401);
        console.log("fail here!");
      }
    } catch (error) {
      next(error);
    }
  } else {
    console.log("fail where cookie_user_id <= 0");
    res.sendStatus(401); 
  }
});

router.get("/alive", (req, res) => res.send("alive"));

/**
 * This path gets body with recipeId and save this recipe in the favorites list of the logged-in user
 */
router.post('/favorites', async (req, res, next) => {
  try {
    let user_id = parseInt(req.headers['x-user-id'], 10); // Convert to integer
    const recipe_id = req.body.recipeId;
    console.log("before markAsFavorite")
    await user_utils.markAsFavorite(user_id, recipe_id);
    console.log("after markAsFavorite")
    res.status(200).send("The Recipe successfully saved as favorite");
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns the favorites recipes that were saved by the logged-in user
 */
router.get('/favorites', async (req, res, next) => {
  try {
    let user_id = parseInt(req.headers['x-user-id'], 10); // Convert to integer
    const recipes_id = await user_utils.getFavoriteRecipes(user_id);
    if (recipes_id.length === 0) {
      res.status(200).send({});
    } else {
      const results = await recipe_utils.getRecipesPreview(recipes_id);
      res.status(200).send(results);
    }
  } catch (error) {
    next(error); 
  }
});

router.delete('/favorites', async (req, res, next) => {
  try {
    let user_id = parseInt(req.headers['x-user-id'], 10); // Convert to integer
    const recipe_id = req.body.recipeId;
    await user_utils.deleteRecipeFromFavorites(user_id, recipe_id);
    res.status(200).send("The Recipe successfully deleted from favorites");
  } catch (error) {
    next(error);
  }
});

router.get('/is_favorite', async (req, res, next) => {
  try {
    let user_id = parseInt(req.headers['x-user-id'], 10); // Convert to integer
    const recipe_id = req.query.recipeId;
    const isFavorite = await user_utils.checkIfRecipeExistInFavorites(user_id, recipe_id);
    res.status(200).send(isFavorite);
  } catch (error) {
    next(error);
  }
});

router.post('/last_watch', async (req, res, next) => {
  try {
    let user_id = parseInt(req.headers['x-user-id'], 10); // Convert to integer
    const recipe_id = req.body.recipeId;
    await user_utils.markAsLastWatched(user_id, recipe_id);
    await user_utils.markAsLastWatched(user_id, recipe_id);
    res.status(200).send("The Recipe successfully saved as watched");
  } catch (error) {
    next(error);
  }
});

router.get('/last_watch', async (req, res, next) => {
  try {
    let user_id = parseInt(req.headers['x-user-id'], 10); // Convert to integer
    const recipes_id = await user_utils.getLastWatchedRecipes(user_id);
    const results = await recipe_utils.getRecipesPreview(recipes_id);
    res.status(200).send(results);
  } catch (error) {
    next(error); 
  }
});

router.get('/meal_plan', async (req, res, next) => {
  try {
    let user_id = parseInt(req.headers['x-user-id'], 10); // Convert to integer
    const recipes_id = await user_utils.getMealPlan(user_id);
    const results = await recipe_utils.getRecipesPreview(recipes_id);
    res.status(200).send(results);
  } catch (error) {
    next(error);
  }
});

router.post('/meal_plan', async (req, res, next) => {
  try {
    let user_id = parseInt(req.headers['x-user-id'], 10); // Convert to integer
    const recipe_id = req.body.recipeId;
    const isRecipeExist = await user_utils.checkIfRecipeExistInMealPlan(user_id, recipe_id);
    if (isRecipeExist) {
      res.status(200).send("Recipe already exists in meal plan");
    } else {
      await user_utils.add_to_meal_plan(user_id, recipe_id);
      res.status(200).send("The Recipe successfully saved as meal plan");
    }
  } catch (error) {
    next(error);
  }
});

router.delete('/meal_plan', async (req, res, next) => {
  try {
    let user_id = parseInt(req.headers['x-user-id'], 10); // Convert to integer
    if (!user_id) {
      return res.status(400).send("User ID is missing");
    }
    await user_utils.clearMealPlan(user_id); // Call to delete all meal plan entries for this user
    res.status(200).send("All recipes have been cleared from your meal plan");
  } catch (error) {
    console.error("Error clearing meal plan:", error);
    next(error);
  }
});


router.put('/meal_plan', async (req, res, next) => {
  try {
    let user_id = parseInt(req.headers['x-user-id'], 10); // Convert to integer
    const recipes_id = req.body.recipesId;
    await user_utils.update_meal_plan(user_id, recipes_id);
    res.status(200).send("The Recipe successfully updated in meal plan");
  } catch (error) {
    next(error);
  }
});

router.get('/meal_plan_count', async (req, res, next) => {
  try {
    let user_id = parseInt(req.headers['x-user-id'], 10); // Convert to integer
    const recipes_id = await user_utils.getMealPlan(user_id);
    res.status(200).send({"count": recipes_id.length});
  } catch (error) {
    next(error);
  }
});

router.post('/viewd_recipes', async (req, res, next) => {
  try {
    let user_id = parseInt(req.headers['x-user-id'], 10); // Convert to integer
    const recipe_id = req.body.recipeId;
    const isRecipeViewed = await user_utils.checkIfRecipeViewed(user_id, recipe_id);
    if (isRecipeViewed) {
      res.status(200).send("The Recipe was already viewed");
    } else {
      await user_utils.markAsViewed(user_id, recipe_id);
      res.status(200).send("The Recipe successfully saved as viewed");
    }
  } catch (error) {
    next(error);
  }
});

router.get('/is_watched', async (req, res, next) => {
  try {
    let user_id = parseInt(req.headers['x-user-id'], 10); // Convert to integer
    const recipe_id = req.query.recipeId;
    const watched = await user_utils.checkIfRecipeViewed(user_id, recipe_id);
    res.status(200).send(watched);
  } catch (error) {
    next(error);
  }
});

router.post('/my_recipes', async (req, res, next) => {
  try {
    let user_id = parseInt(req.headers['x-user-id'], 10); // Convert to integer
    const title = req.body.title;
    const isRecipeExist = await user_utils.checkIfRecipeExistInMyRecipes(user_id, title);
    if (isRecipeExist) {
      res.status(200).send("Recipe name already exists in my recipes");
    } else {
      const analyzedInstructions = req.body.analyzedInstructions;
      const extendedIngredients = req.body.extendedIngredients;
      const image = req.body.image;
      const vegetarian = req.body.vegetarian;
      const vegan = req.body.vegan;
      const glutenFree = req.body.glutenFree;
      const readyInMinutes = req.body.readyInMinutes;
      const servings = req.body.servings;
      await user_utils.AddToMyRecipes(user_id, title, analyzedInstructions, extendedIngredients, image, vegetarian, vegan, glutenFree, readyInMinutes, servings);
      res.status(200).send("The Recipe successfully saved as my recipe");
    }
  } catch (error) {
    next(error);
  }
});

router.get('/my_recipes', async (req, res, next) => {
  try {
    let user_id = parseInt(req.headers['x-user-id'], 10); // Convert to integer
    const recipes = await user_utils.getMyRecipes(user_id);
    res.status(200).send(recipes);
  } catch (error) {
    next(error);
  }
});

router.get('/my_recipe', async (req, res, next) => {
  try {
    let user_id = parseInt(req.headers['x-user-id'], 10); // Convert to integer
    const title = req.query.title;
    const recipe = await user_utils.getMyRecipe(user_id, title);
    res.status(200).send(recipe);
  } catch (error) {
    next(error);
  }
});




module.exports = router;
