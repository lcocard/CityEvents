/* ************** City Events - Maps.JS *********** */

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


// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

var map;
var service;
var infowindow;
var $listLN;
//var listLN = "Textile Museum of Canada";

//listLN = childSnapshot.val().calEvent.locations[0].locationName;
//var listLN = localStorage.getItem("listLN");
//console.log("locationName (listLN) = " + listLN);

listLN = "Nathan Phillips Square";

function initMap() {
  var torontoEvent = new google.maps.LatLng(43.7184034, -79.5184845);

  infowindow = new google.maps.InfoWindow();

  map = new google.maps.Map(document.getElementById("map"), {
    center: torontoEvent,
    zoom: 15
  });

  var request = {
    query: $listLN,
    fields: ["name", "formatted_address", "geometry"]
  };

  service = new google.maps.places.PlacesService(map);

  service.findPlaceFromQuery(request, function(results, status) {
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

  google.maps.event.addListener(marker, "click", function() {
    infowindow.setContent(place.name + " - " + place.formatted_address);
    infowindow.open(map, this);
  });
}
