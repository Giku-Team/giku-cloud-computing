const { bucket } = require("../config/storage");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const db = require("../config/firebase");
const { verifyToken } = require("../middleware/AuthToken");

const addArticle = [
  verifyToken,
  async (req, res) => {
    const { userId } = req.params; // userId dari parameter URL
    const { title, content } = req.body; // Judul dan konten artikel
    const file = req.file; // Gambar artikel
    let imageURL = null;

    try {
      if (file) {
        const fileName = `article/${uuidv4()}-${path.basename(file.originalname)}`;
        const fileUpload = bucket.file(fileName);

        const stream = fileUpload.createWriteStream({
          metadata: {
            contentType: file.mimetype,
          },
        });

        stream.on("error", (err) => {
          console.error(err);
          return res.status(500).json({ code: 500, message: "Failed to upload image" });
        });

        stream.on("finish", async () => {
          imageURL = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

          const newArticle = {
            title,
            content,
            imageURL,
            createdAt: new Date(),
          };

          const articleRef = await db
            .collection("users")
            .doc(userId)
            .collection("article")
            .add(newArticle);

          res.status(201).json({
            code: 201,
            message: "Article added successfully",
            articleId: articleRef.id,
          });
        });

        stream.end(file.buffer);
      } else {
        const newArticle = {
          title,
          content,
          imageURL: null,
          createdAt: new Date(),
        };

        const articleRef = await db
          .collection("users")
          .doc(userId)
          .collection("article")
          .add(newArticle);

        res.status(201).json({
          code: 201,
          message: "Article added successfully without image",
          articleId: articleRef.id,
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to add article" });
    }
  },
];

const getArticle = [
  verifyToken,
  async (req, res) => {
    const { userId } = req.params;

    try {
      const articleSnapshot = await db
        .collection("users")
        .doc(userId)
        .collection("article")
        .get();

      if (articlenapshot.empty) {
        return res.status(404).json({ code: 404, message: "No article found for this user" });
      }

      const articleData = articlenapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      res.status(200).json({ code: 200, data: articleData });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to fetch article" });
    }
  },
];

module.exports = { addArticle, getArticle };
