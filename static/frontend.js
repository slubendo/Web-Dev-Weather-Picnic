
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

  let image_link = `https://openweathermap.org/img/wn/${icon}.png`;

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

let mySession;

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

    //// AJAX CODE WAS DELETED HERE AND IS NOW MISSING

  } else if (event.target.classList.contains('login')) {

    //// AJAX CODE WAS DELETED HERE AND IS NOW MISSING

  }
})

document.querySelector('button.logout').addEventListener('click', event => {
  event.preventDefault();

  //// AJAX CODE WAS DELETED HERE AND IS NOW MISSING


})

function refreshVotes() {

  //// AJAX CODE WAS DELETED HERE AND IS NOW MISSING

}


function placeVote(date, vote) {

  //// AJAX CODE WAS DELETED HERE AND IS NOW MISSING

}

document.querySelector('main').addEventListener('click', (event) => {

  if (event.target.tagName === 'button'.toUpperCase() && event.target.classList.contains('vote')) {
    let date = event.target.closest('.card').dataset.date;
    let vote = event.target.dataset.vote || null;
    // console.log({ date, vote })
    placeVote(date, vote)
  }
})




//// CODE WAS ALSO DELETED HERE, OUTSIDE OF OTHER FUNCTIONS













//// ACTUALLY USEFUL
refreshVotes();