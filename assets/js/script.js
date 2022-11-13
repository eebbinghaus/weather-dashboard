// Global Variables

var userInput = document.getElementById("user-input");
var userForm = document.getElementById("form-sbt");
var currentForecast = document.getElementById("current-forecast");
var preSet = document.getElementsByClassName("preSet");
var apiKey = "e757412b6a4d63da3a66b29d23f46628";
var cityCurrent = document.getElementById("cityCurrent");
var tempCurrent = document.getElementById("tempCurrent");
var windCurrent = document.getElementById("windCurrent");
var humidityCurrent = document.getElementById("humidityCurrent");
var emojiCurrent = document.getElementById("emojiCurrent");
// Functions
function fetchCoordinates(input) {
  var apiCall =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    input +
    "&appid=e757412b6a4d63da3a66b29d23f46628";

  fetch(apiCall)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      var lat = data[0].lat;
      var lon = data[0].lon;
      var city = data[0].name;
      console.log(lat);
      console.log(lon);
      console.log(city);
      fetchWeather(lat, lon);
      fiveDay(lat, lon);

      var date = new Date();
      var day = date.getDate();
      var month = date.getMonth() + 1;
      var year = date.getFullYear();

      var fullDate = "(" + month + "/" + day + "/" + year + ")";
      console.log(fullDate);

      cityCurrent.textContent = city + " " + fullDate;
    });
}

function fetchWeather(lat, lon) {
  var dailyWeather =
    "https://api.openweathermap.org/data/3.0/onecall?lat=" +
    lat +
    "&lon=" +
    lon +
    "&units=imperial" +
    "&appid=" +
    apiKey;

  fetch(dailyWeather)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      var temp = Math.round(data.current.temp);
      var wind = Math.round(data.current.wind_speed);
      var humidity = data.current.humidity;
      var emoji = data.current.weather[0].icon;
      console.log(emoji);

      $("#emojiCurrent").attr(
        "src",
        "http://openweathermap.org/img/wn/" + emoji + ".png"
      );

      tempCurrent.textContent = "Temp: " + temp + "°F";

      windCurrent.textContent = "Wind Speed: " + wind + " MPH";

      humidityCurrent.textContent = "Humidity: " + humidity + "%";
    });
}

function fiveDay(lat, lon) {
  var fiveDayForecast =
    "https://api.openweathermap.org/data/2.5/forecast?lat=" +
    lat +
    "&lon=" +
    lon +
    "&appid=e757412b6a4d63da3a66b29d23f46628";
  console.log(fiveDayForecast);
  fetch(fiveDayForecast)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
    });
}

function handleFormSubmit(e) {
  e.preventDefault();
  var input = userInput.value;
  console.log(input);

  fetchCoordinates(input);
}

function handlePreSetClick(e) {
  var cityPre = this.value;

  console.log(cityPre);

  fetchCoordinates(cityPre);
}

// Event Handlers

userForm.addEventListener("submit", handleFormSubmit);

for (let i = 0; i < preSet.length; i++) {
  preSet[i].addEventListener("click", handlePreSetClick);
}

fetchCoordinates("Denver");
