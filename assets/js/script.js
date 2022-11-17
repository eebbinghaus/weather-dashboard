// Global Variables

var userInput = document.getElementById("user-input");
var userForm = document.getElementById("form-sbt");
var currentForecast = document.getElementById("current-forecast");
var apiKey = "e757412b6a4d63da3a66b29d23f46628";
var cityCurrent = document.getElementById("cityCurrent");
var tempCurrent = document.getElementById("tempCurrent");
var windCurrent = document.getElementById("windCurrent");
var humidityCurrent = document.getElementById("humidityCurrent");
var emojiCurrent = document.getElementById("emojiCurrent");
var recent = document.getElementById("recent");
var forecastFive = document.getElementById("fiveDay");

// Functions

//Function to pull data from Local Storage

function pullFromLocal() {
  var data = localStorage.getItem("cities") || "[]";
  var localCities = JSON.parse(data);
  // console.log(localCities);

  if (localCities.length == 0) {
    fetchCoordinates("Denver");
  } else {
    savedRecentArr = localCities;
    for (var i = 0; i < localCities.length; i++) {
      var cities = localCities[i];
      var recentButton = document.createElement("button");
      recentButton.type = "button";
      recentButton.innerHTML = cities;
      recentButton.value = cities;
      recentButton.class = "preSet btn btn-dark mb-2";
      recentButton.style =
        "width: 100%; color: lightBlue; background-color: #282828; margin-bottom: 8px; padding: 7px; border-radius: 8px; border: 3px solid lightBlue;";
      recent.appendChild(recentButton);
      mostRecent = localCities[localCities.length - 1];
      fetchCoordinates(mostRecent);
      console.log(mostRecent);
      recentButton.onclick = function () {
        fetchCoordinates(this.value);
        console.log($(this).value);
      };
    }
  }
}

//Calls API with city name and returns Lat & Lon

function fetchCoordinates(input) {
  var apiCall =
    "https://api.openweathermap.org/geo/1.0/direct?q=" +
    input +
    "&appid=e757412b6a4d63da3a66b29d23f46628";

  fetch(apiCall)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // console.log(data);
      var lat = data[0].lat;
      var lon = data[0].lon;
      var city = data[0].name;
      // console.log(lat);
      // console.log(lon);
      // console.log(city);

      fetchWeather(lat, lon);
      fiveDay(lat, lon);

      //Gets todays date and formats the date

      var date = new Date();
      var day = date.getDate();
      // console.log(date);
      var month = date.getMonth() + 1;
      var year = date.getFullYear();

      var fullDate = "(" + month + "/" + day + "/" + year + ")";
      // console.log(fullDate);

      cityCurrent.textContent = city + " " + fullDate;

      var futureDates = [];

      for (var i = 1; i < 6; i++) {
        var newDate = "(" + month + "/" + (day + i) + "/" + year + ")";
        futureDates.push(newDate);
        // console.log(futureDates);
      }

      //Writes the date to the 5-Day Forecast section in HTML

      function setDates() {
        var i = 0;
        $(forecastFive)
          .children("div")
          .children("div")
          .children("div")
          .children("h5")
          .each(function () {
            $(this).text(futureDates[i]);
            i++;
          });
      }
      setDates();
    });
}

//Calls 2nd API and returns  Current weather data using lat & lon

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
      // console.log(data);
      var temp = Math.round(data.current.temp);
      var wind = Math.round(data.current.wind_speed);
      var humidity = data.current.humidity;
      var emoji = data.current.weather[0].icon;

      $("#emojiCurrent").attr(
        "src",
        "https://openweathermap.org/img/wn/" + emoji + ".png"
      );

      tempCurrent.textContent = "Temp: " + temp + "°F";

      windCurrent.textContent = "Wind Speed: " + wind + " MPH";

      humidityCurrent.textContent = "Humidity: " + humidity + "%";
    });
}

//Calls 3rd API and returns 5-Day Forecast Weather Data

function fiveDay(lat, lon) {
  var fiveDayForecast =
    "https://api.openweathermap.org/data/2.5/forecast?lat=" +
    lat +
    "&lon=" +
    lon +
    "&units=imperial" +
    "&appid=e757412b6a4d63da3a66b29d23f46628";

  fetch(fiveDayForecast)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // console.log(data);
      var returnedList = data.list;
      var fiveDayArray = [];
      // console.log(returnedList.length);
      for (var i = 0; i < returnedList.length; i++) {
        dayOfList = returnedList[i].dt_txt.split("-")[2].split(" ")[0];
        var date = new Date();

        if (date.getDate() != dayOfList && date.getDate() + 6 != dayOfList) {
          if (fiveDayArray.includes(dayOfList)) {
          } else {
            // console.log(returnedList[i]);
            // console.log(dayOfList);
            fiveDayArray.push(dayOfList);
            // console.log(fiveDayArray);

            // console.log(returnedList[i].weather[0].icon);
            // console.log(returnedList[i].dt_txt.split(" ")[0]);
            // console.log(returnedList[i].main.temp_max);
            // console.log(returnedList[i].wind.speed);
            // console.log(returnedList[i].main.humidity);
          }
        }
      }

      var j = 0;
      $(forecastFive)
        .children("div")
        .children("div")
        .each(function () {
          //this = 64       65
          // console.log($(this));
          $(this)
            .children("div")
            .children()
            .eq(1)
            .attr(
              "src",
              "https://openweathermap.org/img/wn/" +
                returnedList[j].weather[0].icon +
                ".png"
            );
          $(this)
            .children("div")
            .children()
            .eq(2)
            .text("Temp: " + Math.round(returnedList[j].main.temp_max) + "°F");
          $(this)
            .children("div")
            .children()
            .eq(3)
            .text(
              "Wind Speed: " + Math.round(returnedList[j].wind.speed) + " MPH"
            );
          $(this)
            .children("div")
            .children()
            .eq(4)
            .text("Humidity: " + returnedList[j].main.humidity + "%");
          j++;
        });
    });
}

//Saves items into local Storage

var savedRecentArr = [];

function handleFormSubmit(e) {
  e.preventDefault();
  var input = userInput.value;
  userInput.value = "";

  savedRecentArr.push(input);
  console.log(savedRecentArr);
  localStorage.setItem("cities", JSON.stringify(savedRecentArr));

  fetchCoordinates(input);

  var recentButton = document.createElement("button");
  recentButton.type = "button";
  recentButton.innerHTML = input.charAt(0).toUpperCase() + input.slice(1);
  recentButton.value = input;
  recentButton.class = "preSet btn btn-dark mb-2";
  recentButton.style =
    "width: 100%; color: lightBlue; background-color: #282828; margin-bottom: 8px; padding: 7px; border-radius: 8px; border: 3px solid lightBlue;";

  recentButton.onclick = function () {
    fetchCoordinates(recentButton.value);
  };
  recent.appendChild(recentButton);
}

//Disables search button until user fills search input

function manage(txt) {
  if ($("user-input").value == "") {
    $("#subButton").attr("disabled", "disabled");
  } else {
    $("#subButton").removeAttr("disabled");
  }
}

pullFromLocal();

// Event Handlers

userForm.addEventListener("submit", handleFormSubmit);
