const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/firebase");

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET;

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
 */

// Login isi dibawah ini

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
    res.status(500).json({ message: "Error saat login", error });
  }
});

/**
 * @swagger
 * /auth/login:
 *   post:
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
 *       401:
 *         description: Invalid credentials
 */

module.exports = router;
