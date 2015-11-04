'use strict';

var apiUrl = 'http://api.wunderground.com/api/196ab87c421083e2/';
var currZip = '90621';
var weatherData = {};

$(document).ready(init);

function init() {
	getLocation();
	getWeather(refreshPane);
	$('.refresh').click(function(){
		getWeather(refreshPane);
	});
	$('#changeloc').click(changeLocation);
}

//gets current location off of user's ip addr
//returns user's nearest weather station zip code
//otherwise, default
function getLocation() {
	var url = apiUrl + 'geolookup/q/autoip.json';

	$.get(url)
	.done(function(data){
		//console.log(data);
		currZip = data.location.l.match(/\d\d\d\d\d/)[0];
		return currZip;
	})
	.fail(function(data){
		console.log(data);
		console.log('Server not available. Resorting to default.');
		return currZip;
	});
}

function getWeather(refreshCb) {
	var url = apiUrl + 'conditions/q/' + currZip + '.json';

	$.get(url)
	.done(function(data){
		weatherData = data;
		refreshCb();
	})
	.fail(function(data){
		console.log(data);
		console.log('Server not available.');
	});
}

function refreshPane() {
	//weatherData
	var $div = $('<div>');
	var $p1 = $('<p>').text(weatherData.current_observation.display_location.full);
	var $img = $('<img>').attr('src',weatherData.current_observation.icon_url);
	var $p2 = $('<p>').text(weatherData.current_observation.weather);
	var $p3 = $('<p>').text(weatherData.current_observation.temp_f + 'F / ' + weatherData.current_observation.temp_c + 'C');
	var $p4 = $('<p>').text('Feels like: ' +weatherData.current_observation.feelslike_string);
	var $p5 = $('<p>').text('Humidity: ' + weatherData.current_observation.relative_humidity);
	var $p6 = $('<p>').text('Wind: ' +weatherData.current_observation.wind_string);
	var $p7 = $('<p>').text(weatherData.current_observation.observation_time);
	$div.append($p1,$img,$p2,$p3,$p4,$p5,$p6,$p7);

	$('.pane > div').empty().append($div);
}

function changeLocation(zip) {
	currZip = zip;
	getLocation();
	getWeather(refreshPane);
}
