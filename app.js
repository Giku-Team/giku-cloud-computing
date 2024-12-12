const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger/swagger");
const authRoutes = require("./routes/auth");
const childRoutes = require("./routes/children");
const articleRoutes = require("./routes/article");
const userRoutes = require("./routes/user");

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/auth", authRoutes);
app.use("/api", childRoutes);
app.use("/api", articleRoutes);
app.use("/api", userRoutes);


// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
