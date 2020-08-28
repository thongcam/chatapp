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
    //vì add database thẳng vào heroku app nên chỉ cần dùng process.env.DATABASE_URL
    connectionString: process.env.DATABASE_URL,
    //encrypted connection
    ssl: true,
  },
});

//set up cors vì tên miền heroku app và tên miền client k giống nhau (k cần làm bước này)

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

//khi connect vào trang gửi tin nhắn
app.get("/", (req, res) => {
  if (!req.cookies.user) {
    res.json("Failed");
  } else {
    //chọn tất cả từ table messages sắp xếp theo thời gian
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

//chọn người chơi
app.post("/choose", (req, res) => {
  if (req.body.player) {
    //tạo cookie
    res
      .cookie(
        //cookie tên user, là obj gồm playercode và player (name)
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

//logout
app.get("/logout", (req, res) => {
  cookie = req.cookies;
  //xóa cookie
  for (var prop in cookie) {
    if (!cookie.hasOwnProperty(prop)) {
      continue;
    }
    res.cookie(prop, "", { expires: new Date(0) });
  }
  //redirect về trang chọn
  res.redirect("https://thongcam.github.io/chatapp/Players/index.html");
});

const io = socket(server);

io.on("connection", (socket) => {
  socket.on("chat", (data) => {
    //insert tin nhắn vào db
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
