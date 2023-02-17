import jwt from "jsonwebtoken";

export default (req, res, next) => {
  const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");

  if (token) {
    try {
      const decode = jwt.verify(token, "secret");

      req.userId = decode._id;
      next();
    } catch (err) {
      res.status(403).json({
        message: "Нет доступа",
      });
    }
  } else {
    res.status(403).json({
      message: "Нет доступа",
    });
  }
};
