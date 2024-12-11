const { bucket } = require("../config/storage"); // Import bucket dari konfigurasi
const path = require("path");
const { v4: uuidv4 } = require("uuid"); // Untuk membuat nama unik
const db = require("../config/firebase");
const { verifyToken } = require("../middleware/AuthToken");

const addChildren = [
  verifyToken,
  async (req, res) => {
    const { userId } = req.params; // userId dari parameter URL
    const {
      name,
      dateOfBirth,
      gender,
      weight,
      height,
      bloodType,
      fatherHeight,
      motherHeight,
      allergies,
    } = req.body;

    const file = req.file; // Foto anak
    let photoURL = null;

    try {
      if (file) {
        // Jika file foto ada, upload foto ke Cloud Storage
        const fileName = `children/${uuidv4()}-${path.basename(
          file.originalname
        )}`;
        const fileUpload = bucket.file(fileName);

        const stream = fileUpload.createWriteStream({
          metadata: {
            contentType: file.mimetype,
          },
        });

        stream.on("error", (err) => {
          console.error(err);
          return res.status(500).json({ code: 500, message: "Failed to upload photo" });
        });

        stream.on("finish", async () => {
          photoURL = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

          // Data anak
          const newChild = {
            name,
            dateOfBirth,
            gender,
            weight,
            height,
            bloodType,
            fatherHeight,
            motherHeight,
            photoURL,
            allergies: allergies || [],
          };

          // Simpan ke subkoleksi `children` dalam dokumen `userId`
          const childRef = await db
            .collection("users")
            .doc(userId)
            .collection("children")
            .add(newChild);

          res.status(201).json({
            code: 201,
            message: "Child data added successfully",
          });
        });

        stream.end(file.buffer);
      } else {
        // Jika foto tidak ada, simpan data tanpa foto
        const newChild = {
          name,
          dateOfBirth,
          gender,
          weight,
          height,
          bloodType,
          fatherHeight,
          motherHeight,
          photoURL: null,
          allergies: allergies || [],
        };

        // Simpan ke subkoleksi `children` dalam dokumen `userId`
        const childRef = await db
          .collection("users")
          .doc(userId)
          .collection("children")
          .add(newChild);

        res.status(201).json({
          code: 201,
          message: "Child data added successfully without photo",
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to add child data" });
    }
  },
];

const getChildren = [
  verifyToken,
  async (req, res) => {
    const { userId } = req.params;

    try {
      const childrenSnapshot = await db
        .collection("users")
        .doc(userId)
        .collection("children")
        .get();

      if (childrenSnapshot.empty) {
        return res
          .status(404)
          .json({ code: 404, message: "No children found for this user" });
      }

      const childrenData = childrenSnapshot.docs.map((doc) => {
        const data = doc.data();

        // Pastikan allergies diformat sebagai array objek JSON
        let formattedAllergies = [];
        try {
          formattedAllergies =
            typeof data.allergies === "string"
              ? JSON.parse(`[${data.allergies}]`)
              : data.allergies || [];
        } catch (err) {
          console.error("Error parsing allergies:", err);
        }

        return {
          id: doc.id,
          ...data,
          allergies: formattedAllergies, // Gunakan hasil yang diformat ulang
        };
      });

      res.status(200).json({ code: 200, data: childrenData });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        code: 500,
        message: "Failed to fetch children data, Internal server error",
      });
    }
  },
];

module.exports = { addChildren, getChildren };
