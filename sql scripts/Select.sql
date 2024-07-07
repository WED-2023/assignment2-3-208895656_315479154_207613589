SELECT * FROM mydb.users;

CREATE TABLE users (
    username VARCHAR(8) NOT NULL UNIQUE PRIMARY KEY,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    country VARCHAR(255) NOT NULL,
    password VARCHAR(60) NOT NULL,
    email VARCHAR(255) NOT NULL 
);
