const express = require("express");
const app = express();
const session = require("express-session");
const exphbs = require("express-handlebars");

const static = express.static(__dirname + "/public");
const configRoutes = require("./routes");

app.use("/public", static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(
  session({
    name: "AuthCookie",
    secret: "some secret string!",
    resave: false,
    saveUninitialized: true,
  })
);

app.use("*", async (req, res, next) => {
  console.log(
    `[${new Date().toUTCString()}]: ${req.method} ${req.originalUrl} (${
      req.session.user ? "Authenticated User" : "Non-Authenticated User"
    })`
  );
  next();
});

// app.use("/private", async (req, res, next) => {
//   if (!req.session.user) {
//     return res.status(403).json({ message: "no user" });
//   } else {
//     next();
//   }
// });

// app.use("/login", async (req, res, next) => {
//   if (!req.session.user) {
//     next();
//   } else {
//     return res.redirect("/private");
//   }
// });

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
