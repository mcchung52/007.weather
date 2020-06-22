'use strict';

var appKey = 'afe6a27a1172ee772bbbcbe688547e7a';
var apiUrl = 'https://api.openweathermap.org/data/2.5';
//var apiUrl = 'http://api.wunderground.com/api/196ab87c421083e2/';
var currZip = '90621';
var weatherData = {};
var forecastData = {};

$(document).ready(init);

function init() {
	//getLocation(true,function(){
		getWeather(refreshPane);
		getForecast(refreshForecastPane);
	//});
	
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
		currZip = data.location.l.match(/\d{5}/)[0];
		if (refresh) {
			refreshCb();
		}
		return currZip;
	})
	.fail(function(data){
		console.log('Server not available. Resorting to default.');
		return currZip;
	});
}

function getWeather(refreshCb) {
	var url = `${apiUrl}/weather?appid=${appKey}&zip=${currZip}`;
	//var url = apiUrl + 'conditions/q/' + currZip + '.json';

	$.get(url)
	.done(function(data){
		weatherData = data;
		refreshCb();
	})
	.fail(function(data){
		console.log('Server not available.');
	});
}

function kelvinToC(k) {
	var kelvinOffset = 273.15;
	return k - kelvinOffset;
}

function kelvinToF(k) {
	var c = kelvinToC(k);
	return cToF(c);
}

function cToF(c) {
	return c * 1.8 + 32;
}

function refreshPane() { //for openweathermap.org
	var wd = weatherData;

	var $div = $('<div>');
	
	var $location = $('<p>').text(wd.name);
	var $icon = $('<img>').attr('src',`http://openweathermap.org/img/wn/${wd.weather[0].icon}@2x.png`);
	var $p2 = $('<p>').text(wd.weather[0].main + ' - ' + wd.weather[0].description);
	var $temp = $('<p>').text(kelvinToF(wd.main.temp) + 'F / ' + kelvinToC(wd.main.temp) + 'C');
	var $feels = $('<p>').text('Feels like: ' +wd.main.feels_like);
	var $hum = $('<p>').text('Humidity: ' + wd.main.humidity);
	var $wind = $('<p>').text('Wind: ' +wd.wind.speed);
	var $ob_time = $('<p>').text(Date(wd.dt));
	
	$div.append($location, $icon, $p2, $temp, $feels, $hum, $wind, $ob_time);

	$('.pane > div').empty().append($div);
}

function refreshPane1() {
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
