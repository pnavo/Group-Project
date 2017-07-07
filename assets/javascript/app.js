
//initialize firebase
var config = {
	apiKey: "AIzaSyBSk349ZdonVa8deEG0mnYiWtDIW_WNBV0",
    authDomain: "pick-up-game-f59ca.firebaseapp.com",
    databaseURL: "https://pick-up-game-f59ca.firebaseio.com",
    projectId: "pick-up-game-f59ca",
    storageBucket: "",
    messagingSenderId: "477205336108"
 };

 if (!firebase.apps.length) {
  firebase.initializeApp(config);
 }

//variable to reference the database
var database = firebase.database();

var cors = "https://cors-anywhere.herokuapp.com/";
var coordLat;
var coordLng;
var coordinates;
var queryURL;
var park;
var parkLat;
var parkLng;
var gameList = [];
var startTimeList = [];
var endTimeList = [];
var countList = [];
var gamesNearby = [];
// Map instances
var gameMap;
var parkMap;
// Default values
var address = "160 Spear St, San Francisco";
var radius = 5000;
var gameType = "Basketball+Court";

database.ref().child('games').orderByChild('park').once("value", function(snapshot) {
  snapshot.forEach(function(snap){
    console.log(snap.val().park);
    gameList.push(snap.val().park);
  });
});


function hideDivs() {
  $("#join_one").hide();
  $("#join_message").hide();
  $("#org_one").hide();
  $("#org_form").hide();
  $("#org_message").hide();
  $("#landing").hide();
};

hideDivs();
$("#landing").show();

//on click of join button to search for a game after inputting the address
$('#join').on('click', function (event){
  if ($("#address").val().trim() !== "") {
    address = $("#address").val().trim();
  } else {
    $("#searcher").prepend("<p>Please enter a valid address</p>");
    return
  }
  hideDivs();
  $("#join_one").show();
  //pull from "game" object in firebase when searching for a game  
  //pull the address from the input box 
  // address = $('#address').val().trim();
  getCoord(address);
  radius = $("#miles").val() * 1609;
  console.log("radius:",radius);
  queryURL = cors + "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + coordinates + "&radius=" + radius + "&type=park&keyword=" + gameType + "&key=AIzaSyDPEkigjm2_zBLC8qVTcHkuHtFZNjSY3Zk";
  //connect address and map
  renderGameMap(coordLat,coordLng);
  //populate table with nearby games
  populateGameList(queryURL);
});

$(document).on('click','.select',function(event){
  hideDivs();
  $("#join_message").show();
  $("#joinTimeText").text($(this).attr("data-time"));
  $("#joinParkText").text($(this).attr("data-park"));
});

function populateGameList(queryURL){
  database.ref().child('games').orderByChild('park').once("value", function(snapshot) {
    console.log(snapshot.val());
    snapshot.forEach(function(snap){
      console.log(snap.val().park);
      gameList.push(snap.val().park);
      startTimeList.push(snap.val().startTime);
      endTimeList.push(snap.val().endTime);
      countList.push(snap.val().count);
      //add map marker to gameMap
      console.log(snap.val().lat,",",snap.val().lng);
      var markerCoords = {lat: snap.val().lat, lng: snap.val().lng};
      var marker = new google.maps.Marker({
        position: markerCoords,
        map: gameMap
      });
    });
  });
  setTimeout(getGamesNearby(queryURL),500);
  setTimeout(function(){
    for (var i = 0; i < gamesNearby.length; i++) {
      var resultsRow = $("<tr>")
      var nameCol = $("<td>");
      var timeCol = $("<td>");
      var countCol = $("<td>");
      var buttonCol = $("<button>");
      console.log(gamesNearby[i]);
      nameCol.append(gamesNearby[i]);
      // Grab from firebase
      timeCol.append(startTimeList[i] + " - " + endTimeList[i]);
      countCol.append(countList[i]);
      buttonCol.attr({
        "data-park": gamesNearby[i],
        "data-time": startTimeList[i],
      });
      buttonCol.text("Select");
      buttonCol.addClass("select");

      resultsRow.append(nameCol);
      resultsRow.append(timeCol);
      resultsRow.append(countCol);
      resultsRow.append(buttonCol);
      $("#gameTable").append(resultsRow);
    }
  },1000)
  
    console.log("Get list: Done");
};

//
function getGamesNearby(listURL){
  $.ajax({
      url: listURL,
      method: "GET"
    }).done(function(response){
      console.log(response);
      var results = response.results
      gamesNearby = [];
      for (var i = 0; i < results.length; i++) {
        if (gameList.indexOf(results[i].name) >= 0) {
          gamesNearby.push(results[i].name);
        }
      };
      console.log("Nearby games: ",gamesNearby);
    });   
};

//on click of organize button to receive the coordinates of the user address to get the list of parks
$('#organize').on('click', function(event){
    //pull value from input box
  if ($("#address").val().trim() !== "") {
    address = $("#address").val().trim();
  } else {
    $("#searcher").prepend("<p>Please enter a valid address</p>");
    return
  }
  hideDivs();
  //display the form for user to fill out
  $("#org_one").show();
  console.log("clicked");

  // Retrieve coordinates for the address entered
  getCoord(address);
  radius = $("#miles").val();
    // Retrieve list of venues available for game
  // getParkList(queryURL);
  renderParkMap(coordLat,coordLng);
  getParkList(queryURL);
});

