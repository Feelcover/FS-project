import express from "express";
import mongoose from "mongoose";
import { validationResult } from "express-validator";
import { registerValidation } from "./validations/auth.js";
import UserSchema from "./models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authMiddleware from "./utils/authMiddleware.js";

mongoose
  .connect(
    "mongodb+srv://pioneerbeat:Andrey@fs.h3wezc2.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB ok"))
  .catch((err) => console.log("DB error", err));
const app = express();

app.use(express.json());

//Получение запроса авторизации
app.post("/auth/login", async (req, res) => {
  try {
    const user = await UserSchema.findOne({ email: req.body.email });

    if (!user) {
      return req.status(404).json({
        message: "Неверный логин или пароль",
      });
    }
    const password = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );
    if (!password) {
      return req.status(404).json({
        message: "Неверный логин или пароль",
      });
    }
    const { passwordHash, ...UserData } = user._doc;

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret",
      {
        expiresIn: "30d",
      }
    );

    res.json({
      ...UserData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось провести авторизацию",
    });
  }
});

//Получение запроса регистрации
app.post("/auth/register", registerValidation, async (req, res) => {
  try {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json(error.array());
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserSchema({
      email: req.body.email,
      passwordHash: hash,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
    });

    const user = await doc.save();
    const { passwordHash, ...UserData } = user._doc;
    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret",
      {
        expiresIn: "30d",
      }
    );

    res.json({
      ...UserData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось провести регистрацию",
    });
  }
});

app.get("/auth/me", authMiddleware, async (req, res) => {
  try {
    const user = await UserSchema.findById(req.userId);

    if (!user) {
      return res.json({ message: "Пользователь не найден" });
    }

    const { passwordHash, ...UserData } = user._doc;

    res.json(UserData);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Пользователь не найден",
    });
  }
});

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Ok");
});
