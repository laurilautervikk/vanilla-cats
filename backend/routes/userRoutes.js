const express = require("express");
const router = express.Router();
const User = require("../dbConnection");
const bodyParser = require("body-parser");
const cors = require("cors");

router.use(cors());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

//API routes
//get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    console.log("users ", users);
    res.status(200).json(users);
  } catch {
    res.status(500).json({ error: "Users error" });
  }
});

// //get a single user by username
router.get("/user/username/:username", async (req, res) => {
  try {
    console.log("req.params.username ", req.params.username);
    const userFromDB = await User.findOne({ username: req.params.username });

    console.log("userFromDB.username ", userFromDB);
    res.status(200).json(userFromDB);
  } catch {
    res.status(200).json({ error: "No user by that name" });
  }
});

// //get a single user by id
router.get("/user/id/:id", async (req, res) => {
  try {
    console.log("req.params.id ", req.params.id);
    const userFromDB = await User.findOne({ _id: req.params.id });

    console.log("userFromDB ", userFromDB);
    res.status(200).json(userFromDB);
  } catch {
    res.status(200).json({ error: "No user by that id" });
  }
});

// //register a new user
router.post("/register", async (req, res) => {
  try {
    console.log("req.body ", req.body);
    const inUse = await User.findOne({ username: req.body.username });
    if (!inUse) {
      User.create({
        username: req.body.username,
        password: req.body.password,
      });
      res.status(201).json({
        message: "User created",
        username: req.body.username,
      });
    } else {
      res.status(200).json({ message: "Username already taken" });
    }
  } catch {
    res.status(500).json({ error: "Failed to create user" });
  }
});

// //user login
router.post("/login", async (req, res) => {
  console.log("req.body ", req.body);
  try {
    const userFromDB = await User.findOne({ username: req.body.username });
    console.log("userFromDB ", userFromDB);
    if (userFromDB) {
      if (userFromDB.password === req.body.password) {
        res.status(200).json({
          message: "User logged in",
          userId: userFromDB._id,
        });
      } else {
        res.status(200).json({ message: "Wrong password" });
      }
    } else {
      res.status(404).json({ error: "No user by that name" });
    }
  } catch {
    res.status(500).json({ error: "Login error" });
  }
});

//edit user - N/A

// //delete user
router.delete("/delete/:id", async (req, res) => {
  try {
    console.log("req.body ", req.body);
    console.log("req.params ", req.params.id);
    const userFromDB = await User.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: `User deleted ${userFromDB.username}` });
  } catch {
    res.status(500).json({ error: "Failed to delete user" });
  }
});

module.exports = router;
