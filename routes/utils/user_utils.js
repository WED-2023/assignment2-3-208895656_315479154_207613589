const DButils = require("./DButils");

async function markAsFavorite(user_id, recipe_id){
    console.log(user_id)
    const userRecord = await DButils.execQuery(`SELECT recipes_id FROM favorite_recipes WHERE user_id = ${user_id}`);
    if (userRecord.length === 0) {
        // If user doesn't exist, insert a new record
        await DButils.execQuery(`INSERT INTO favorite_recipes (user_id, recipes_id) VALUES (${user_id}, JSON_ARRAY(${recipe_id}))`);
    } else {
        // If user exists, update the recipe_ids
        let recipeIds = userRecord[0].recipes_id
        // Add the new recipe_id at the end
        if (recipeIds.includes(recipe_id)) {
            // If it already exists, simply return
            return;
        }
        recipeIds.push(recipe_id);
        // Update the user's recipe_ids in the database
        await DButils.execQuery(`UPDATE favorite_recipes SET recipes_id = JSON_ARRAY(${recipeIds.join(', ')}) WHERE user_id = ${user_id}`);
        DButils.execQuery(`SELECT recipes_id FROM favorite_recipes WHERE user_id = ${user_id}`);
    }
}


async function checkIfRecipeExistInFavorites(user_id, recipe_id) {
    const userRecord = await DButils.execQuery(`SELECT recipes_id FROM favorite_recipes WHERE user_id = ${user_id}`);
    console.log(userRecord.length === 0)
    if (userRecord.length === 0) {
      return false;
    } else {
      let recipesIdArray = userRecord[0].recipes_id;
  
      // If recipes_id is a string, parse it to an array 
      if (typeof recipesIdArray === 'string') {
        recipesIdArray = JSON.parse(recipesIdArray);
      }
      return recipesIdArray.includes(Number(recipe_id)); // Ensure recipe_id is a number
    }
  }


async function deleteRecipeFromFavorites(user_id, recipe_id) {
    const userRecord = await DButils.execQuery(`SELECT recipes_id FROM favorite_recipes WHERE user_id = ${user_id}`);
    let recipeIds = userRecord[0].recipes_id
    const recipeIndex = recipeIds.indexOf(recipe_id);
    recipeIds.splice(recipeIndex, 1);
    await DButils.execQuery(`UPDATE favorite_recipes SET recipes_id = JSON_ARRAY(${recipeIds.join(', ')}) WHERE user_id = ${user_id}`);
    DButils.execQuery(`SELECT recipes_id FROM favorite_recipes WHERE user_id = ${user_id}`);
}

async function markAsLastWatched(user_id, recipe_id) {
    // Fetch the current recipe_ids for the user
    const userRecord = await DButils.execQuery(`SELECT recipe_ids FROM last_watched WHERE user_id = ${user_id}`);
    if (userRecord.length === 0) {
        // If user doesn't exist, insert a new record
        await DButils.execQuery(`INSERT INTO last_watched (user_id, recipe_ids) VALUES (${user_id}, JSON_ARRAY(${recipe_id}))`);
    } else {
        // If user exists, update the recipe_ids
        let recipeIds = userRecord[0].recipe_ids
        // Check if the recipe_id already exists
        const recipeIndex = recipeIds.indexOf(recipe_id);
        if (recipeIndex !== -1) {
            // Remove the existing recipe_id
            recipeIds.splice(recipeIndex, 1);
        }

        // Add the new recipe_id at the end
        recipeIds.push(recipe_id);
        
        // Ensure the array has at most 3 elements
        if (recipeIds.length > 3) {
            recipeIds.shift(); // Remove the first element
        }
        
        // Update the user's recipe_ids in the database
        await DButils.execQuery(`UPDATE last_watched SET recipe_ids = JSON_ARRAY(${recipeIds.join(', ')}) WHERE user_id = ${user_id}`);
    }
}


