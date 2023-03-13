import PostSchema from "../models/Post.js";

export const create = async (req, res) => {
  try {
    const doc = new PostSchema({
      title: req.body.title,
      text: req.body.text,
      tags: req.body.tags,
      user: req.userId,
      imageUrl: req.body.imageUrl,
    });
    const post = await doc.save();
    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось создать пост",
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const posts = await PostSchema.find().populate("user").exec();

    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось найти статьи",
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;
    PostSchema.findOneAndUpdate(
      { _id: postId, },
      { $inc: { viewCount: 1 }, },
      { returnDocument: "after", },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: "Ошибка поиска статьи",
          });
        }
        
        if (!doc) {
          return res.status(404).json({
            message: "Статья не найдена",
          });
        }
        res.json(doc);
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось найти стать.",
    });
  }
};
