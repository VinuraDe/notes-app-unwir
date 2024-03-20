const express = require("express");
const { UserModel } = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const userRouter = express.Router();
require("dotenv").config();
const KEY = process.env.SECRET_KEY;

userRouter.get("/", (req, res) => {
  res.send("All the users");
});

userRouter.post(
  "/register",
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Invalid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, email, password } = req.body;
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }
      const hash = await bcrypt.hash(password, 5);
      const user = new UserModel({ name, email, password: hash });
      await user.save();
      res.send({
        message: "New User Added",
        status: 1,
      });
    } catch (error) {
      res.status(500).send({
        message: "Something went wrong",
        status: 0,
      });
    }
  }
);

userRouter.post(
  "/login",
  body("email").isEmail().withMessage("Invalid email"),
  body("password").notEmpty().withMessage("Password is required"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(404).json({
          message: "User does not exist",
          status: 0,
        });
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({
          message: "Incorrect password",
          status: 0,
        });
      }
      const token = jwt.sign({ userId: user._id }, KEY, {
        expiresIn: "3m",
      });
      res.send({
        message: "User logged in successfully",
        token,
        status: 1,
      });
    } catch (error) {
      res.status(500).send({
        message: "Something went wrong",
        status: 0,
      });
    }
  }
);


module.exports = { userRouter };