async function add_to_meal_plan(user_id, recipe_id) {
    // Fetch the current recipe_ids for the user
    const userRecord = await DButils.execQuery(`SELECT recipe_ids FROM meal_plan WHERE user_id = ${user_id}`);
    if (userRecord.length === 0) {
        // If user doesn't exist, insert a new record
        await DButils.execQuery(`INSERT INTO meal_plan (user_id, recipe_ids) VALUES (${user_id}, JSON_ARRAY(${recipe_id}))`);
    } else {
        // If user exists, update the recipe_ids
        let recipeIds = userRecord[0].recipe_ids
        // Add the new recipe_id at the end
        recipeIds.push(recipe_id);
        // Update the user's recipe_ids in the database
        await DButils.execQuery(`UPDATE meal_plan SET recipe_ids = JSON_ARRAY(${recipeIds.join(', ')}) WHERE user_id = ${user_id}`);
    }

}

async function checkIfRecipeExistInMealPlan(user_id, recipe_id) {
    const userRecord = await DButils.execQuery(`SELECT recipe_ids FROM meal_plan WHERE user_id = ${user_id}`);
    if (userRecord.length === 0) {
        return false;
    } else {
        return userRecord[0].recipe_ids.includes(recipe_id);
    }
}


async function deleteRecipeFromMealPlan(user_id, recipe_id) {
    const userRecord = await DButils.execQuery(`SELECT recipe_ids FROM meal_plan WHERE user_id = ${user_id}`);
    let recipeIds = userRecord[0].recipe_ids
    const recipeIndex = recipeIds.indexOf(recipe_id);
    recipeIds.splice(recipeIndex, 1);
    await DButils.execQuery(`UPDATE meal_plan SET recipe_ids = JSON_ARRAY(${recipeIds.join(', ')}) WHERE user_id = ${user_id}`);

}


async function update_meal_plan(user_id, recipes_id) {
    await DButils.execQuery(`UPDATE meal_plan SET recipe_ids = JSON_ARRAY(${recipes_id.join(', ')}) WHERE user_id = ${user_id}`);
}


async function getFavoriteRecipes(user_id){
    const userRecord = await DButils.execQuery(`select recipes_id from favorite_recipes where user_id='${user_id}'`);
    return userRecord[0].recipes_id;
}


async function getLastWatchedRecipes(user_id) {
    const userRecord = await DButils.execQuery(`SELECT recipe_ids FROM last_watched WHERE user_id = ${user_id}`);
    return userRecord[0].recipe_ids;
}


async function getMealPlan(user_id) {
    const userRecord = await DButils.execQuery(`SELECT recipe_ids FROM meal_plan WHERE user_id = ${user_id}`);
    return userRecord[0].recipe_ids;
}


async function markAsViewed(user_id, recipe_id){
    const userRecord = await DButils.execQuery(`SELECT recipe_ids FROM viewed_recipes WHERE user_id = ${user_id}`);
    if (userRecord.length === 0) {
        // If user doesn't exist, insert a new record
        await DButils.execQuery(`INSERT INTO viewed_recipes (user_id, recipe_ids) VALUES (${user_id}, JSON_ARRAY(${recipe_id}))`);
    } else {
        // If user exists, update the recipe_ids
        let recipeIds = userRecord[0].recipe_ids
        // Add the new recipe_id at the end
        recipeIds.push(recipe_id);
        // Update the user's recipe_ids in the database
        await DButils.execQuery(`UPDATE viewed_recipes SET recipe_ids = JSON_ARRAY(${recipeIds.join(', ')}) WHERE user_id = ${user_id}`);
    }
}


async function getViewedRecipes(user_id){
    const userRecord = await DButils.execQuery(`SELECT recipe_ids FROM viewed_recipes WHERE user_id = ${user_id}`);
    return userRecord[0].recipe_ids;
}


async function checkIfRecipeViewed(user_id, recipe_id) {
    const userRecord = await DButils.execQuery(`SELECT recipe_ids FROM viewed_recipes WHERE user_id = ${user_id}`);
    if (userRecord.length === 0) {
        return false;
      } else {
        let recipesIdArray = userRecord[0].recipe_ids;
    
        // If recipes_id is a string, parse it to an array
        if (typeof recipesIdArray === 'string') {
          recipesIdArray = JSON.parse(recipesIdArray);
        }
        return recipesIdArray.includes(Number(recipe_id)); // Ensure recipe_id is a number
      }
}


async function checkIfRecipeExistInMyRecipes(user_id, title){
    const userRecord = await DButils.execQuery(`SELECT title FROM my_recipes WHERE user_id = ${user_id}`);
    if (userRecord.length === 0) {
        return false;
    } else {
        return userRecord[0].title.includes(title);
    }

}


