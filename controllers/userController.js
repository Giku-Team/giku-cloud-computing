const db = require("../config/firebase");
const { verifyToken } = require("../middleware/AuthToken");

const getUser = [
  verifyToken,
  async (req, res) => {
    console.log(req.params);
    const { userId } = req.params;

    try {
      const userSnapshot = await db.collection("users").doc(userId).get();

      console.log(userSnapshot._fieldsProto);

      if (!userSnapshot._fieldsProto) {
        return res
          .status(404)
          .json({ code: 404, message: "No user found for this id" });
      }

      const userData = userSnapshot.data();

      // Remove sensitive fields
      const {
        password,
        isVerifiedForResetExpire,
        isVerifiedForReset,
        ...filteredUserData
      } = userData;

      res.status(200).json({ code: 200, data: filteredUserData });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        code: 500,
        message: "Failed to fetch children data, Internal server error",
      });
    }
  },
];

module.exports = { getUser };
