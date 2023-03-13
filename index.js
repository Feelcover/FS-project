import express from "express";
import mongoose from "mongoose";
import {
  registerValidation,
  loginValidation,
  postValidation
} from "./validations/validations.js";
import authMiddleware from "./utils/authMiddleware.js";
import { login, me, register } from "./controllers/UserController.js";
import { create, getAll, getOne } from "./controllers/PostController.js";

mongoose
  .connect(
    "mongodb+srv://pioneerbeat:Andrey@fs.h3wezc2.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB connected"))
  .catch((err) => console.log("DB error", err));
  
const app = express();

app.use(express.json());

// Запрос авторизации
app.post("/auth/login", loginValidation, login);

// Запрос регистрации
app.post("/auth/register", registerValidation, register);

// Запрос данных пользователя
app.get("/auth/me", authMiddleware, me);

// Создание статьи
app.post("/posts", authMiddleware, postValidation, create);

// Получение всех статей
app.get("/posts", getAll);

// Получение статьи
app.get("/posts/:id", getOne);

// // Удаление статьи
// app.get("/posts", remove);

// // Обновление статьи
// app.get("/posts", update);


app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Server started");
});
