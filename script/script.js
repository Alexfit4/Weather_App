// API Key used for open weather
var apiKey = "4464393d7bcb567442cbd649e97679ad";
var searchKey = "";
var currentDate = dayjs().format("DD/MM/YYYY");
var url = "https://api.openweathermap.org/data/2.5/forecast?";

$(document).ready(function () {
	// Fucntion calling the five day forecast //
	function getFiveDay(long, lat) {
		var fiveQuery =
			"https://api.openweathermap.org/data/2.5/onecall?lat=" +
			lat +
			"&lon=" +
			long +
			"&units=imperial&appid=" +
			apiKey;
		$.ajax({
			url: fiveQuery, //API Call
			dataType: "json",
			type: "GET",
			success: function (data) {
				$(".fiveDay").empty();
				for (var i = 1; i < 6; i++) {
					// Set five day forecast variables
					var dayDiv = $(
						"<div class='col-2 bg-primary text-white ml-3 mb-3 rounded'></div>"
					);
					var day = dayjs().date();
					var adjDay = day + i;
					var month = dayjs().format("MM");
					var year = dayjs().format("YYYY");
					var dayDisp = $("<p>" + month + "/" + adjDay + "/" + year + "</p>");
					var maxTemp = $("<p>High: " + data.daily[i].temp.max + "\u2109</p>");
					var minTemp = $("<p>Low: " + data.daily[i].temp.min + "\u2109</p>");
					var dayHumid = $("<p>Humidity: " + data.daily[i].humidity + "%</p>");
					var dayImg = $(
						'<img src="https://openweathermap.org/img/wn/' +
							data.daily[i].weather[0].icon +
							'@2x.png" alt="weather icon">'
					);

					//Appended all the info to the faveDay class //

					$(".fiveDay").append(dayDiv);
					dayDiv.append(dayDisp, dayImg, maxTemp, minTemp, dayHumid);
				}
			},
		});
	}

	// Calling the UV index function //
	function getUV(long, lat) {
		// UV Index URL
		var uvQuery =
			"https://api.openweathermap.org/data/2.5/uvi?lat=" +
			lat +
			"&lon=" +
			long +
			"&appid=" +
			apiKey;

		// Call UV Index API
		$.ajax({
			url: uvQuery,
			method: "GET",
		}).then(function (data) {
			var currentUV = $("<h2>UV Index: </h2>");
			var uvIndex = $("<span>" + data.value + "</span>");
			$(currentUV).append(uvIndex);
			// Assign UV color coding class based on EPA guidelines
			if (data.value < 3) {
				$(uvIndex).addClass("low");
			} else if (data.value >= 3 && data.value < 6) {
				$(uvIndex).addClass("moderate");
			} else if (data.value >= 6 && data.value < 8) {
				$(uvIndex).addClass("high");
			} else if (data.value >= 8 && data.value < 11) {
				$(uvIndex).addClass("veryHigh");
			} else {
				$(uvIndex).addClass("extreme");
			}
			// Send UV info to display div
			$("#newUV").html(currentUV);
		});
	}

	// Function calling the cities that were searched into a list under nearth the search bar, also setting local storage and being able to clear local storage //
	function displayCities() {
		$("ol").empty();
		var currentCities;
		if (localStorage.getItem("cities")) {
			currentCities = JSON.parse(localStorage.getItem("cities"));
			console.log(currentCities);
			for (let i = 0; i < currentCities.length; i++) {
				$("ol").append(
					"<li>" +
						"<button class='oldForecast btn  mb-3 btn-outline-secondary' type='button'>" +
						currentCities[i] +
						"<i class='other fas fa-search'></i>" +
						"</button>" +
						"</li>"
				);
			}

			// Allows user to click on previous searched weather inputs from the list and show in the output field
			$(".oldForecast").click((e) => {
				console.log("clicked");
				getOldWeather($(e.target).text());
			});

			getRecentWeather(currentCities);
		}
	}

	// Function allowing user to click on the old cities searched and showing there results again on the out put container //
	function getOldWeather(city) {
		$.ajax({
			type: "GET",
			url:
				"https://api.openweathermap.org/data/2.5/weather?q=" +
				city +
				"&appid=" +
				apiKey,
			data: {
				units: "metric",
			},

			dataType: "jsonp",
			success: function weatherData(data) {
				var results = outputdata(data);
				$("#outputData").html(results);
				$("#outputData").val("");
				// Longitude
				var long = data.coord.lon;
				// Latitude
				var lat = data.coord.lat;
				getUV(long, lat);
				getFiveDay(long, lat);
			},
		});
	}

	// TFunction calling the last city entered and showing it to the output field
	function getRecentWeather(citiesArray) {
		var recent = citiesArray[citiesArray.length - 1];
		$.ajax({
			type: "GET",
			url:
				"https://api.openweathermap.org/data/2.5/weather?q=" +
				recent +
				"&appid=" +
				apiKey,
			data: {
				units: "metric",
			},

			dataType: "jsonp",
			success: function weatherData(data) {
				var results = outputdata(data);
				$("#outputData").html(results);
				$("#outputData").val("");
				// Longitude
				var long = data.coord.lon;
				// Latitude
				var lat = data.coord.lat;
				getUV(long, lat);
				getFiveDay(long, lat);
			},
		});
	}

	displayCities();

	// This is the main function when search button is clicked all the values with show on the main content, also forcing the user to input a valid city or zip code //

	$("#submit").click(function (e) {
		e.preventDefault();

		var location = $("#location").val();
		while (location == "" || location === currentCities) {
			alert("Please enter a valid city");
			return getCurrentWeather();
		}
		if (localStorage.getItem("cities")) {
			var cities = JSON.parse(localStorage.getItem("cities"));
			var currentCities = cities.filter((city) => city === location);

			if (currentCities.length === 0) {
				cities.push(location);
				localStorage.setItem("cities", JSON.stringify(cities));
			}
		} else {
			localStorage.setItem("cities", JSON.stringify([location]));
		}

		// Check if zip code or city
		$("#location").val("");

		if (!isNaN(location)) {
			searchKey = "zip";
		} else {
			searchKey = "q";
		}

		// Check if text area had data
		if (location.length > 2 || location !== "") {
			getCurrentWeather();
		}

		// Function showing the current weather
		function getCurrentWeather(data) {
			$.ajax({
				type: "GET",
				url:
					"https://api.openweathermap.org/data/2.5/weather?" +
					searchKey +
					"=" +
					location +
					"&appid=" +
					apiKey,
				data: {
					units: "metric",
				},

				dataType: "jsonp",
				success: function weatherData(data) {
					var results = outputdata(data);
					$("#outputData").html(results);
					$("#outputData").val("");
					// Longitude
					var long = data.coord.lon;
					// Latitude
					var lat = data.coord.lat;
					getUV(long, lat);
					getFiveDay(long, lat);
					displayCities();
				},
			});
		}
	});

	// When the clear button is clicked all the info is erassed off the local storage and html//
	$("#clear-history").click(function (e) {
		localStorage.setItem("cities", []);
		displayCities();
		location.reload();
	});

	// Showing the output data //
	function outputdata(data) {
		var date = new Date();
		// Return the HTML string of all the desired data
		return (
			"<div><h2>Weather in " +
			data.name +
			"(" +
			currentDate +
			")" +
			"</h2>" +
			"<img src='https://openweathermap.org/img/w/" +
			data.weather[0].icon +
			".png' width=100px>" +
			"<br>" +
			"<h3> Tempature: " +
			data.main.temp +
			"°C" +
			" <br>" +
			"Pressure: " +
			data.main.pressure +
			"hPa <br> " +
			"Humidity: " +
			data.main.humidity +
			"%<br> " +
			"Wind Speed: " +
			data.wind.speed +
			" m/sec <br>" +
			"Wind Direction: " +
			data.wind.deg +
			" degree </h3></div>"
		);
	}
});
