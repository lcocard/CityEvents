(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (process){
/* *******************  City Events Project 1 - app.JS ******************************************************************* */

/* ****************** Firebase ************************** */
$(document).ready(function () {

  require('dotenv').config();
  var api_key = process.env.FIREBASE_API_KEY;
  var appId = process.env.appId;
  var messagingSenderId = process.env.messagingSenderId;
  var projectId = process.env.projectId;

  var dbconfig = {
    apiKey: "api_key",
    authDomain: "project1-7542e.firebaseapp.com",
    databaseURL: "https://project1-7542e.firebaseio.com",
    projectId: "projectId",
    storageBucket: "project1-7542e.appspot.com",
    messagingSenderId: "messagingSenderId",
    appId: "appId"
  };

  firebase.initializeApp(dbconfig);

  var database = firebase.database();


  /* ***************************************** Init Google Map 1 *********************************************************** */

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
  var $linkEventName = "";
  j = 0;

  //var listLN = "Nathan Phillips Square";
  //placeLat = 43.7184034
  //placeLng = -79.5184845
  //listLN = localStorage.getItem("listLN");

  window.initMap = function () {
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
  $('html, body').animate({
    scrollTop: $('#title').offset().top
  }, 'slow');

  $('html,body').stop(true, false).animate({
    scrollTop: $('#title').offset().top
  }, 'slow');


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
            childSnapshot.val().calEvent.eventName + " Web Address: " + childSnapshot.val().calEvent.eventWebsite
          );

          /* ***************************************** Create table columns ******************************************* */

          var $getRow = $("<tr>");
          $getRow.addClass("getRow");
          $getRow.addClass("d-flex");

          if (typeof childSnapshot.val().calEvent.dates[i].eventWebsite !== ("https://lcocard.github.io/CityEvents/undefined" || "file:///Users/lcocard/Documents/Bootcamp/Class2_Courses/week11/Assignment/CityEvents/undefined")) {
            $linkEventName = '<a href="' + childSnapshot.val().calEvent.eventWebsite + '" target="_blank">' + childSnapshot.val().calEvent.eventName + '<a>';
          } else {
            $linkEventName = '<a href="#">' + childSnapshot.val().calEvent.eventName + '<a>';
          }
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

          var $eventDescription = childSnapshot.val().calEvent.description + " *** Free Event: " + childSnapshot.val().calEvent.freeEvent + " *** Reservation: " + getReservationRequired + " *** Email: " + getEventEmail + " *** Tel: " + getEventPhone;

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

            $('html, body').animate({
              scrollTop: $('#map').offset().top
            }, 'slow');

            $('html,body').stop(true, false).animate({
              scrollTop: $('#map').offset().top
            }, 'slow');

          });

        }
      }
    });
  }
});


}).call(this,require('_process'))
},{"_process":5,"dotenv":2}],2:[function(require,module,exports){
(function (process){
/* @flow */
/*::

type DotenvParseOptions = {
  debug?: boolean
}

// keys and values from src
type DotenvParseOutput = { [string]: string }

type DotenvConfigOptions = {
  path?: string, // path to .env file
  encoding?: string, // encoding of .env file
  debug?: string // turn on logging for debugging purposes
}

type DotenvConfigOutput = {
  parsed?: DotenvParseOutput,
  error?: Error
}

*/

const fs = require('fs')
const path = require('path')

function log (message /*: string */) {
  console.log(`[dotenv][DEBUG] ${message}`)
}

const NEWLINE = '\n'
const RE_INI_KEY_VAL = /^\s*([\w.-]+)\s*=\s*(.*)?\s*$/
const RE_NEWLINES = /\\n/g

// Parses src into an Object
function parse (src /*: string | Buffer */, options /*: ?DotenvParseOptions */) /*: DotenvParseOutput */ {
  const debug = Boolean(options && options.debug)
  const obj = {}

  // convert Buffers before splitting into lines and processing
  src.toString().split(NEWLINE).forEach(function (line, idx) {
    // matching "KEY' and 'VAL' in 'KEY=VAL'
    const keyValueArr = line.match(RE_INI_KEY_VAL)
    // matched?
    if (keyValueArr != null) {
      const key = keyValueArr[1]
      // default undefined or missing values to empty string
      let val = (keyValueArr[2] || '')
      const end = val.length - 1
      const isDoubleQuoted = val[0] === '"' && val[end] === '"'
      const isSingleQuoted = val[0] === "'" && val[end] === "'"

      // if single or double quoted, remove quotes
      if (isSingleQuoted || isDoubleQuoted) {
        val = val.substring(1, end)

        // if double quoted, expand newlines
        if (isDoubleQuoted) {
          val = val.replace(RE_NEWLINES, NEWLINE)
        }
      } else {
        // remove surrounding whitespace
        val = val.trim()
      }

      obj[key] = val
    } else if (debug) {
      log(`did not match key and value when parsing line ${idx + 1}: ${line}`)
    }
  })

  return obj
}

// Populates process.env from .env file
function config (options /*: ?DotenvConfigOptions */) /*: DotenvConfigOutput */ {
  let dotenvPath = path.resolve(process.cwd(), '.env')
  let encoding /*: string */ = 'utf8'
  let debug = false

  if (options) {
    if (options.path != null) {
      dotenvPath = options.path
    }
    if (options.encoding != null) {
      encoding = options.encoding
    }
    if (options.debug != null) {
      debug = true
    }
  }

  try {
    // specifying an encoding returns a string instead of a buffer
    const parsed = parse(fs.readFileSync(dotenvPath, { encoding }), { debug })

    Object.keys(parsed).forEach(function (key) {
      if (!process.env.hasOwnProperty(key)) {
        process.env[key] = parsed[key]
      } else if (debug) {
        log(`"${key}" is already defined in \`process.env\` and will not be overwritten`)
      }
    })

    return { parsed }
  } catch (e) {
    return { error: e }
  }
}

module.exports.config = config
module.exports.parse = parse

}).call(this,require('_process'))
},{"_process":5,"fs":3,"path":4}],3:[function(require,module,exports){

},{}],4:[function(require,module,exports){
(function (process){
// .dirname, .basename, and .extname methods are extracted from Node.js v8.11.1,
// backported and transplited with Babel, with backwards-compat fixes

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function (path) {
  if (typeof path !== 'string') path = path + '';
  if (path.length === 0) return '.';
  var code = path.charCodeAt(0);
  var hasRoot = code === 47 /*/*/;
  var end = -1;
  var matchedSlash = true;
  for (var i = path.length - 1; i >= 1; --i) {
    code = path.charCodeAt(i);
    if (code === 47 /*/*/) {
        if (!matchedSlash) {
          end = i;
          break;
        }
      } else {
      // We saw the first non-path separator
      matchedSlash = false;
    }
  }

  if (end === -1) return hasRoot ? '/' : '.';
  if (hasRoot && end === 1) {
    // return '//';
    // Backwards-compat fix:
    return '/';
  }
  return path.slice(0, end);
};

function basename(path) {
  if (typeof path !== 'string') path = path + '';

  var start = 0;
  var end = -1;
  var matchedSlash = true;
  var i;

  for (i = path.length - 1; i >= 0; --i) {
    if (path.charCodeAt(i) === 47 /*/*/) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now
        if (!matchedSlash) {
          start = i + 1;
          break;
        }
      } else if (end === -1) {
      // We saw the first non-path separator, mark this as the end of our
      // path component
      matchedSlash = false;
      end = i + 1;
    }
  }

  if (end === -1) return '';
  return path.slice(start, end);
}

// Uses a mixed approach for backwards-compatibility, as ext behavior changed
// in new Node.js versions, so only basename() above is backported here
exports.basename = function (path, ext) {
  var f = basename(path);
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};

exports.extname = function (path) {
  if (typeof path !== 'string') path = path + '';
  var startDot = -1;
  var startPart = 0;
  var end = -1;
  var matchedSlash = true;
  // Track the state of characters (if any) we see before our first dot and
  // after any path separator we find
  var preDotState = 0;
  for (var i = path.length - 1; i >= 0; --i) {
    var code = path.charCodeAt(i);
    if (code === 47 /*/*/) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now
        if (!matchedSlash) {
          startPart = i + 1;
          break;
        }
        continue;
      }
    if (end === -1) {
      // We saw the first non-path separator, mark this as the end of our
      // extension
      matchedSlash = false;
      end = i + 1;
    }
    if (code === 46 /*.*/) {
        // If this is our first dot, mark it as the start of our extension
        if (startDot === -1)
          startDot = i;
        else if (preDotState !== 1)
          preDotState = 1;
    } else if (startDot !== -1) {
      // We saw a non-dot and non-path separator before our dot, so we should
      // have a good chance at having a non-empty extension
      preDotState = -1;
    }
  }

  if (startDot === -1 || end === -1 ||
      // We saw a non-dot character immediately before the dot
      preDotState === 0 ||
      // The (right-most) trimmed path component is exactly '..'
      preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    return '';
  }
  return path.slice(startDot, end);
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

}).call(this,require('_process'))
},{"_process":5}],5:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}]},{},[1]);
