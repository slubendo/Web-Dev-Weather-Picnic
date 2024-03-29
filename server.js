require('dotenv').config()

const express = require("express");
const bodyParser = require("body-parser")
const cookieSession = require("cookie-session");
const luxon = require('luxon');

const app = express();

const PORT = 8000;

app.use(express.static("static"))


app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieSession({ name: 'session', keys: ['asdfasdbvaghjdfghaga'] }))


let db = require('./pass_db.js');



function nextDate(prevDate, i = 1) {
  return luxon.DateTime.fromISO(prevDate).plus({ days: i }).toISO().slice(0, 10)
}




app.get('/', (req, res) => {
  res.render('index')
})


let api = express.Router();
app.use('/api/v1', api);

api.get("/secrets", (req, res) => {
  res.send(`
    const NUMBER_OF_DAYS_IN_PLAN = ${process.env.NUMBER_OF_DAYS_IN_PLAN};
    const OPEN_WEATHER_API_KEY = "${process.env.OPEN_WEATHER_API_KEY}";
    const BCIT_LAT = ${process.env.BCIT_LAT};
    const BCIT_LON = ${process.env.BCIT_LON};
  `);
})

app.post("/login", (req, res) => {
  const username = req.body.username
  const password = req.body.password
  let isLoggedIn = false
  if (db.authenticateUser(username, password)) {
    req.session.username = username;
    isLoggedIn = true;
    res.status(200).json({username: username, isLoggedIn: isLoggedIn})
  } else {
    res.status(400).json({})
  }
  console.log(req.headers)
});


app.post("/logout", (req, res) => {
  req.session = null
  res.status(200).json({})
})

app.post("/signup", (req, res) => {
  // Req.body
  const username = req.body.username
  const password = req.body.password
  let isLoggedIn = false
  if (!db.isUsernameTaken(username)) {
    if (db.createUser(username, password)) {
      req.session.username = username;
      isLoggedIn = true;
      res.status(200).json({ username: username, isLoggedIn: isLoggedIn })
    }
  } else {
    res.status(400).json({})
  }
})

app.post("/view", (req, res) => {
  const date = req.body.date;
  let dateVotes = [];
  for (let i = 5; i < 9 + date; i++) {
    let viewVotes = db.getVotesForDate(`2022-04-0${i}`)
      dateVotes.push(viewVotes)   
  }
  res.status(200).json({ viewVotes: dateVotes})
})


app.get("/session", (req, res) => {
  res.status(200).json({ session: req.session.username })
})


app.listen(PORT, () => console.log(`server should be running at http://localhost:${PORT}/`))