import express from "express";
import mongoose from "mongoose";
import { validationResult } from "express-validator";
import { registerValidation } from "./validations/auth.js";

mongoose
  .connect(
    "mongodb+srv://pioneerbeat:Andrey@fs.h3wezc2.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB ok"))
  .catch((err) => console.log("DB error", err));
const app = express();

app.use(express.json());

app.post("/auth/register", registerValidation, (req, res) => {
  const error = validationResult(req);
  if(!error.isEmpty()){
    return res.status(400).json(error.array())
  }
  res.json({
    success: true,
  })
});

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Ok");
});
