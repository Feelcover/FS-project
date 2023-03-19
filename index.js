import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import authMiddleware from "./utils/authMiddleware.js";
import validationMiddleware from "./utils/validationMiddleware.js";
import { PostController, UserController } from "./controllers/index.js";
import { validations } from "./validations/index.js"
import cors from "cors"


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

const uploader = multer({ storage });

const app = express();

app.use(cors());
app.use(express.json());
app.use("/upload", express.static("uploads"));

// Выполнение авторизации
app.post("/auth/login", validations.loginValidation, validationMiddleware, UserController.login);

// Выполнение регистрации
app.post("/auth/register", validations.registerValidation, validationMiddleware, UserController.register);

// Запрос всех статей
app.get("/posts", PostController.getAll);

// Запрос статьи
app.get("/posts/:id", PostController.getOne);

//Запросы требующие токен

// Запрос данных пользователя
app.get("/auth/me", authMiddleware, UserController.me);

// Выполнение создания статьи
app.post(
  "/posts",
  authMiddleware,
  validations.postValidation,
  validationMiddleware,
  PostController.create
);

// Выполнение удаления статьи
app.delete("/posts/:id", authMiddleware, PostController.remove);

// Запрос обновления статьи
app.patch("/posts/:id", authMiddleware, validationMiddleware, PostController.update);

// Запрос на выгрузку файла
app.post("/upload", authMiddleware, uploader.single("image"), PostController.upload);

// Проверка порта
app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Server started");
});
