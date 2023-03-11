import express from "express";
import mongoose from "mongoose";
import { registerValidation, loginValidation } from "./validations/validations.js";
import authMiddleware from "./utils/authMiddleware.js";
import { login, me, register } from "./controllers/UserController.js";

mongoose
  .connect(
    "mongodb+srv://pioneerbeat:Andrey@fs.h3wezc2.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB connected"))
  .catch((err) => console.log("DB error", err));
const app = express();

app.use(express.json());

//Обработка запроса авторизации
app.post("/auth/login", loginValidation, login);
//Обработка запроса регистрации
app.post("/auth/register", registerValidation, register);
//Обработка запроса данных пользователя
app.get("/auth/me", authMiddleware, me);

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Server started");
});
