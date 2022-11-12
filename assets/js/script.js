// Global Variables

var userInput = document.getElementById("user-input");
var userForm = document.getElementById("form-sbt");
var currentForecast = document.getElementById("current-forecast");
var apiKey = "3325fbfe11bdb5b671f98630304b064f";

// Functions
function fetchCoordinates(input) {
  var apiCall =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    input +
    "&appid=3325fbfe11bdb5b671f98630304b064f";

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

      var date = new Date();
      var day = date.getDate();
      var month = date.getMonth() + 1;
      var year = date.getFullYear();

      var fullDate = "(" + month + "/" + day + "/" + year + ")";
      console.log(fullDate);

      var mainCity = document.createElement("h2");
      mainCity.textContent = city + " " + fullDate;
      currentForecast.append(mainCity);
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

      var mainEmoji = document.createElement("h5");
      mainEmoji.textContent =
        "http://openweathermap.org/img/wn/" + emoji + ".png";
      currentForecast.append(mainEmoji);

      var mainTemp = document.createElement("h5");
      mainTemp.textContent = "Temp: " + temp + "°F";
      currentForecast.append(mainTemp);

      var mainWind = document.createElement("h5");
      mainWind.textContent = "Wind Speed: " + wind + " MPH";
      currentForecast.append(mainWind);

      var mainHumidity = document.createElement("h5");
      mainHumidity.textContent = "Humidity: " + humidity + "%";
      currentForecast.append(mainHumidity);
    });
}

function handleFormSubmit(e) {
  e.preventDefault();
  var input = userInput.value;
  console.log(input);

  fetchCoordinates(input);
}

// Event Handlers

userForm.addEventListener("submit", handleFormSubmit);
