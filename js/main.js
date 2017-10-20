// Geolocation button check.


navigator.geolocation.getCurrentPosition(function (location) {
    console.log(location.coords.latitude);
    console.log(location.coords.longitude);
    console.log(location.coords.accuracy);
    $("#geolocation").on("click", function () {
        $('#latitude').val(location.coords.latitude);
        $('#longitude').val(location.coords.longitude);

    });
});

function staggerFade() {
    setTimeout(function () {
        $('.fadein-stagger > *').each(function () {
            $(this).addClass('js-animated');
        })
    }, 30);
}

// =================================================
// Skycons
// =================================================

function skycons() {
    var i,
        icons = new Skycons({
            "color": "white",
            "resizeClear": true // nasty android hack
        }),
        list = [ // listing of all possible icons
				"clear-day",
				"clear-night",
				"partly-cloudy-day",
				"partly-cloudy-night",
				"cloudy",
				"rain",
				"sleet",
				"snow",
				"wind",
				"fog"
			];

    // loop thru icon list array
    for (i = list.length; i--;) {
        var weatherType = list[i], // select each icon from list array
            // icons will have the name in the array above attached to the
            // canvas element as a class so let's hook into them.
            elements = document.getElementsByClassName(weatherType);

        // loop thru the elements now and set them up
        for (e = elements.length; e--;) {
            icons.set(elements[e], weatherType);
        }
    }

    // animate the icons
    icons.play();
}
// =================================================
// Temperature Converter
// =================================================

// convert degrees to celsius
function fToC(fahrenheit) {
    var fTemp = fahrenheit,
        fToCel = (fTemp - 32) * 5 / 9;

    return fToCel;
}

// =================================================
// Weather Reporter
// =================================================

function weatherReport(latitude, longitude) {
    // variables config for coordinates, url and api key
    // latitude and longitude are accepted arguments and passed
    // once a user has submitted the form.
    var apiKey = 'fc6781dcfb70b9319a3814151868de2d',
        url = 'https://api.darksky.net/forecast/',
        lati = latitude,
        longi = longitude,
        api_call = url + apiKey + "/" + lati + "," + longi + "?extend=hourly&callback=?";

    // Hold our days of the week for reference later.
    var days = [
		'Sunday',
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday'
	];


    // Celsius button check. Is it toggled or not?
    var isCelsiusChecked = $('#celsius:checked').length > 0;

    // Call to the DarkSky API to retrieve JSON
    $.getJSON(api_call, function (forecast) {





        // Loop thru daily forecasts
        for (var i = 0, l = forecast.daily.data.length; i < l - 1; i++) {
console.log(forecast.daily.data[i].time);
            var date = new Date(forecast.daily.data[i].time * 1000),
                day = days[date.getDay()],
                skicons = forecast.daily.data[i].icon,
                time = forecast.daily.data[i].time,
                humidity = forecast.daily.data[i].humidity,
                summary = forecast.daily.data[i].summary,
                temp = Math.round(forecast.hourly.data[i].temperature),
                tempMax = Math.round(forecast.daily.data[i].temperatureMax);

            // If Celsius is checked then convert degrees to celsius
            // for 24 hour forecast results
            if (isCelsiusChecked) {
                temp = fToC(temp);
                tempMax = fToC(tempMax);
                temp = Math.round(temp);
                tempMax = Math.round(tempMax);
            }

            // Append Markup for each Forecast of the 7 day week
            $("#forecast").append(
                '<li class="shade-' + skicons + '"><div class="card-container"><div><div class="front card"><div>' +
                "<div class='graphic'><canvas class=" + skicons + "></canvas><p class='summary'>" + summary + "</p></div>" +
                "<div class='second-text'><b>Day</b>: " + date.toLocaleDateString() +
                "  <b>Temperature</b>: " + temp +
                "  <b>Max Temp.</b>: " + tempMax +
                "  <b>Humidity</b>: " + humidity + "</div>" +
                '</div></div><div class="back card">' +
                '</div></div></div></li>'
            );


        }

        skycons(); // inject skycons for each forecast
        staggerFade(); // fade-in forecast cards in a stagger-esque fashion

    });
}
// =================================================
// Get Weather Button Event
// =================================================

// Get Weather Button Event
$('button').on('click', function (e) {
    var lat = $('#latitude').val(),
        long = $('#longitude').val(),
        city_name = $('#city-search').val()

    // If the latitude and longitude inputs aren't empty
    // then continue with the code. Otherwise report error to user.
    if (lat && long !== '') {
        e.preventDefault();

        // Fade logo out when form is submitted
        $('#logo').fadeOut(100);

        // Fade the form out, submit the weather request,
        // inject "new forecast" button, city name & forecast cards.
        $('.form').fadeOut(100, function () {
            weatherReport(lat, long);
            $('.screen').append('<button id="back">New Forecast</button><div class="citydiv"><h3 class="city">' + city_name + '</h3></div><ul class="list-reset fadein-stagger" id="forecast"></ul>');
        });
    }
});
// "new forecast" button. Allow user
// to return to forecast form.
$('body').on('click', '#back', function () {
    window.location.reload(true);
})


// =================================================
// Report City & AutoFill Coords
// =================================================

function insertGoogleScript() {
    var google_api = document.createElement('script'),
        api_key = 'AIzaSyDZKnmxygGoQhcLvFRek1F3-Nn-TpmZgzk';

    // Inject the script for Google's API and reference the initGoogleAPI
    // function as a callback.
    google_api.src = 'https://maps.googleapis.com/maps/api/js?key=' + api_key + '&callback=initGoogleAPI&libraries=places,geometry';
    document.body.appendChild(google_api);
}


// SearchBox Method
function initGoogleAPI() {
    var autocomplete = new google.maps.places.SearchBox(document.querySelector("#city-search"));

    autocomplete.addListener('places_changed', function () {
        var place = autocomplete.getPlaces()[0];
        document.querySelector("#latitude").value = place.geometry.location.lat();
        document.querySelector("#longitude").value = place.geometry.location.lng();
    });
}

insertGoogleScript();