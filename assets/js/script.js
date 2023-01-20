//VARIABLE DECLARATIONS

var fieldInput = document.getElementById("city-input");

var searchBtn = document.getElementById("search-button");

var todayForecast = document.getElementById("current-forecast");

// https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}

//api key = f18a21a46c14735a21d43be4f3afb792

var weatherApi = "https://api.openweathermap.org/data/2.5/forecast?";

var apiKey = "f18a21a46c14735a21d43be4f3afb792";

//FUNCTIONS

//responsible for getting the lat and lon for the city passed

function grabCoordinates(city) {
  var rootEndpoint = "https://api.openweathermap.org/geo/1.0/direct";

  var apiCall = rootEndpoint + "?q=" + city + "&appid=" + apiKey;

  //this will make the call to get the coordinates for that city

  fetch(apiCall)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var lat = data[0].lat;
      var lon = data[0].lon;
      grabWeather(lat, lon);
    });
}

//responsible for making api call with the user search term

function grabWeather(lat, lon) {
  var apiCall =
    weatherApi +
    "lat=" +
    lat +
    "&lon=" +
    lon +
    "&units=imperial&" +
    "appid=f18a21a46c14735a21d43be4f3afb792";

  fetch(apiCall)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // console.log(data);
      showDayForecast(data);
    });
}
//responsible for showing the current day forecast

function showDayForecast(data) {
  todayForecast.textContent = "";
  // console.log(data);
  // console.log(data.city.name);
  // console.log(data.list);
  // console.log(data.list[0].dt_txt);
  // console.log(data.list[0].wind.speed);
  // console.log(data.list[0].main.humidity);
  var weatherIcon = `https://openweathermap.org/img/wn/${data.list[0].weather[0]["icon"]}.png`;

  var h1Name = document.createElement("h1");
  var h1Date = document.createElement("h1");
  var h1Temp = document.createElement("h1");
  var h1Wind = document.createElement("h1");
  var h1Humidity = document.createElement("h1");
  var img = document.createElement("img");

  h1Name.textContent = data.city.name;
  todayForecast.append(h1Name);

  img.src = weatherIcon;
  todayForecast.append(img);

  h1Date.textContent = data.list[0].dt_txt;
  todayForecast.append(h1Date);

  h1Temp.textContent = data.list[0].main.temp;
  todayForecast.append(h1Temp);

  h1Wind.textContent = data.list[0].wind.speed;
  todayForecast.append(h1Wind);

  h1Humidity.textContent = data.list[0].main.humidity;
  todayForecast.append(h1Humidity);

  show5Day(data);
}

//responsible for showing the 5 day forecast

function show5Day(data) {
  console.log(data);
  for (let i = 1; i < data.list.length; i += 8) {
    console.log(data.list[i]);
    var img = document.createElement("img");
    var date = document.getElementById(`date${i}`);
    var icon = document.getElementById(`icon${i}`);
    var temp = document.getElementById(`temp${i}`);
    var wind = document.getElementById(`wind${i}`);
    var humidity = document.getElementById(`humidity${i}`);
    date.textContent = data.list[i].dt_txt;
    console.log(date);
    temp.textContent = `Temperature(F): ${data.list[i].main.temp}`;
    console.log(temp);
    wind.textContent = `Wind Speed(MPH): ${data.list[i].wind.speed}`;
    console.log(wind);
    humidity.textContent = `Humidity: ${data.list[i].main.humidity}`;
    console.log(humidity);
  }
}

//responsible for form submission by capturing user input

function runSearch(e) {
  e.preventDefault();
  var field = fieldInput.value;

  //make an api call with that search term and confirm data is sent back

  grabCoordinates(field);
  storageSet(field);
  // console.log("test");
}
function pastCity(e) {
  e.preventDefault();
  var field = this.textContent;
  grabCoordinates(field);

  //make an api call with that search term and confirm data is sent back
}
//LOCAL STORAGE

var recentCity = [];

function storageSet(city) {
  console.log(city);
  recentCity.push(city);
  localStorage.setItem("city", JSON.stringify(recentCity));
  createButtons(recentCity);
}
function storageGet() {
  localStorage.getItem("city");
}

var recent = document.getElementById("recentBtnContainer");

function createButtons(recentCity) {
  recent.textContent = "";
  for (let i = 0; i < recentCity.length; i++) {
    var storageButton = document.createElement("button");
    storageButton.textContent = recentCity[i];
    recent.appendChild(storageButton);
    storageButton.addEventListener("click", pastCity);
  }
}

//EVENT LISTENERS

searchBtn.addEventListener("click", runSearch);
