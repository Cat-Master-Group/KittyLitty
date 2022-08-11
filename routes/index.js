const userRoutes = require("./user.routes.js");
const constructorMethod = (app) => {
  app.use("/api/user", userRoutes);

  app.use("*", (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = constructorMethod;
