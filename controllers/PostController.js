import PostSchema from "../models/Post";

export const create = async (req, res) => {
  try {
    const doc = new PostSchema({
      user: req.userId,
      title: req.body.email,
      text: req.body.title,
      tags: req.body.tags,
      imageUrl: req.body.imageUrl,
    });
    const post = await doc.save();
    res.jspn(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось создать пост",
    });
  }
};
