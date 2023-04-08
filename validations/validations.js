import { body } from "express-validator";

export const registerValidation = [
  body("email", "Неверный формат почты").isEmail(),
  body("password", "Пароль должен быть длинной минимум 5 символов").isLength({
    min: 5,
  }),
  body("fullName", "Имя должно иметь минимум 2 символа").isLength({ min: 2 }),
  body("avatarUrl", "Неверная ссылка на аватарку").optional().isURL(),
];

export const loginValidation = [
  body("email", "Неверный формат почты").isEmail(),
  body("password", "Пароль должен быть длинной минимум 5 символов").isLength({
    min: 5,
  }),
];

export const postValidation = [
  body("title", "Введите заголовок статьи").isLength({ min: 3 }).isString(),
  body("text", "Введите текст статьи, минимум 10 симоволов")
    .isLength({ min: 10 })
    .isString(),
  body("tags", "Ошибка формата тегов").optional().isArray(),
  body("imageUrl", "Неверная ссылка на изображение").optional().isString(),
];
