const express = require("express");
const app = express();
const { body, validationResult } = require("express-validator");
const router = express.Router();
const bcrypt = require("bcryptjs");
const AllUsers = require("../models/users");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/getUser");
const JWT_SECRET=process.env.JWT_SECRET

router.post("/signup",[
    body("firstName", "Name must be consist atleast two words").isLength({min: 2,}),
    body("lastName", "Enter a valid email").isLength({ min: 2 }),
    body("userName", "Enter a valid email").isLength({ min: 2 }),
    body("password", "Password must be atleast five charcters").isLength({min: 5}),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array(), msg: "Please fill up details." });
    }
    try {
      let check = await AllUsers.findOne({ userName: req.body.userName });
      if (check) {
        return res.status(401).send("UserName already exists.");
      }
      const salt = await bcrypt.genSalt(10);
      const securePassord = await bcrypt.hash(req.body.password, salt);

      const newUser = await AllUsers.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        userName: req.body.userName,
        password: securePassord,
      });

      res.status(200).send({ msg: "success" });
    } catch (e) {
      res.status(500).send("Internal Server Error");
    }
  }
);

router.post(
  "/login",
  [body("userName", "Enter a valid email.").exists(),
  body("password", "Please Enter Your Password").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let user = await AllUsers.findOne({ userName: req.body.userName });
      if (!user) {
        return res.status(400).send("User doesnt exist. Please Sign up first");
      }
      let comparePassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!comparePassword) {
        return res.status(400).send("Please Login with correct credentials");
      }
      let data = {
        userId: user._id,
      };
      const authToken = await jwt.sign(data, JWT_SECRET);

      res.status(200).send({ msg: "Logged In Successfully.", authToken: authToken });
    } catch (e) {
      res.status(500).send("Login Internal server error");
    }
  }
);

//login required,all user details
router.get('/userDetails', fetchuser, async (req, res) => {
  try {
    if (req.userId) {
      const allUsers = await AllUsers.find({ _id: req.userId }).select("-password")
      res.status(200).json(allUsers)
    }
    else {
      const filter = {}
      const allUsers = await AllUsers.find({ filter }).select("-password")
      res.status(200).json(allUsers)
    }
  }
  catch (e) {
    res.status(500).send("Internal Server Error")
  }
})

router.get('/userList', fetchuser, async (req, res) => {
  try {
    if (req.userId) {
      const filter = {}
      const allUsers = await AllUsers.find({ filter }).select({ userName: 1, _id: 0 })
      res.status(200).json(allUsers)
    }
  }
  catch (e) {
    res.status(500).send("Internal Server Error")
  }
})
module.exports = router;
