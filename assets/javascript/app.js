var listLN = "";

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

$(document).ready(function() {
  let now = new Date();

  let day = ("0" + now.getDate()).slice(-2);
  let month = ("0" + (now.getMonth() + 1)).slice(-2);

  let today = day + "-" + month + "-" + now.getFullYear();

  $("#datePicker").val(today);

  $("#datebtn").click(function() {
    testClicked();
  });
});
function testClicked() {
  $(".getDate").html($("#datePicker").val());
  //var eventDatePicker = "2019-07-03";
  //var eventDatePicker = $('.getDate').val();
  var eventDatePicker = document.querySelector("#datePicker").value;
  console.log("eventDatePicker = " + eventDatePicker);
  var eventDatePickerFORM = "YYYY-MM-DD";
  var convertedEventDatePicker = moment(eventDatePicker, eventDatePickerFORM);
  console.log(
    "convertedEventDatePicker = " + convertedEventDatePicker.format()
  );
  var eventFromDate = convertedEventDatePicker.format();
  var eventNextDay = moment(eventFromDate).add(1, "days");

  console.log("eventFromDate = " + eventFromDate);
  console.log("eventNextDay = " + eventNextDay.format());

  var ref = database.ref("calEvent");

  //var eventArray = [];

  database.ref().on("child_added", function(childSnapshot) {
    //childSnapshot.forEach(function (element) {
    for (var i = 0; i < childSnapshot.val().calEvent.dates.length; i++) {
      if (
        eventFromDate <= childSnapshot.val().calEvent.dates[i].startDateTime &&
        childSnapshot.val().calEvent.dates[i].startDateTime <=
          eventNextDay.format()
      ) {
        //console.log(childSnapshot.val().calEvent.dates)
        console.log(
          " startDateTime = " +
            childSnapshot.val().calEvent.dates[i].startDateTime +
            " EndDateTime = " +
            childSnapshot.val().calEvent.dates[i].endDateTime +
            " Description = " +
            childSnapshot.val().calEvent.description +
            " Location = " + childSnapshot.val().calEvent.locations[0].locationName + 
            " EventName = " +
            childSnapshot.val().calEvent.eventName
        );

        //database.ref().set({
        listLN: childSnapshot.val().calEvent.locations[0].locationName
        //});

// Store
//localStorage.setItem("listLN", "listLN");
//localStorage.setItem("listLN", childSnapshot.val().calEvent.locations[0].locationName);
// Retrieve
//listLN = localStorage.getItem("listLN");

        //console.log(
        //  "eventArray Length = " + childSnapshot.val().calEvent.eventName.length);



        /* ********************* Add query results to the table ************************** */

        var $getRow = $("<tr>");
        $getRow.addClass("getRow");
        

        var $getEventName = $("<th>");
        $getEventName.addClass("getEventName");
        $getEventName.attr("scope", "row");
        $getEventName.html(childSnapshot.val().calEvent.eventName);
        $getRow.append($getEventName);

        var randomDate = childSnapshot.val().calEvent.dates[i].startDateTime;
        var randomFormat = "";
        var convertedDate = moment(randomDate, randomFormat);
        
        
        var $getDate =  $("<td>");
        $getDate.addClass("getDate");
        $getDate.html(convertedDate.format("MMM Do YY"));
        $getRow.append($getDate);

        var $getDescription =  $("<td>");
        $getDescription.addClass("getDescription");
        $getDescription.html(childSnapshot.val().calEvent.description);
        $getRow.append($getDescription);

        var $getMapButton =  $(" <td class='getMapButton'> <input type='submit' class='btn btn-success btn-topics-input' value='Submit'/></td>");
        $getRow.append($getMapButton);

        $(".btn-topics-input").on("click", function() {
          console.log("locationName (button listLN) = " + listLN);
          listLN = childSnapshot.val().calEvent.locations[0].locationName;
          //window.open("maps.html", "_blank")
          });

        $("#eventsDataArea").append($getRow);

      }
      //});
    }
  });
  //eventArray.push(childSnapshot.val().calEvent.eventName);
}
// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

var map;
var service;
var infowindow;
var listLN = "Nathan Phillips Square";
//listLN = localStorage.getItem("listLN");

function initMap() {
  var torontoEvent = new google.maps.LatLng(43.7184034, -79.5184845);

  infowindow = new google.maps.InfoWindow();

  map = new google.maps.Map(document.getElementById("map"), {
    center: torontoEvent,
    zoom: 15
  });

  console.log("locationName (map request listLN) = " + listLN);
  var request = {
    query: listLN,
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
//************************************************** Tests ********************************************************* */

/* Test1: Add each element to the table */
//for (var j = 0; j < childSnapshot.val().calEvent.eventName.length; j++) {
//var $getRow = $("<tr>");
//$getRow.addClass("getRow");
//$(".eventsDataArea").append($getRow);
//var $getEventName = $("<th>");
//$getEventName.addClass("getEventName");
//$getRow.attr("scope", "row");
//$('.getEventName').html(childSnapshot.val().calEvent.eventName);
//}

/* Test 2: Add each element to the table */
/*let y = 0
                    $("#eventsDataArea").empty();
    
                    //var database = firebase.database();
                    //database.ref().once('value', function (snapshot) {
                    //if (snapshot.exists()) {
                    var content = '';
                    forEach(function (data) {
                        y++
                        var val = data.val();
                        content += '<tr>';
                        content += '<th>' + 'scope="row"' + childSnapshot.val().calEvent.eventName + '</th>';
                        content += '<td>' + childSnapshot.val().calEvent.dates[i].startDateTime + '</td>';
                        content += '<td>' + childSnapshot.val().calEvent.description + '</td>';
                        content += '<td>' + '</td>';
                        content += '</tr>';
                    });
                    $('#eventsDataArea').append(content);*/
//}
//});

//}
