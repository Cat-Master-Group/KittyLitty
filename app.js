const ARGS = process.argv.slice(2);
const DEV_ENV = ARGS.includes("-dev");
const DISABLE_LOGIN = ARGS.includes("-nologin");
const PORT = 3000;

const express = require("express");
const app = express();
const session = require("express-session");
const exphbs = require("express-handlebars");

const static = express.static(__dirname + "/public");
const configRoutes = require("./routes");
const chalk = require("chalk");

app.use("/public", static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", exphbs.engine({ defaultLayout: "frame" }));
app.set("view engine", "handlebars");

const dateColor = chalk.rgb(253, 237, 173).italic;
const methodColor = chalk.rgb(239, 91, 37);
const urlColor = chalk.rgb(255, 159, 243).bold;
const authColor = chalk.rgb(123, 237, 159);
const nonAuthColor = chalk.rgb(255, 71, 87);
const portColor = chalk.rgb(0, 181, 226).underline;
const accounceColor = chalk.rgb(0, 0, 128);

app.use(
  session({
    name: "AuthCookie",
    secret: "some secret string!",
    resave: false,
    saveUninitialized: true,
  })
);

//Middleware
app.use("*", async (req, res, next) => {
  if (DEV_ENV) {
    //req.session.user = { _id: "63019a61252ad06186ae0138" };
  }

  console.log(
    `[${dateColor(`${new Date().toUTCString()}`)}]: 
    ${methodColor(req.method)} 
    ${urlColor(req.originalUrl)} 
    (${req.session.user
      ? authColor(`Authenticated User`)
      : nonAuthColor("Non-Authenticated User")
    })`
  );
  next();
});

app.use("/load", (req, res, next) => {
  if (
    req.session.user ||
    req.path == "/signin" ||
    req.path == "/signup" ||
    DISABLE_LOGIN
  ) {
    next();
  } else {
    res.render("error", {
      ajax: req.query.ajax,
      layout: "component",
      componentname: "error",
      errorMessage: "401 Unauthorized: User is not logged in",
    });
  }
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

app.listen(PORT, () => {
  console.log(accounceColor("We've now got a server!"));
  console.log(
    `Your routes will be running on ${portColor(`http://localhost:${PORT}`)}`
  );
});
