

// 1. Initialize Firebase
var config = {
    apiKey: "AIzaSyAWutX-VXDOCMn5DULQaMMZpExXF-HU2LQ",
    authDomain: "project1-7542e.firebaseapp.com",
    databaseURL: "https://project1-7542e.firebaseio.com",
    projectId: "project1-7542e",
    storageBucket: "project1-7542e.appspot.com",
    messagingSenderId: "800720391067",
    appId: "1:800720391067:web:41780486e1ebc136"
};

firebase.initializeApp(config);

var database = firebase.database();

$(document).ready(function () {
    let now = new Date();

    let day = ("0" + now.getDate()).slice(-2);
    let month = ("0" + (now.getMonth() + 1)).slice(-2);

    let today = (day) + "-" + (month) + "-" + now.getFullYear();


    $('#datePicker').val(today);

    $('#datebtn').click(function () {

        testClicked();

    });
});
function testClicked() {
    $('.getDate').html($('#datePicker').val());
    //var eventDatePicker = "2019-07-03";
    //var eventDatePicker = $('.getDate').val();
    var eventDatePicker = document.querySelector('#datePicker').value;
    console.log("eventDatePicker = " + eventDatePicker);
    var eventDatePickerFORM = "YYYY-MM-DD";
    var convertedEventDatePicker = moment(eventDatePicker, eventDatePickerFORM);
    console.log("convertedEventDatePicker = " + convertedEventDatePicker.format());
    var eventFromDate = convertedEventDatePicker.format();
    var eventNextDay = moment(eventFromDate).add(1, 'days');

    console.log("eventFromDate = " + eventFromDate);
    console.log("eventNextDay = " + eventNextDay.format());


    var ref = database.ref("calEvent");

    var eventArray = [];

    database.ref().on("child_added", function (childSnapshot) {
        for (var i = 0; i < childSnapshot.val().calEvent.dates.length; i++) {
            if ((eventFromDate <= childSnapshot.val().calEvent.dates[i].startDateTime) && (childSnapshot.val().calEvent.dates[i].startDateTime <= eventNextDay.format())) {
                //console.log(childSnapshot.val().calEvent.dates)
                console.log(" startDateTime = " + childSnapshot.val().calEvent.dates[i].startDateTime + " EndDateTime = " + childSnapshot.val().calEvent.dates[i].endDateTime + " Description = " + childSnapshot.val().calEvent.description + " EventName = " + childSnapshot.val().calEvent.eventName);
            }
        }
    });
}
// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

var map;
var service;
var infowindow;
listLN = "Nathan Phillips Square";

function initMap() {
    var torontoEvent = new google.maps.LatLng(43.7184034, -79.5184845);

    infowindow = new google.maps.InfoWindow();

    map = new google.maps.Map(
        document.getElementById('map'), { center: torontoEvent, zoom: 15 });

    var request = {
        query: listLN,
        fields: ['name', 'formatted_address', 'geometry']
    };

    service = new google.maps.places.PlacesService(map);

    service.findPlaceFromQuery(request, function (results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
                createMarker(results[i]);
            }

            map.setCenter(results[0].geometry.location);
        }
    });
}

function createMarker(place) {
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', function () {
        infowindow.setContent(place.name + " - " + place.formatted_address);
        infowindow.open(map, this);
    });
}
//************************************************** Tests ********************************************************* */
//var eventDatePicker = "2019-01-15";
//var eventDatePickerFORM = "";
//var convertedEventDatePicker = "";

//var randomDate = "02/23/1999";
//var randomFormat = "MM/DD/YYYY";
//var convertedDate = moment("convertedDate = " + randomDate, randomFormat);

//var eventDateTMST = "2019-07-15T00:00:00.000Z";
//var eventDateFORM = "";
//var eventDate = moment(eventDateTMST, eventDateFORM);

//var eventDatePicker = "2019-07-03";
//var eventDatePickerFORM = "YYYY-MM-DD";
//var convertedEventDatePicker = moment("convertedEventDatePicker = " + eventDatePicker, eventDatePickerFORM);


// Using scripts from moment.js write code below to complete each of the following.
// Console.log to confirm the code changes you made worked.

// 1 ...to convert the randomDate into three other date formats
//console.log(convertedDate.format());
//console.log(eventDate.format("MMM Do Y"));







