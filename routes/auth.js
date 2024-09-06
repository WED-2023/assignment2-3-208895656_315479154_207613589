var express = require("express");
var router = express.Router();
const MySql = require("../routes/utils/MySql");
const DButils = require("../routes/utils/DButils");
const bcrypt = require("bcrypt");

router.post("/Register", async (req, res, next) => {
  try {
    // parameters exists
    // valid parameters
    // username exists
    console.log("starting register on server")
    console.log("req", req.body)

    let user_details = {
      username: req.body.username,
      firstname: req.body.firstName,
      lastname: req.body.lastName,
      country: req.body.country,
      password: req.body.password,
      email: req.body.email,
    }
    console.log("params", req.body.params)
    let users = [];
    users = await DButils.execQuery("SELECT username from users");

    if (users.find((x) => x.username === user_details.username))
      throw { status: 409, message: "Username taken" };

    // add the new username
    let hash_password = bcrypt.hashSync(
      user_details.password,
      parseInt(process.env.bcrypt_saltRounds)
    );
    await DButils.execQuery(
      `INSERT INTO users (username, firstname, lastname, country, email, password) 
      VALUES ('${user_details.username}', '${user_details.firstname}', '${user_details.lastname}', 
      '${user_details.country}', '${user_details.email}', '${hash_password}')`
      `INSERT INTO users (username, firstname, lastname, country, email, password) 
      VALUES ('${user_details.username}', '${user_details.firstname}', '${user_details.lastname}', 
      '${user_details.country}', '${user_details.email}', '${hash_password}')`
    );
    
    res.status(201).send({ message: "user created", success: true });
  } catch (error) {
    next(error);
  }
});

router.post("/Login", async (req, res, next) => {
  try {
    console.log("Login request received");
    console.log("Request body:", req.body);

    // Check that username exists
    const users = await DButils.execQuery("SELECT username FROM users");
    if (!users.find((x) => x.username === req.body.username))
      throw { status: 401, message: "Username or Password incorrect" };

    // Check password
    const user = (
      await DButils.execQuery(
        `SELECT * FROM users WHERE username = '${req.body.username}'`
      )
    )[0];
    if (!bcrypt.compareSync(req.body.password, user.password)) {
      throw { status: 401, message: "Username or Password incorrect" };
    }

    // Set session
    req.session.user_id = user.user_id;
    console.log("Session ", req.session);
    console.log("Session user_id set:", req.session.user_id);

    res.status(200).send({ message: "login succeeded", success: true, user_id: user.user_id });
  } catch (error) {
    console.error("Login error:", error);
    next(error);
  }
});


router.post("/Logout", function (req, res) {
  console.log("session:", req.session)
  console.log(req.session.user_id)
  req.session.reset(); // reset the session info --> send cookie when  req.session == undefined!!
  res.send({ success: true, message: "logout succeeded" });
});


router.get("/current_user", async (req, res, next) => {
  try {
    if (req.session.user_id === undefined) {
      throw { status: 401, message: "unauthorized" };
    }
    res.status(200).send({ data: req.session.user_id });
  } catch (error) {
    next(error);
  }
});



router.get("/current_user", async (req, res, next) => {
  try {
    if (req.session.user_id === undefined) {
      throw { status: 401, message: "unauthorized" };
    }
    res.status(200).send({ data: req.session.user_id });
  } catch (error) {
    next(error);
  }
});


module.exports = router;