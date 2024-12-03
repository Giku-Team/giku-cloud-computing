const swaggerJsdoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Giku App",
    version: "1.0.0",
    description: "API Documentation for Giku App",
  },
  servers: [
    {
      url: "http://localhost:8080",
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./routes/*.js"], // Path to route files
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;
