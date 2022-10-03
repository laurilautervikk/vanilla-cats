const express = require("express");
const router = express.Router();

//API routes
//get all users
router.get("/users", async (req, res) => {
  try {
    console.log("users ARE HERE");
    res.send("GET /users");
  } catch {
    console.log("users error");
  }
});

// //get a single user by id
router.get("/user/:id", async (req, res) => {
  try {
    console.log("/user/:id ARE HERE");
  } catch {
    console.log("users error");
  }
});

// //register a new user
router.post("/register", async (req, res) => {
  try {
    console.log("/register ARE HERE");
    res.send("GET /register");
  } catch {
    console.log("users error");
  }
});

// //user login
router.post("/login", async (req, res) => {
  try {
    console.log("/login ARE HERE");
  } catch {
    console.log("users error");
  }
});

//edit user - N/A

// //delete user
router.delete("/delete:id", async (req, res) => {
  try {
    console.log("/delete:id ARE HERE");
  } catch {
    console.log("users error");
  }
});

module.exports = router;
