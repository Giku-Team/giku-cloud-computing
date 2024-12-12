const express = require("express");
const router = express.Router();
const { getUser } = require("../controllers/userController");

router.get("/user/:userId", getUser);
/**
 * @swagger
 * /api/user/{userId}:
 *   get:
 *     summary: Retrieve user information
 *     description: Fetches the details of a user by their unique user ID, excluding sensitive fields like passwords.
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of the user.
 *         schema:
 *           type: string
 *           example: "user@email.com"
 *     responses:
 *       200:
 *         description: Successful response with the user details
 *         content:
 *           application/json:
 *             example:
 *               code: 200
 *               data:
 *                 name: "User Name"
 *                 email: "user@gmail.com"
 *                 phone: null
 *                 dob: null
 *                 address: null
 *                 gender: null
 *                 createdAt: "2024-12-02T15:42:21.658Z"
 *       401:
 *         description: Invalid or expired token
 *       403:
 *         description: Token required
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             example:
 *               code: 404
 *               message: "No user found for this id"
 *       408:
 *         description: Request Timeout
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               code: 500
 *               message: "Failed to fetch user data, Internal server error"
 */

module.exports = router;
