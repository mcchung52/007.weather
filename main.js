'use strict';

var apiUrl = 'http://api.wunderground.com/api/196ab87c421083e2/';
var currZip = '90621';
var weatherData = {};
var forecastData = {};

$(document).ready(init);

function init() {
	getLocation(true,function(){
		getWeather(refreshPane);
		getForecast(refreshForecastPane);
	});
	
	$('.refresh').click(function(){
		getWeather(refreshPane);
		getForecast(refreshForecastPane);
	});
	$('#changeloc').click(changeLocation);
}

//gets current location off of user's ip addr
//returns user's nearest weather station zip code
//otherwise, default
//refresh=true, also refresh too
function getLocation(refresh,refreshCb) {
	var url = apiUrl + 'geolookup/q/autoip.json';

	$.get(url)
	.done(function(data){
		//console.log(data);
		currZip = data.location.l.match(/\d\d\d\d\d/)[0];
		if (refresh) {
			refreshCb();
		}
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
		console.log('Server not available.');
	});
}

function refreshPane() {
	var wd = weatherData.current_observation;

	var $div = $('<div>');
	var $p1 = $('<p>').text(wd.display_location.full);
	var $img = $('<img>').attr('src',wd.icon_url);
	var $p2 = $('<p>').text(wd.weather);
	var $p3 = $('<p>').text(wd.temp_f + 'F / ' + wd.temp_c + 'C');
	var $p4 = $('<p>').text('Feels like: ' +wd.feelslike_string);
	var $p5 = $('<p>').text('Humidity: ' + wd.relative_humidity);
	var $p6 = $('<p>').text('Wind: ' +wd.wind_string);
	var $p7 = $('<p>').text(wd.observation_time);
	$div.append($p1,$img,$p2,$p3,$p4,$p5,$p6,$p7);

	$('.pane > div').empty().append($div);
}

function changeLocation(e) {
	currZip = $('#zip').val();
	getWeather(refreshPane);
	getForecast(refreshForecastPane);
}

function getForecast(refreshCb) {
	var url = apiUrl + 'forecast/q/' + currZip + '.json';

	$.get(url)
	.done(function(data){
		forecastData = data;
		refreshCb();
	})
	.fail(function(data){
		console.log('Server not available.');
	});
}

function refreshForecastPane() {
	var fc = forecastData.forecast.simpleforecast.forecastday;
	var $outerdiv = $('<div>');
	$(fc).each(function(i,el){
		var $div = $('<div>').addClass('forecast');
		var $p1 = $('<p>').text(el.date.weekday_short);
		var $p2 = $('<p>').text(el.date.month + '/' + el.date.day);	
		var $img = $('<img>').attr('src',el.icon_url);
		var $p3 = $('<p>').text(el.conditions);
		var $p4 = $('<p>').text('High: ' + el.high.fahrenheit + 'F / ' + el.high.celsius + 'C');
		var $p5 = $('<p>').text('Low: ' + el.low.fahrenheit + 'F / ' + el.low.celsius + 'C');
		$div.append($p1,$p2,$img,$p3,$p4,$p5);
		$outerdiv.append($div);
	});
	
	$('.forecastPane').empty().append($outerdiv);
}