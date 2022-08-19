const userRoutes = require("./api/user.routes.js");
const componentRoutes = require("./component.routes.js");
const appRoutes = require("./app.routes.js");
const messageRoutes = require("./api/conversations.routes");

const constructorMethod = (app) => {
  app.use("/api/user", userRoutes);
  app.use("/api/conversation", messageRoutes);
  app.use("/load", componentRoutes);
  app.use("/", appRoutes);

  app.use("*", (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = constructorMethod;
