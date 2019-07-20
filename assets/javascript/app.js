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

$listLN = "Nathan Phillips Square";

// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

var map;
var service;
var infowindow;
var marker;
var markers = [];
placeLat = 0;
placeLng = 0;
j = 0;
//var listLN = "Nathan Phillips Square";
//placeLat=43.7184034
//placeLng=-79.5184845
//listLN = localStorage.getItem("listLN");

function initMap() {
  var torontoEvent = new google.maps.LatLng(placeLat, placeLng);

  infowindow = new google.maps.InfoWindow();

  map = new google.maps.Map(document.getElementById("map"), {
    center: torontoEvent,
    zoom: 15
  });

  console.log("locationName (map request 1 $listLN) = " + $listLN);
  var request = {
    query: $listLN,
    fields: ["name", "formatted_address", "geometry"]
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

  google.maps.event.addListener(marker, "click", function () {
    infowindow.setContent(place.name + " - " + place.formatted_address);
    infowindow.open(map, this);
  });

}

function addMarker(location) {
  var marker = new google.maps.Marker({
    position: location,
    map: map
  });
  markers.push(marker);
}

function setMapOnAll(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

$(document).ready(function () {
  let now = new Date();

  let day = ("0" + now.getDate()).slice(-2);
  let month = ("0" + (now.getMonth() + 1)).slice(-2);

  let today = day + "-" + month + "-" + now.getFullYear();

  $("#datePicker").val(today);

  $("#datebtn").click(function () {
    testClicked();
  });

  function testClicked() {
    $("#eventsDataArea").empty();
    $(".getDate").html($("#datePicker").val());
    var eventDatePicker = document.querySelector("#datePicker").value;
    console.log("eventDatePicker = " + eventDatePicker);
    var eventDatePickerFORM = "YYYY-MM-DD";
    var convertedEventDatePicker = moment.utc(eventDatePicker, eventDatePickerFORM);
    console.log(
      "convertedEventDatePicker = " + convertedEventDatePicker.format()
    );
    var eventFromDate = convertedEventDatePicker.format();
    var eventNextDay = moment.utc(eventFromDate).add(1, "days");



    console.log("eventFromDate = " + eventFromDate);
    console.log("eventNextDay = " + eventNextDay.format());


    var ref = database.ref("calEvent");

    database.ref().on("child_added", function (childSnapshot) {
      for (var i = 0; i < childSnapshot.val().calEvent.dates.length; i++) {

        var eventStartDate2 = childSnapshot.val().calEvent.dates[i].startDateTime;
        var eventStartDate2FORM = "";
        var adjustedEventStartDate = moment(eventStartDate2, eventStartDate2FORM).format();

        var eventEndDate2 = childSnapshot.val().calEvent.dates[i].endDateTime;
        var eventEndDate2FORM = "";
        var adjustedEventEndDate = moment(eventEndDate2, eventEndDate2FORM).format();
        //console.log("adjustedEventEndDate = " + adjustedEventEndDate.format());

        if (
          (childSnapshot.val().calEvent.dates[i].startDateTime <= eventFromDate) && (eventFromDate <= childSnapshot.val().calEvent.dates[i].endDateTime)
        ) {
          //console.log(childSnapshot.val().calEvent.dates)
          console.log(
            " startDateTime = " +
            childSnapshot.val().calEvent.dates[i].startDateTime +
            " EndDateTime = " +
            childSnapshot.val().calEvent.dates[i].endDateTime + " Description = " +
            childSnapshot.val().calEvent.description +
            " Location = " + childSnapshot.val().calEvent.locations[0].locationName +
            " EventName = " +
            childSnapshot.val().calEvent.eventName
          );

          /* ********************* Create table columns ************************** */

          var $getRow = $("<tr>");
          $getRow.addClass("getRow");
          $getRow.addClass("d-flex");


          var $getEventName = $("<th>");
          $getEventName.addClass("getEventName");
          $getEventName.attr("scope", "row");
          $getEventName.addClass("col-2");
          $getEventName.html(childSnapshot.val().calEvent.eventName);
          $getRow.append($getEventName);

          var $getEventLocation = $("<th>");
          $getEventLocation.addClass("getEventLocation");
          $getEventLocation.addClass("col-2");
          $getEventLocation.html(childSnapshot.val().calEvent.locations[0].locationName);
          $getRow.append($getEventLocation);

          var randomDate = childSnapshot.val().calEvent.dates[i].startDateTime;
          var randomFormat = "";
          var convertedDate = moment(randomDate, randomFormat);


          var $getDate = $("<td>");
          $getDate.addClass("getDate");
          $getDate.addClass("col-1");
          $getDate.html(convertedDate.format("MMM Do HH:mm"));
          $getRow.append($getDate);

          var randomDate2 = childSnapshot.val().calEvent.dates[i].endDateTime;
          var randomFormat2 = "";
          var convertedDate2 = moment(randomDate2, randomFormat2);


          var $getDate2 = $("<td>");
          $getDate2.addClass("getDate2");
          $getDate2.addClass("col-1");
          $getDate2.html(convertedDate2.format("MMM Do HH:mm"));
          $getRow.append($getDate2);

          /* *********Index for creating unique IDs******* */

          j++

          /* *************** Create colapsable text description boxes ************************* */

          var $collapseEventDescriptionItem = $("<a>");
          $collapseEventDescriptionItem.attr("role", "button");
          $collapseEventDescriptionItem.addClass("collapsed");
          $collapseEventDescriptionItem.attr("data-toggle", "collapse");
          $collapseEventDescriptionItem.attr("href", "#collapseEventDescription" + j);
          $collapseEventDescriptionItem.attr("aria-expanded", "false");
          $collapseEventDescriptionItem.attr("aria-controls", "collapseEventDescription" + j);

          var $eventDescription = childSnapshot.val().calEvent.description;
          var $eventDescriptionItem = $("<p>");
          $eventDescriptionItem.addClass("collapse");
          $eventDescriptionItem.attr("id", "collapseEventDescription" + j);
          $eventDescriptionItem.attr("aria-expanded", "false");
          $eventDescriptionItem.html($eventDescription);

          var $getDescription = $("<td>");
          $getDescription.addClass("getDescription");
          $getDescription.addClass("col-5");
          $getDescription.attr("style", "width: 40%");
          $getDescription.html($eventDescriptionItem);
          $getDescription.append($collapseEventDescriptionItem);
          $getRow.append($getDescription);

          /* ********************* Create View Location Buttons ************************** */

          $listLN = childSnapshot.val().calEvent.locations[0].locationName;
          console.log("locationName (buttons creation $listLN) = " + $listLN);
          var placeLat = childSnapshot.val().calEvent.locations[0].coords.lat;
          var placeLng = childSnapshot.val().calEvent.locations[0].coords.lng;
          console.log("placeLat - placeLng (button creation)=  " + placeLat + "  -  " + placeLng);

          var $getMapButton = $("<td>");
          $getMapButton.addClass("getMapButton");
          $getMapButton.addClass("col-1");
          var $mapButton = $("<button>");
          $mapButton.attr("type", "button");
          $mapButton.addClass("viewLocation");
          $mapButton.addClass("btn btn-success");
          $mapButton.attr("id", "topics_button_row" + j);
          $mapButton.attr("value", $listLN);
          $mapButton.html("<p>View Location</p>");
          $getMapButton.append($mapButton);
          $getRow.append($getMapButton);

          $("#eventsDataArea").append($getRow);

          /* ************************** The User Clicks a Button to Display the Event Map ************************** */

          $(document).on("click", ".viewLocation", function () {
            $listLN = $(this).val();

            var placeLat = childSnapshot.val().calEvent.locations[0].coords.lat;
            var placeLng = childSnapshot.val().calEvent.locations[0].coords.lng;

            console.log("locationName (map request 2 $listLN) = " + $listLN);

            function showMarkers() {
              setMapOnAll(map);
            }

            initMap();

            var markers = [];
            function createMarker(place) {
              var marker = new google.maps.Marker({
                map: map,
                position: place.geometry.location
              });
              markers.push(marker);
              google.maps.event.addListener(marker, "click", function () {
                infowindow.setContent(place.name + " - " + place.formatted_address);
                infowindow.open(map, this);
              });
            }


            function addMarker(location) {
              var marker = new google.maps.Marker({
                position: location,
                map: map
              });
              markers.push(marker);
            }

            function setMapOnAll(map) {
              for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(map);
              }
            }

          });

        }
      }
    });
  }

});
