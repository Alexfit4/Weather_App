// API Key used for open weather
var apiKey = "4464393d7bcb567442cbd649e97679ad";
var searchKey = "";
var currentDate = dayjs().format("DD/MM/YYYY");
var url = "http://api.openweathermap.org/data/2.5/forecast?";

// for (var j = 0; j < 5; j++) {
//     var dates = $(".Day" + (j + 1));
//     $(dates).text(dayjs().add(j + 1, 'day').format('M/DD/YYYY'));
// }

$(document).ready(function () {
	$("#submit").click(function (e) {
		e.preventDefault();

		var location = $("#location").val();
		// Check if zip code or city

		if (!isNaN(location)) {
			searchKey = "zip";
		} else {
			searchKey = "q";
		}

		// Check if text area had data
		if (location != "") {
			$.ajax({
				type: "GET",
				url:
					"http://api.openweathermap.org/data/2.5/weather?" +
					searchKey +
					"=" +
					location +
					"&appid=" +
					apiKey,
				data: {
					units: "metric",
				},

				dataType: "jsonp",
				success: function (data) {
					var results = outputdata(data);
					$("#outputData").html(results);
					$("#outputData").val("");
					console.log(results);
				},
			});
		}

		

		$.ajax({
			url: url, //API Call
			dataType: "json",
			type: "GET",
			data: {
				q: location,
				appid: apiKey,
				units: "metric",
				cnt: "5",
			},
			success: function (data) {
				for (var j = 0; j < 5; j++) {
					var dates = $(".Day" + (j + 1));
					$(dates).text(
						dayjs()
							.add(j + 1, "day")
							.format("M/DD/YYYY")
					);
				}
				$.each(
					data.list,
					function (dates, val) {
						$(".col").append("<p>" + data.city.name + "</p>");
						$(".col").append(
							"<p>" +
								"<img src='https://openweathermap.org/img/w/" +
								val.weather[0].icon +
								".png'>" +
								"</p>"
						);
						$(".col").append("<p>" + val.main.temp + "&degC" + "</p>");
						$(".col").append("<p>" + val.weather[0].description + "</p>");
					}

					// var wf = "";
					// wf += "<h2>" + data.city.name + "</h2>"; // City (displays once)
					// $.each(data.list, function (dates, val) {
					// 	wf += "<p>"; // Opening paragraph tag
					// 	wf += val.main.temp + "&degC"; // Temperature
					// 	wf += "<span> | " + val.weather[0].description + "</span>"; // Description
					// 	wf +=
					// 		"<img src='https://openweathermap.org/img/w/" +
					// 		val.weather[0].icon +
					// 		".png'>"; // Icon
					// 	wf += "</p>"; // Closing paragraph tag
					// });
					// $(".output2").html(wf);
				);
			},
		});
	});

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
			"<img src='http://openweathermap.org/img/w/" +
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
