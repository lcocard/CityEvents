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

var eventFromDate = "2019-10-07T00:00:00.000Z";
var eventToDate = "2019-10-07T23:59:00.000Z";

var ref = database.ref("calEvent");

//var query = database.ref("calEvent").orderByValue("startDate").startAt(eventFromDate).endAt(eventToDate);
/*database.ref().orderByChild("startDate").on("value", function (snapshot) {
    //.startAt(eventFromDate).endAt(eventToDate)
    console.log(snapshot.val());
});*/

/*database.ref.child(`calEvent"/startDateTime`).orderByValue().once('value', (snapshot) => {
    if (snapshot.exists()) {
        snapshot.forEach((child) => {
            console.log(`${child.key}: ${child.val()}`)
        })
    }
})*/
var eventArray = [];

database.ref().on("child_added", function (childSnapshot) {
    //console.log(childSnapshot.val());
    for (i in childSnapshot.val().calEvent.dates) {
        if ((eventFromDate <= childSnapshot.val().calEvent.dates[0].startDateTime) && (childSnapshot.val().calEvent.dates[0].startDateTime <= eventToDate));
        //console.log(childSnapshot.val().calEvent.dates)
        console.log(" startDateTime = " + childSnapshot.val().calEvent.dates[0].startDateTime + " EndDateTime = " + childSnapshot.val().calEvent.dates[0].endDateTime + " Description = " + childSnapshot.val().calEvent.description + " EventName = " + childSnapshot.val().calEvent.eventName);
    }
});



var randomDate = "02/23/1999";
var randomFormat = "MM/DD/YYYY";
var convertedDate = moment(randomDate, randomFormat);

// Using scripts from moment.js write code below to complete each of the following.
// Console.log to confirm the code changes you made worked.

// 1 ...to convert the randomDate into three other date formats
console.log(convertedDate.format());



/*database.ref().on("child_added", function (childSnapshot) {
    //console.log(childSnapshot.val());
    for (x in childSnapshot.val().calEvent.description) {
        console.log(childSnapshot.val().calEvent.description)
    }
});*/

// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

var map;
var service;
var infowindow;


function initMap() {
    var torontoEvent = new google.maps.LatLng(43.7463319, -79.58131309999999);

    infowindow = new google.maps.InfoWindow();

    map = new google.maps.Map(
        document.getElementById('map'), { center: torontoEvent, zoom: 15 });

    var request = {
        query: "Rexdale Community Hub",
        fields: ['name', 'formatted_address', 'geometry'],
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






