// API Key used for open weather
var apiKey = "4464393d7bcb567442cbd649e97679ad";
var searchKey = "";
var currentDate = dayjs().format('DD/MM/YYYY')

// var today = new Date();
// var dd = String(today.getDate()).padStart(2, "0");
// var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
// var yyyy = today.getFullYear();

// today = mm + "/" + dd + "/" + yyyy;



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
				dataType: "jsonp",
				success: function (data) {
					var results = outputdata(data);
					$("#outputData").html(results);
					$("#outputData").val("");
					console.log(results);
				},
			});
		}
	});

	function outputdata(data) {
		var date = new Date();
		// Return the HTML string of all the desired data
		return (
			"<div><h2>Weather in " +
			data.name + '(' + currentDate + ')' + 
			"</h2>" +
			"<img src='http://openweathermap.org/img/w/" +
			data.weather[0].icon +
			".png' width=100px>" +
			"<h4> Weather: " +
			data.weather[0].main +
			"<br>" +
			"Tempature: " +
			data.main.temp +
			"F <br>" +
			"High Temp: " +
			data.main.temp_max +
			"F <br> " +
			"Low Temp: " +
			data.main.temp_min +
			"F <br> " +
			"Pressure: " +
			data.main.pressure +
			"hPa <br> " +
			"Humidity: " +
			data.main.humidity +
			"%<br> " +
			"Visibility: " +
			data.main.visibility +
			"meters <br>" +
			"Wind Speed: " +
			data.wind.speed +
			" m/sec <br>" +
			"Wind Direction: " +
			data.wind.deg +
			" degree </hr></div>"
		);
	}

	// $.ajax({
	//     type: "GET",
	//     url:
	//     "http://api.openweathermap.org/data/2.5/weather?" +
	//     searchKey +
	//     "=" +
	//     location +
	//     "&appid=" +
	//     apiKey,
	//     dataType: "jsonp",
	//     success: function (response) {
	//         var results2 = outputdata(data);
	//         $(".output2").html(results2);
	//         $(".output2").val("");
	//         console.log(results);

	//     }
	// });

	// function outputdatatwo(data2) {
	//     return
	//  }
});
