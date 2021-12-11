const cookieParser = require("cookie-parser");
const express = require("express");
const sessions = require("express-session");
const path = require("path");

const app = express();
const PORT = 3001;

// parsing the incoming data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//serving public file
app.use("/public", express.static("views"));
app.use("/public", express.static(path.join(__dirname, "public")));

app.use(cookieParser());

const oneMinute = 1000 * 60;

app.use(
  sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: true,
    cookie: { maxAge: oneMinute },
    resave: false,
  })
);

// Account Dummy
const myusername = "user1";
const mypassword = "mypassword";

// Variable Store Session
let session;

app.get("/", (req, res) => {
  session = req.session;
  console.log("tes", session.userid);
  if (session.userid) {
    res.send(`Welcome ${myusername} <a href='/logout'>click to logout</a>`);
  } else res.sendFile("/views/index.html", { root: __dirname });
});

app.post("/user", (req, res) => {
  if (req.body.username == myusername && req.body.password == mypassword) {
    session = req.session;
    session.userid = req.body.username;
    console.log(req.session);
    res.send(`Hey ${myusername}, welcome <a href=\'/logout'>click to logout</a>`);
  } else {
    res.send("Invalid username or password");
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log("server connected at port", PORT);
});
