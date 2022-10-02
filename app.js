const config = require("config");
const port = config.get("app.port");
const express = require("express");
const app = express();

app.use(express.json());

app.use(require('./routes'));

// handling all other routes
app.all("*", (req, res,next) => {
    var err = new Error('Not Found');
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
