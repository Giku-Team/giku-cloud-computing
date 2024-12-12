const express = require("express");
const router = express.Router();
const { addArticle, getArticle } = require("../controllers/articleController");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });
/**
 * @swagger
 * /api/users/{userId}/article:
 *  post:
 *    summary: Add an article for a specific user
 *    tags:
 *      - Article
 *    security:
 *      - BearerAuth: []
 *    parameters:
 *      - name: userId
 *        in: path
 *        required: true
 *        description: The ID of the user
 *        schema:
 *          type: string
 *    requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            properties:
 *              title:
 *                type: string
 *                example: "My First Article"
 *              content:
 *                type: string
 *                example: "This is the content of the article."
 *              image:
 *                type: string
 *                format: binary
 *    responses:
 *      201:
 *        description: Article added successfully
 *      500:
 *        description: Internal server error
 *  get:
 *    summary: Get all article for a specific user
 *    tags:
 *      - Article
 *    security:
 *      - BearerAuth: []
 *    parameters:
 *      - name: userId
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: List of article
 *      404:
 *        description: No article found
 *      500:
 *        description: Internal server error
 */

router.post("/users/:userId/article", upload.single("image"), addArticle);
router.get("/users/:userId/article", getArticle);

module.exports = router;
