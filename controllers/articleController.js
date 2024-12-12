const db = require("../config/firebase");

const getArticle = async (req, res) => {
  try {
    const articleSnapshot = await db
      .collection("article")
      .orderBy("Date", "desc")
      .get();

    console.log(articleSnapshot);

    const articleData = articleSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({ code: 200, data: articleData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, message: "Internal Server Error" });
  }
};
module.exports = { getArticle };
