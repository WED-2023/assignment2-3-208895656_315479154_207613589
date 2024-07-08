SELECT * FROM mydb.users;

-- Create Users Table
-- CREATE TABLE users (
--     user_id INT AUTO_INCREMENT PRIMARY KEY,
--     username VARCHAR(8) NOT NULL UNIQUE,
--     firstname VARCHAR(255) NOT NULL,
--     lastname VARCHAR(255) NOT NULL,
--     country VARCHAR(255) NOT NULL,
--     email VARCHAR(255) NOT NULL,
--     password VARCHAR(60) NOT NULL
-- );


CREATE TABLE favoriterecipes(
    user_id INT PRIMARY KEY,
    recipe_id INT NOT NULL
)


-- INSERT INTO users (username, firstname, lastname, country, email, password) 
-- VALUES ('galevi', 'gal', 'levi', 'israel', 'galevi@example.com', 'gal123');

CREATE TABLE meal_plan (
    user_id INT PRIMARY KEY,
    recipe_ids JSON
);

-- Insert a new user with a single recipe
INSERT INTO meal_plan (user_id, recipe_ids) VALUES (3, JSON_ARRAY());

