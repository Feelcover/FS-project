import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import {
  registerValidation,
  loginValidation,
  postValidation,
} from "./validations/validations.js";
import authMiddleware from "./utils/authMiddleware.js";
import { login, me, register } from "./controllers/UserController.js";
import {
  create,
  getAll,
  getOne,
  remove,
  update,
  upload,
} from "./controllers/PostController.js";

mongoose
  .connect(
    "mongodb+srv://pioneerbeat:Andrey@fs.h3wezc2.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB connected"))
  .catch((err) => console.log("DB error", err));

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const uploader = multer({storage});

const app = express();

app.use(express.json());



// Выполнение авторизации
app.post("/auth/login", loginValidation, login);

// Выполнение регистрации
app.post("/auth/register", registerValidation, register);

// Запрос всех статей
app.get("/posts", getAll);

// Запрос статьи
app.get("/posts/:id", getOne);




//Запросы требующие токен

// Запрос данных пользователя
app.get("/auth/me", authMiddleware, me);

// Выполнение создания статьи
app.post("/posts", authMiddleware, postValidation, create);

// Выполнение удаления статьи
app.delete("/posts/:id", authMiddleware, remove);

// Запрос обновления статьи
app.patch("/posts/:id", authMiddleware, update);

// Запрос на выгрузку файла
app.post("/upload", authMiddleware, uploader.single('image'), upload)




// Проверка порта
app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Server started");
});
