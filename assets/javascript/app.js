/* *******************  City Events Project 1 - app.JS ******************************************************************* */

/* ****************** Firebase ************************** */
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

/* ***************************************** Init Google Map 1 *********************************************************** */

$listLN = "Nathan Phillips Square";

$(document).ready(function () {
  $("#datePicker").focus();
});



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

/* ************************************** Search Firebase Data Events by Date ****************************************** */

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
    //var convertedEventDatePicker = moment.utc(eventDatePicker, eventDatePickerFORM);
    var convertedEventDatePicker = eventDatePicker + "T00:00:00.000Z";
    console.log("convertedEventDatePicker = " + convertedEventDatePicker);
    //var eventFromDate = convertedEventDatePicker.format();
    //var eventNextDay = moment.utc(eventFromDate).add(1, "days");



    //console.log("eventFromDate = " + eventFromDate.format());
    //console.log("eventNextDay = " + eventNextDay.format());


    var ref = database.ref("calEvent");

    database.ref().on("child_added", function (childSnapshot) {
      for (var i = 0; i < childSnapshot.val().calEvent.dates.length; i++) {

        var eventStartDate2 = moment(childSnapshot.val().calEvent.dates[i].startDateTime);
        var splitEventStartDate2 = (eventStartDate2.format()).split("T");
        var adjustedEventStartDate2 = splitEventStartDate2[0] + "T00:00:00.000Z";

        //var eventStartDate2FORM = "";
        //var adjustedEventStartDate = moment(eventStartDate2, eventStartDate2FORM).format("YYYY-MM-DD");


        var eventEndDate2 = moment(childSnapshot.val().calEvent.dates[i].endDateTime);
        if (typeof childSnapshot.val().calEvent.dates[i].endDateTime === "undefined") {
          eventEndDate2 = eventStartDate2;
        }
        var splitEventEndDate2 = (eventEndDate2.format()).split("T");
        var adjustedEventEndDate2 = splitEventEndDate2[0] + "T00:00:00.000Z";



        //var eventEndDate2FORM = "";
        //var adjustedEventEndDate = moment(eventEndDate2, eventEndDate2FORM).format();

        //console.log("adjustedEventEndDate = " + adjustedEventStartDate.format());
        //console.log("adjustedEventEndDate = " + adjustedEventEndDate.format());

        if (
          (adjustedEventStartDate2 <= convertedEventDatePicker) && (convertedEventDatePicker <= adjustedEventEndDate2)
        ) {
          console.log("adjustedEventStartDate2 = " + adjustedEventStartDate2)
          console.log("adjustedEventEndDate2 = " + adjustedEventEndDate2)
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

          /* ***************************************** Create table columns ******************************************* */

          var $getRow = $("<tr>");
          $getRow.addClass("getRow");
          $getRow.addClass("d-flex");

          var $linkEventName = '<a href="' + childSnapshot.val().calEvent.eventWebsite + '" target="_blank">' + childSnapshot.val().calEvent.eventName + '<a>';

          var $getEventName = $("<th>");
          $getEventName.addClass("getEventName");
          $getEventName.attr("scope", "row");
          $getEventName.addClass("col-2");
          //$getEventName.html(childSnapshot.val().calEvent.eventName);
          $getEventName.html($linkEventName);
          $getRow.append($getEventName);

          var $getEventLocation = $("<th>");
          $getEventLocation.addClass("getEventLocation");
          $getEventLocation.addClass("col-2");
          $getEventLocation.html(childSnapshot.val().calEvent.locations[0].locationName);
          $getRow.append($getEventLocation);

          //var randomDate = eventStartDate2;
          //var randomFormat = "";
          //var convertedDate = moment(randomDate, randomFormat);


          var $getDate = $("<td>");
          $getDate.addClass("getDate");
          $getDate.addClass("col-1");
          $getDate.html(eventStartDate2.format("MMM Do HH:mm"));
          $getRow.append($getDate);

          //var randomDate2 = eventEndDate2;
          //var randomFormat2 = "";
          //var convertedDate2 = moment(randomDate2, randomFormat2);


          var $getDate2 = $("<td>");
          $getDate2.addClass("getDate2");
          $getDate2.addClass("col-1");
          if (typeof childSnapshot.val().calEvent.dates[i].endDateTime === "undefined") {
            $getDate2.html(eventStartDate2.format("MMM Do YYYY"));
          } else {
            $getDate2.html(eventEndDate2.format("MMM Do HH:mm"));
          }
          $getRow.append($getDate2);

          /* ************************************Index for creating unique IDs***************************************** */

          j++

          /* ****************************** Create colapsable text description boxes ************************************** */

          var $collapseEventDescriptionItem = $("<a>");
          $collapseEventDescriptionItem.attr("role", "button");
          $collapseEventDescriptionItem.addClass("collapsed");
          $collapseEventDescriptionItem.attr("data-toggle", "collapse");
          $collapseEventDescriptionItem.attr("href", "#collapseEventDescription" + j);
          $collapseEventDescriptionItem.attr("aria-expanded", "false");
          $collapseEventDescriptionItem.attr("aria-controls", "collapseEventDescription" + j);

          var getReservationRequired = childSnapshot.val().calEvent.reservationRequired;
          if (typeof childSnapshot.val().calEvent.reservationRequired === "undefined") {
            getReservationRequired = "Not Required";
          }

          var getEventEmail = childSnapshot.val().calEvent.eventEmail;
          if (typeof childSnapshot.val().calEvent.eventEmail === "undefined") {
            getEventEmail = "Email not provided";
          }

          var getEventPhone = childSnapshot.val().calEvent.eventPhone;
          if (typeof childSnapshot.val().calEvent.eventPhone === "undefined") {
            getEventPhone = "Phone # not provided";
          }

          var $eventDescription = childSnapshot.val().calEvent.description + " *** Free Event: " + childSnapshot.val().calEvent.freeEvent + " *** Reservation Required: " + getReservationRequired + " *** Event e-mail: " + getEventEmail + " *** Event Phone: " + getEventPhone;

          var $eventDescriptionItem = $("<p>");
          $eventDescriptionItem.addClass("collapse");
          $eventDescriptionItem.attr("id", "collapseEventDescription" + j);
          $eventDescriptionItem.attr("aria-expanded", "false");
          $eventDescriptionItem.html($eventDescription);

          var $getDescription = $("<td>");
          $getDescription.addClass("getDescription");
          $getDescription.addClass("col-5");
          //$getDescription.attr("style", "width: 40%");
          $getDescription.html($eventDescriptionItem);
          $getDescription.append($collapseEventDescriptionItem);
          $getRow.append($getDescription);

          /* *************************************** Create View Location Buttons ******************************************** */

          $listLN = childSnapshot.val().calEvent.locations[0].locationName;
          console.log("locationName (buttons creation $listLN) = " + $listLN);
          var placeLat = childSnapshot.val().calEvent.locations[0].coords.lat;
          var placeLng = childSnapshot.val().calEvent.locations[0].coords.lng;
          console.log("placeLat - placeLng (button creation)=  " + placeLat + "  -  " + placeLng);

          var $getMapButton = $("<td>");
          $getMapButton.addClass("getMapButton");
          $getMapButton.addClass("col-1");
          $getMapButton.attr("style", "padding: 0");
          var $mapButton = $("<button>");
          $mapButton.attr("type", "button");
          $mapButton.addClass("viewLocation");
          $mapButton.addClass("btn btn-success");
          $mapButton.attr("id", "topics_button_row" + j);
          $mapButton.attr("value", $listLN);
          //$mapButton.attr("style", "padding: 0");

          $mapButton.html("<p>View</p>");
          $getMapButton.append($mapButton);
          $getRow.append($getMapButton);

          $("#eventsDataArea").append($getRow);

          /* ************************** The User Clicks a Button to Display the Event Map ********************************** */

          $(document).on("click", ".viewLocation", function () {

            $listLN = $(this).val();

            var placeLat = childSnapshot.val().calEvent.locations[0].coords.lat;
            var placeLng = childSnapshot.val().calEvent.locations[0].coords.lng;

            console.log("locationName (map request 2 $listLN) = " + $listLN);

            function showMarkers() {
              setMapOnAll(map);
            }

            /* ***************************************** Init Google Map 2 ************************************************** */

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
