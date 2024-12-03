const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/firebase");
<<<<<<< HEAD
const { updatePassword } = require('../controllers/authController');
=======
>>>>>>> 36ce8f2d47dabe0ef93cf54176e3edbc9d3b4529

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET;

<<<<<<< HEAD
=======
// Middleware to handle request timeout (408)
router.use((req, res, next) => {
  req.setTimeout(20000, () => {
    // Timeout setelah 20 detik
    res.status(408).json({ code: 408, message: "Request Timeout" });
  });
  next();
});

>>>>>>> 36ce8f2d47dabe0ef93cf54176e3edbc9d3b4529
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
<<<<<<< HEAD
 */

// Login isi dibawah ini

=======
 *       408:
 *         description: Request Timeout
 *       500:
 *         description: Internal server error
 */

>>>>>>> 36ce8f2d47dabe0ef93cf54176e3edbc9d3b4529
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
<<<<<<< HEAD
    res.status(500).json({ code: 500, message: "Error saat login", error });
=======
    res
      .status(500)
      .json({ code: 500, message: "Internal server error", error });
>>>>>>> 36ce8f2d47dabe0ef93cf54176e3edbc9d3b4529
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
<<<<<<< HEAD
 */

// endpoint update password
const updatePassword = async (req, res) => {
  const { email, newPassword, verificationCode } = req.body;

  try {
    // Validasi input
    if (!email || !newPassword || !verificationCode) {
      return res.status(400).json({ message: 'Email, new password, and verification code are required' });
    }

    // Cari user berdasarkan email
    const userSnapshot = await db.collection('users').where('email', '==', email).get();
    if (userSnapshot.empty) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userDoc = userSnapshot.docs[0];
    const userId = userDoc.id;
    const userData = userDoc.data();

    // Validasi kode verifikasi
    if (
      userData.resetCode !== verificationCode ||
      userData.resetCodeExpire < Date.now()
    ) {
      return res.status(400).json({ message: 'Invalid or expired verification code' });
    }

    // Hash password baru
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password di Firestore dan hapus resetCode serta resetCodeExpire
    await db.collection('users').doc(userId).update({
      password: hashedPassword,
      resetCode: admin.firestore.FieldValue.delete(),
      resetCodeExpire: admin.firestore.FieldValue.delete(),
    });

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

/**
 * @swagger
 * /auth/update-password:
 *   post:
 *     summary: Update the user's password after forgot password verification
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
 *                 example: newSecurePassword123
 *               verificationCode:
 *                 type: string
 *                 example: A1B2C
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Invalid or expired verification code
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.post('/update-password', updatePassword);

module.exports = { updatePassword };
=======
 *       408:
 *         description: Request Timeout
 *       500:
 *         description: Internal server error
 */
>>>>>>> 36ce8f2d47dabe0ef93cf54176e3edbc9d3b4529

module.exports = router;
