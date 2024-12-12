require("dotenv").config();

const { getFirestore } = require("firebase-admin/firestore");
const admin = require("firebase-admin");
const path = require("path");
const firebaseConfigPath = path.resolve(__dirname, '../firebase-config.json');
const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const serviceAccount = require(path.resolve(serviceAccountPath));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = getFirestore("giku-db");

module.exports = db;
