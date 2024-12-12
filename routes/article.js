const express = require("express");
const router = express.Router();
const { getArticle } = require("../controllers/articleController");
/**
 * @swagger
 * /api/articles:
 *   get:
 *     summary: Get All Article
 *     description: Fetches all articles from the database, ordered by date in descending order.
 *     tags:
 *       - Article
 *     responses:
 *       200:
 *         description: Successful response with the list of articles
 *         content:
 *           application/json:
 *             example:
 *               code: 200
 *               data:
 *                 - id: "CkGhy0cEtuuXL3rSiebv"
 *                   Title: "Proses Stunting Terjadi Bertahap, Kenali Tanda Awalnya"
 *                   Description: "KOMPAS.com - Stunting merupakan dampak dari kekurangan gizi kronis yang dialami bayi..."
 *                   Author: "Lusia Kus Anna Artikel ini telah tayang di Kompas.com..."
 *                   photoURL: "https://storage.googleapis.com/giku-bucket/article/Proses%20Stunting%20Terjadi%20Bertahap%2C%20Kenali%20Tanda%20Awalnya.jpg"
 *                   Date: "2024-12-10"
 *       408:
 *         description: Request Timeout
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               code: 500
 *               message: "Internal Server Error"
 */

router.get("/articles", getArticle);

module.exports = router;
