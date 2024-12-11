const express = require("express");
const router = express.Router();
const {
  addChildren,
  getChildren,
} = require("../controllers/childrenController");
const multer = require("multer");
const storage = multer.memoryStorage(); // Simpan file di memori sementara
const upload = multer({ storage });

router.post("/users/:userId/children", upload.single("photo"), addChildren);

// Dapatkan semua anak dari pengguna tertentu
router.get("/users/:userId/children", getChildren);
/**
 * @swagger
 * /api/users/{userId}/children:
 *  post:
 *    summary: Add a child for a specific user
 *    tags:
 *      - Children
 *    security:
 *      - BearerAuth: []
 *    parameters:
 *      - name: userId
 *        example: "user@email.com"
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
 *              name:
 *                type: string
 *                example: John Doe
 *              dateOfBirth:
 *                type: string
 *                example: 2010-05-15
 *              gender:
 *                type: string
 *                example: Male
 *              weight:
 *                type: number
 *                example: 25.5
 *              height:
 *                type: number
 *                example: 120
 *              bloodType:
 *                type: string
 *                example: O
 *              fatherHeight:
 *                type: number
 *                example: 170
 *              motherHeight:
 *                type: number
 *                example: 160
 *              allergies:
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                    name:
 *                      type: string
 *                      example: Peanut
 *                    category:
 *                      type: string
 *                      example: Food
 *                    severity:
 *                      type: string
 *                      example: Severe
 *              photo:
 *                type: string
 *                format: binary
 *                description: "Optional. The child's photo. If not provided, no photo will be uploaded."
 *    responses:
 *      201:
 *        description: Child added successfully
 *      401:
 *        description: Token required
 *      403:
 *        description: Invalid or expired token
 *      408:
 *         description: Request Timeout
 *      500:
 *        description: Internal server error
 *
 *  get:
 *   summary: Get all children for a specific user
 *   tags:
 *     - Children
 *   security:
 *     - BearerAuth: []
 *   parameters:
 *     - name: userId
 *       example: "user@email.com"
 *       in: path
 *       required: true
 *       description: The ID of the user
 *       schema:
 *         type: string
 *   responses:
 *     200:
 *       description: A list of children for the user
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: integer
 *                 example: 200
 *               data:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: childId123
 *                     name:
 *                       type: string
 *                       example: John Doe
 *                     dateOfBirth:
 *                       type: string
 *                       example: 2010-05-15
 *                     gender:
 *                       type: string
 *                       example: Male
 *                     weight:
 *                       type: string
 *                       example: 25.5
 *                     height:
 *                       type: string
 *                       example: 120
 *                     bloodType:
 *                       type: string
 *                       example: O
 *                     fatherHeight:
 *                       type: string
 *                       example: 170
 *                     motherHeight:
 *                       type: string
 *                       example: 160
 *                     photoURL:
 *                       type: string
 *                       example: https://storage.googleapis.com/bucket-name/children/photo.jpg
 *                     allergies:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: Peanut
 *                           category:
 *                             type: string
 *                             example: Food
 *                           severity:
 *                             type: string
 *                             example: Severe
 *     401:
 *        description: Invalid or expired token
 *     403:
 *        description: Token required
 *     404:
 *       description: No children found
 *     408:
 *       description: Request Timeout
 *     500:
 *       description: Internal server error
 */

router.get("/children", (req, res) => {
  res.send("Get all children data");
});

module.exports = router;
