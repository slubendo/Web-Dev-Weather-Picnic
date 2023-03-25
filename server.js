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




app.listen(PORT, () => console.log(`server should be running at http://localhost:${PORT}/`))