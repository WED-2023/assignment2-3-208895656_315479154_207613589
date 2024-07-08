const DButils = require("./DButils");

async function markAsFavorite(user_id, recipe_id){
    await DButils.execQuery(`insert into FavoriteRecipes values ('${user_id}',${recipe_id})`);
}

async function markAsWatched(user_id, recipe_id) {
    // Fetch the current recipe_ids for the user
    const userRecord = await DButils.execQuery(`SELECT recipe_ids FROM last_watched WHERE user_id = ${user_id}`);
    if (userRecord.length === 0) {
        // If user doesn't exist, insert a new record
        await DButils.execQuery(`INSERT INTO last_watched (user_id, recipe_ids) VALUES (${user_id}, JSON_ARRAY(${recipe_id}))`);
    } else {
        // If user exists, update the recipe_ids
        console.log("user record[0].recipeids", userRecord[0].recipe_ids)
        let recipeIds = userRecord[0].recipe_ids
        console.log("recipe ids", recipeIds)
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


async function getFavoriteRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select recipe_id from FavoriteRecipes where user_id='${user_id}'`);
    return recipes_id;
}


async function getLastWatchedRecipes(user_id) {
    const userRecord = await DButils.execQuery(`SELECT recipe_ids FROM last_watched WHERE user_id = ${user_id}`);
    return userRecord[0].recipe_ids;
}


exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
module.exports = {
    markAsFavorite,
    getFavoriteRecipes,
    markAsWatched,
    getLastWatchedRecipes
};