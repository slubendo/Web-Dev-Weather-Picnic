function createCard(date) {
  let card = document.createElement('div');
  card.innerHTML = `
    <div class="cardtop">
      <div class="date">
        <div class="dow">${date.toLocaleString({ weekday: 'long' })}</div>
        <div class="dom">${date.toLocaleString({ month: 'short', day: 'numeric' })}</div>
      </div>
      <div class="weather">
        <div class="temp">
          ?
        </div>
        <div class="weath">
          <img>
        </div>
      </div>
    </div>
    <div class="vote">
      Can you attend?
      <div>
        <button class="vote yes" data-vote="yes">
          Yes ✔️
        </button>
        <button class="vote maybe" data-vote="">
          ??
        </button>
        <button class="vote no" data-vote="no">
          No ❌
        </button>
      </div>
    </div>
    <div class="others">
    </div>
  `
  card.classList.add("card")
  card.dataset.date = date.toISO().slice(0, 10);
  return card;
}

function updateWeather(card, temp, weather, icon) {
  card.querySelector('.weather .temp').innerText = Number(temp).toFixed(0) + " C";
  card.querySelector('.weather .weath img').title = weather;

  let image_link = `https://github.com/visualcrossing/WeatherIcons/blob/main/PNG/1st%20Set%20-%20Color/clear-day.png`;

  card.querySelector('.weather .weath img').src = image_link;
}

function updateWeatherByDate(dt, temp, weather, icon) {
  let card = document.querySelector(`.card[data-date="${dt}"]`);
  if (card) {
    updateWeather(card, temp, weather, icon);
  }
}



function updateOthers(card, others) {
  let othersContainer = card.querySelector(".others");
  othersContainer.innerHTML = '';
  others = others || [];
  for (let { who, vote } of others) {
    let div = document.createElement('div');
    div.classList.add(vote === 'yes' ? 'yes' : 'no');
    div.innerText = who;
    othersContainer.append(div);
  }
}

function updateMyVoting(card, myData) {
  let myVote = myData.length === 0 ? null : myData[0].vote;
  let yesButton = card.querySelector(".vote button.yes");
  let maybeButton = card.querySelector(".vote button.maybe");
  let noButton = card.querySelector(".vote button.no");

  card.querySelectorAll(".vote button").forEach(button => {
    button.classList.remove("quiet");
    button.classList.remove("loud");
  })

  yesButton.classList.add(myVote === "yes" ? "loud" : myVote === "no" ? "quiet" : "meh")
  noButton.classList.add(myVote === "no" ? "loud" : myVote === "yes" ? "quiet" : "meh")
  maybeButton.classList.add(myVote === "no" ? "quiet" : myVote === "yes" ? "quiet" : "meh")

}


let today = luxon.DateTime.now();
let cards = [];
let weekview = document.querySelector('.weekview')
for (let i = 0; i < NUMBER_OF_DAYS_IN_PLAN; i++) {
  card = createCard(today.plus({ days: i }));
  cards.push(card); 
  weekview.append(card)
}


let mySession = null;

let headerForLoggedIn = document.querySelectorAll('.forloggedin')
let headerForLoggedOut = document.querySelectorAll('.forloggedout')
function setMySession(newSession) {
  mySession = newSession;
  if (mySession) {
    headerForLoggedIn.forEach(elt => elt.classList.remove('nodisplay'))
    headerForLoggedOut.forEach(elt => elt.classList.add('nodisplay'))
  } else {
    headerForLoggedIn.forEach(elt => elt.classList.add('nodisplay'))
    headerForLoggedOut.forEach(elt => elt.classList.remove('nodisplay'))
  }
  refreshVotes();
}




document.querySelector('form.forloggedout').addEventListener('click', event => {
  event.preventDefault();
  let username = document.querySelector('input#headerusername').value
  let password = document.querySelector('input#headerpassword').value
  if (event.target.classList.contains('signup')) {

    fetch(`/signup`, { method: "POST", body: JSON.stringify({ username, password }), headers: { "Content-Type": "application/json" } })
      .then(response => response.json())
      .then(body => {
        if(body.isLoggedIn)
        setMySession(body.username)
      })
      .catch(console.log) 

  } else if (event.target.classList.contains('login')) {

    fetch(`/login`, { method: "POST", body: JSON.stringify({ username, password }), headers: { "Content-Type": "application/json" } })
      .then(response => response.json())
      .then(body => { 
        if(body.isLoggedIn)
        setMySession(body.username)
      })
      .catch(console.log)

  }
})

document.querySelector('button.logout').addEventListener('click', event => {
  event.preventDefault();

  fetch(`/logout`, { method: "POST", body: JSON.stringify(), headers: { "Content-Type": "application/json" } })
    .then(response => response.json())
    .then(body => {
      setMySession(null)
    })
    .catch(console.log)

})

function refreshVotes() {

  fetch(`/view`, { method: "POST", body: JSON.stringify({date: 7}), headers: { "Content-Type": "application/json" } })
  .then(response => response.json())
  .then(body => {
    cards = document.querySelectorAll(".card")
    for(i= 0; i < cards.length; i++) {
      let votes = body.viewVotes
      let others = updateOthers(cards[i], votes[i])
    }
    
  })
  .catch(console.log)
}


function placeVote(date, vote) {

  //// AJAX CODE WAS DELETED HERE AND IS NOW MISSING

}

function session() {
  let session = fetch(`/session`, { method: "GET", body: JSON.stringify(), headers: { "Content-Type": "application/json" } })
  .then(response => response.json())
  .then(body => {
    setMySession(!body.session ? null : body.session);
  })
  .catch(console.log)
}

document.querySelector('main').addEventListener('click', (event) => {

  if (event.target.tagName === 'button'.toUpperCase() && event.target.classList.contains('vote')) {
    let date = event.target.closest('.card').dataset.date;
    let vote = event.target.dataset.vote || null;
    // console.log({ date, vote })
    placeVote(date, vote)
  }
})



const getWeather = async () => {

  const lat = BCIT_LAT
  const long = BCIT_LON
  const apiKey = OPEN_WEATHER_API_KEY

  let weatherApi = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/vancouver?unitGroup=us&key=${apiKey}&contentType=json`)
  let weatherBody = await weatherApi.json()
  
  for(i= 0; i <= 7; i++) {
    // console.log(weatherBody.days[i])
    let temp = ((weatherBody.days[i].temp) - 32) * (5/9) 
    let weather = weatherBody.days[i].description
    let icon = weatherBody.days[i].icon
    console.log(temp)
    console.log(weather)
    console.log(icon)
    
    updateWeatherByDate(`2023-04-0${i}`,temp, weather, icon )
    updateWeatherByDate(`2023-04-${i}`,temp, weather, icon )
  }
}   
//// CODE WAS ALSO DELETED HERE, OUTSIDE OF OTHER FUNCTIONS












session();
//// ACTUALLY USEFUL
refreshVotes();
getWeather();