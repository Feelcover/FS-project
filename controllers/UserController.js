import UserSchema from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";


export const register = async (req, res) => {
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
  }

  export const login = async (req, res) => {
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
  }

  export const me = async (req, res) => {
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
  }