async function AddToMyRecipes(user_id, title, analyzedInstructions, extendedIngredients, image, vegetarian, vegan, glutenFree, readyInMinutes, servings){
    await DButils.execQuery(`INSERT INTO my_recipes (user_id, title, analyzedInstructions, extendedIngredients, image, vegetarian, vegan, glutenFree, readyInMinutes, servings) VALUES (${user_id}, '${title}', '${JSON.stringify(analyzedInstructions)}', '${JSON.stringify(extendedIngredients)}', '${image}', ${vegetarian}, ${vegan}, ${glutenFree}, ${readyInMinutes}, ${servings})`);
}


async function getMyRecipes(user_id) {
    try {
      // SQL query to fetch recipes
  
      // Execute the query using DButils.execQuery
      const recipes = await DButils.execQuery(`
        SELECT 
            vegetarian, vegan, glutenFree, extendedIngredients, title, 
            readyInMinutes, servings, image, analyzedInstructions
        FROM my_recipes
        WHERE user_id = ${user_id}`);
  
      // If no recipes found, return an empty object
      if (recipes.length === 0) {
        return {};
      }
  
      // Transform the result into the desired JSON format
      const formattedRecipes = recipes.map(row => ({
        vegetarian: row.vegetarian,
        vegan: row.vegan,
        glutenFree: row.glutenFree,
        extendedIngredients: typeof row.extendedIngredients === 'string' ? JSON.parse(row.extendedIngredients) : row.extendedIngredients,
        title: row.title,
        readyInMinutes: row.readyInMinutes,
        servings: row.servings,
        image: row.image,
        analyzedInstructions: typeof row.analyzedInstructions === 'string' ? JSON.parse(row.analyzedInstructions) : row.analyzedInstructions
    }));
  
      return formattedRecipes;
    } catch (error) {
      console.error('Error fetching recipes:', error.message);
      throw error;
    }
}


async function getMyRecipe(user_id, title) {
    try {
      // SQL query to fetch recipes
  
      // Execute the query using DButils.execQuery
      const recipe = await DButils.execQuery(`
        SELECT 
            vegetarian, vegan, glutenFree, extendedIngredients, title, 
            readyInMinutes, servings, image, analyzedInstructions
        FROM my_recipes
        WHERE user_id = ${user_id} AND title = '${title}'`);
  
      // If no recipes found, return an empty object
      if (recipe.length === 0) {
        return {};
      }
      console.log("getMyRecipe recipe", recipe)
      // Transform the result into the desired JSON format
      const formattedRecipe = recipe.map(row => ({
        vegetarian: row.vegetarian,
        vegan: row.vegan,
        glutenFree: row.glutenFree,
        extendedIngredients: typeof row.extendedIngredients === 'string' ? JSON.parse(row.extendedIngredients) : row.extendedIngredients,
        title: row.title,
        readyInMinutes: row.readyInMinutes,
        servings: row.servings,
        image: row.image,
        analyzedInstructions: typeof row.analyzedInstructions === 'string' ? JSON.parse(row.analyzedInstructions) : row.analyzedInstructions
    }));
        console.log("getMyRecipe formattedRecipe", formattedRecipe)
      return formattedRecipe;
    } catch (error) {
      console.error('Error fetching recipes:', error.message);
      throw error;
    }

}

async function clearMealPlan(user_id) {
    if (!user_id) throw new Error("User ID is required for clearing meal plan");
  
    // SQL query to delete all entries in the meal_plan table for this user
    await DButils.execQuery(`DELETE FROM meal_plan WHERE user_id = ${user_id}`);
    console.log(`Meal plan cleared for user_id: ${user_id}`);
  }

module.exports = {
    markAsFavorite,
    getFavoriteRecipes,
    markAsLastWatched,
    getLastWatchedRecipes,
    getMealPlan,
    add_to_meal_plan,
    checkIfRecipeExistInMealPlan,
    deleteRecipeFromMealPlan,
    update_meal_plan,
    markAsViewed,
    checkIfRecipeViewed,
    checkIfRecipeExistInMyRecipes,
    AddToMyRecipes,
    getMyRecipes,
    getViewedRecipes,
    deleteRecipeFromFavorites,
    checkIfRecipeExistInFavorites,
    getMyRecipe,
    clearMealPlan
};