$(document).on('click','.create',function(event){
  hideDivs();
  $("#org_form").show();
  park = $(this).attr("data-park");
  parkLat = parseFloat($(this).attr("data-lat"));
  parkLng = parseFloat($(this).attr("data-lng"));
});
  //pull up table with input fields
  // $('.container').slideToggle("slow");
  //pull the values from the create form
$("#submit").on('click', function(event){
  event.preventDefault();
  // Hide Create div and show confirmation-message
  hideDivs();
  $("#org_message").show();
  name = $('#name').val().trim();
  startTime = $('#startTime').val().trim();
  endTime = $('#endTime').val().trim();
  date = $('#date').val().trim();
  //push to message
  $("#parkText").text(park);
  $("#timeText").text(startTime);
  //push the new variables to the cloud 
  database.ref('games').push({
    name: name,
    park: park,
    lat: parkLat,
    lng: parkLng,
    startTime: startTime,
    endTime: endTime,
    date: date
  });
});

$("#return").on('click',function(event){
  hideDivs();
  $("#landing").show();
})

function getCoord(address) {
  $.ajax({
    async: false,
    url: cors + "https://maps.googleapis.com/maps/api/place/textsearch/json?query=" + address + "&key=AIzaSyDPEkigjm2_zBLC8qVTcHkuHtFZNjSY3Zk",
    method: "GET"
  }).done(function(response){
  //convert geo location address to coordinates
    coordLat = response.results[0].geometry.location.lat;
    coordLng = response.results[0].geometry.location.lng;
    coordinates = coordLat + "," + coordLng;
    console.log("Coordinates: ",coordinates)
    queryURL = cors + "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + coordinates + "&radius=" + radius + "&type=park&keyword=" + gameType + "&key=AIzaSyDPEkigjm2_zBLC8qVTcHkuHtFZNjSY3Zk";
    console.log("Query: ",queryURL);
    }); 
};

// function getGameList(coordLat,coordLng) {
//   database.ref('games').once("value", function (snapshot){
//     console.log(snapshot);
//   });
// };


function renderGameMap(coordLat,coordLng) {
  var coordCenter = {lat: coordLat, lng: coordLng};
  gameMap = new google.maps.Map(document.getElementById('game_map'), {
    center: coordCenter,
    zoom: 15
  });
};
  // // Pull coordinates from Firebase
  // // Create marker for each game nearby
  // for (var i = 0; i < coordsList.length; i++) {
  //   var coords = coordsList[i]
  //   var marker = new google.maps.Marker({
  //     position: coords,
  //     map: gameMap
  //   });
  // };


//function to get list of parks from google API
function getParkList(listURL) {
  $.ajax({
      url: listURL,
      method: "GET"
    }).done(function(response){
      console.log(response);
      var results = response.results
      for (var i = 0; i < results.length; i++) {

        var resultsRow = $("<tr>");
        var nameCol = $("<td>");
        // var timeCol = $("<td>");
        // var countCol = $("<td>");
        var buttonCol = $("<button>")
        console.log(results[i].name);
        nameCol.append(results[i].name);
        // Grab from firebase
        // timeCol.append();
        // countCol.append();
        buttonCol.addClass("create");
        buttonCol.attr({
          "data-park": results[i].name,
          "data-lat": results[i].geometry.location.lat,
          "data-lng": results[i].geometry.location.lng
        });
        buttonCol.text("Create");
        // if (results[i].opening_hours !== undefined) {
        //   openP.append(results[i].opening_hours.open_now);          
        //   console.log("Opening hours: ",results[i].opening_hours.open_now);      
        // };
        resultsRow.append(nameCol);
        // resultsRow.append(timeCol);
        // resultsRow.append(countCol);
        resultsRow.append(buttonCol);       
        $("#parkTable").append(resultsRow);   
        //add map markers to parkMap
        console.log(results[i].geometry.location.lat,",",results[i].geometry.location.lng);
        var markerCoords = {lat: results[i].geometry.location.lat, lng: results[i].geometry.location.lng};
        var marker = new google.maps.Marker({
          position: markerCoords,
          map: parkMap
        }); 
      }
        console.log("Get list: Done");
    }); 
};

//function to show list of PUGs in the area 
function showGamesList(){};

function renderParkMap(coordLat,coordLng) {
  var coordCenter = {lat: coordLat, lng: coordLng};
  parkMap = new google.maps.Map(document.getElementById('park_map'), {
    center: coordCenter,
    zoom: 14
  });
  // // Create marker for each game nearby
  // for (var i = 0; i < coordsList.length; i++) {
  //   var coords = coordsList[i]
  //   var marker = new google.maps.Marker({
  //     position: coords,
  //     map: map
  //   });
  // };
};

// Construct map in div #map
function initMap() {
    parkMap = new google.maps.Map(document.getElementById('park_map'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 15
  });
}