const express = require("express");
const socket = require("socket.io");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
var session = require("express-session");
const cors = require("cors");
const pg = require("pg");
// const keys = require('./config/keys');

const app = express();

const knex = require("knex")({
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  },
});

var whitelist = [
  "https://chatapp-entropy.herokuapp.com/",
  "https://thongcam.github.io",
];

var options = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(options));
app.use(
  session({
    store: new (require("connect-pg-simple")(session))(),
    secret: "cookie-secret",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.static("public"));

const server = app.listen(process.env.PORT, () => {
  console.log(`Listen to request on port ${process.env.PORT}`);
});

app.get("/", (req, res) => {
  if (!req.cookies.user) {
    res.json("Failed");
  } else {
    knex("messages")
      .select()
      .orderBy("time")
      .then((messages) => {
        res.json({
          messages: messages,
          playercode: req.cookies.user.playercode,
          player: req.cookies.user.player,
        });
      });
  }
});

app.post("/choose", (req, res) => {
  if (req.body.player) {
    res
      .cookie(
        "user",
        { playercode: req.body.playercode, player: req.body.player },
        {
          sameSite: "None",
          secure: true,
        }
      )
      .json("Success");
  }
});

app.get("/logout", (req, res) => {
  cookie = req.cookies;
  for (var prop in cookie) {
    if (!cookie.hasOwnProperty(prop)) {
      continue;
    }
    res.cookie(prop, "", { expires: new Date(0) });
  }
  res.redirect("https://thongcam.github.io/chatapp/Players/index.html");
});

const io = socket(server);

io.on("connection", (socket) => {
  socket.on("chat", (data) => {
    knex("messages")
      .insert({
        text: data.message,
        player: data.player,
        playercode: data.playercode,
        time: new Date().toISOString(),
      })
      .then(io.sockets.emit("chat", data))
      .catch(console.log);
  });
});
