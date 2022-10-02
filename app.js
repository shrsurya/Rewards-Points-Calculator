const config = require("config");
const port = config.get("app.port");
const express = require("express");
const app = express();
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

app.use(express.json());

app.use(require("./routes"));
/**Documentation route */
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "CapitalOne Rewards Calculator API",
      version: "1.0.0",
      description: "API for CapitalOne Rewards Calculator",
    },
  },
  apis: ["./routes/api/*.js"],
};

const spec = swaggerJsDoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(spec));

// handling all other routes
app.all("*", (req, res, next) => {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    errors: {
      message: err.message,
      error: {},
    },
  });
});

app.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});
