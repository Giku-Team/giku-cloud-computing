const CryptoJS = require("crypto-js");
const sendEmail = require("../utils/sendEmail");
const admin = require("firebase-admin");
const db = require("../config/firebase"); // Import Firestore instance
const bcrypt = require("bcrypt");

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Cari user berdasarkan email
    const userSnapshot = await db
      .collection("users")
      .where("email", "==", email)
      .get();

    if (userSnapshot.empty) {
      return res.status(404).json({ code: 404, message: "User not found" });
    }

    const userDoc = userSnapshot.docs[0];
    const userId = userDoc.id;

    // Generate kode verifikasi 5 karakter alfanumerik
    const verificationCode = CryptoJS.lib.WordArray.random(3)
      .toString(CryptoJS.enc.Hex)
      .toUpperCase()
      .slice(0, 5);

    // Tentukan waktu kedaluwarsa (misalnya 15 menit)
    const expirationTime = Date.now() + 15 * 60 * 1000;

    // Simpan kode verifikasi di Firestore
    await db.collection("users").doc(userId).update({
      resetCode: verificationCode,
      resetCodeExpire: expirationTime,
    });

    // Kirim email dengan kode verifikasi
    await sendEmail(
      email,
      "Password Reset Code for Giku App",
      `Your verification code is: ${verificationCode}`
    );

    res.status(200).json({ code: 200, message: "Verification code sent to email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, message: "Internal server error" });
  }
};

const resetPassword = async (req, res) => {
  const { email, verificationCode, newPassword } = req.body;
  const verificationCodeUpperCase = verificationCode.toUpperCase();

  try {
    // Cari user berdasarkan email
    const userSnapshot = await db
      .collection("users")
      .where("email", "==", email)
      .get();

    if (userSnapshot.empty) {
      return res.status(404).json({ code: 404, message: "User not found" });
    }

    const userDoc = userSnapshot.docs[0];
    const userId = userDoc.id;
    const userData = userDoc.data();

    // Validasi kode verifikasi
    if (userData.resetCode !== verificationCodeUpperCase) {
      return res
        .status(400)
        .json({ code: 400, message: "Invalid verification code" });
    }

    // Validasi kode verifikasi expired
    if (userData.resetCodeExpire < Date.now()) {
      return res
        .status(410)
        .json({ code: 410, message: "Expired verification code" });
    }

    // Hash password baru
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password di Firestore dan hapus kode verifikasi
    await db.collection("users").doc(userId).update({
      password: hashedPassword,
      resetCode: admin.firestore.FieldValue.delete(),
      resetCodeExpire: admin.firestore.FieldValue.delete(),
    });

    res.status(200).json({ code: 200, message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, message: "Internal server error" });
  }
};

module.exports = { forgotPassword, resetPassword };
