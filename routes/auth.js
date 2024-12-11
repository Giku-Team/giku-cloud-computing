const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/firebase");
const {
  forgotPassword,
  resetPassword,
  validateResetCode,
} = require("../controllers/authController");

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET;

// Middleware to handle request timeout (408)
router.use((req, res, next) => {
  req.setTimeout(20000, () => {
    // Timeout setelah 20 detik
    res.status(408).json({ code: 408, message: "Request Timeout" });
  });
  next();
});

// Register
router.post("/register", async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userRef = db.collection("users").doc(email);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      return res
        .status(400)
        .json({ code: 400, message: "User already exists" });
    }

    // Simpan data dasar pengguna
    await userRef.set({
      name,
      email,
      password: hashedPassword,
      phone: null, // Belum diisi optional
      dob: null, // Belum diisi optional
      address: null, // Belum diisi optional
      gender: null, // Belum diisi optional
      createdAt: new Date().toISOString(),
    });

    res.status(201).json({ code: 201, message: "Success" });
  } catch (error) {
    res
      .status(500)
      .json({ code: 500, message: "Internal server error", error });
  }
});

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: User already exists
 *       408:
 *         description: Request Timeout
 *       500:
 *         description: Internal server error
 */

// Endpoint Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const usersRef = db.collection("users");
    const userSnapshot = await usersRef.where("email", "==", email).get();

    if (userSnapshot.empty) {
      return res
        .status(400)
        .json({ code: 400, message: "Invalid email or password" });
    }

    const userDoc = userSnapshot.docs[0];
    const userData = userDoc.data();
    const isPasswordValid = await bcrypt.compare(password, userData.password);

    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ code: 400, message: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        userId: userDoc.id,
        userEmail: userData.email,
        userName: userData.name,
      },
      SECRET_KEY,
      {
        expiresIn: "24h",
      }
    );
    res.json({ code: 200, message: "Login Successful", token });
  } catch (error) {
    res
      .status(500)
      .json({ code: 500, message: "Internal server error", error });
  }
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Login a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *       400:
 *         description: Invalid credentials
 *       408:
 *         description: Request Timeout
 *       500:
 *         description: Internal server error
 */

router.post("/forgot-password", forgotPassword);
/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Send a verification code for password reset
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Verification code sent to email
 *       404:
 *         description: User not found
 *       408:
 *         description: Request Timeout
 *       500:
 *         description: Internal server error
 */

router.post("/validate-reset-code", validateResetCode);
/**
 * @swagger
 * /auth/validate-reset-code:
 *   post:
 *     summary: Validate verification code
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               verificationCode:
 *                 type: string
 *                 example: "A1B2C"
 *     responses:
 *       200:
 *         description: Verification successful
 *       400:
 *         description: Invalid verification code
 *       404:
 *         description: User not found
 *       408:
 *         description: Request Timeout
 *       410:
 *         description: Expired verification code
 *       500:
 *         description: Internal server error
 */

router.post("/reset-password", resetPassword);
/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               newPassword:
 *                 type: string
 *                 example: "NewPassword123"
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       403:
 *         description: Verification required before resetting password
 *       404:
 *         description: User not found
 *       408:
 *         description: Request Timeout
 *       410:
 *         description: The reset time has expired
 *       500:
 *         description: Internal server error
 */

module.exports = router;
