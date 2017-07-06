
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
var coordinates;
var queryURL;
// Default values
var address = "160 Spear St, San Francisco";
var radius = 5000;
var gameType = "Basketball+Court";

//create children in "game" object in firebase on click of "organize" button
$('#organize').on('click', function(event){
  //display the form for user to fill out
  $("#first_page").css("display", "inline");
  //pull up table with input fields
  // $('.container').slideToggle("slow");
  //pull the values from the create form
    name = $('#name').val();
    address = $('#address').val();
    startTime = $('#startTime').val();
    endTime = $('#endTime').val();
  //push the new variables to the cloud 
    database.ref('games').push({
      name: name,
      address: address, 
      startTime: startTime,
      endTime: endTime
  });
});

//on click of join button to search for a game after inputting the address
$('#join').on('click', function (event){
  event.preventDefault();
  //pull from "game" object in firebase when searching for a game  
  database.ref('games').once("value", function (snapshot){
    //pull the address from the input box 
    address = $('#address').val();
    //connect address and map
    renderMap();
    });  
});

//on click of organize button to receive the coordinates of the user address to get the list of parks
$("#organize").on("click",function(e){
  e.preventDefault();
  console.log("clicked");
  //pull value from input box
  address = $("#address").val().trim();
  // Retrieve coordinates for the address entered
  $.ajax({
    url: cors + "https://maps.googleapis.com/maps/api/place/textsearch/json?query=" + address + "&key=AIzaSyDPEkigjm2_zBLC8qVTcHkuHtFZNjSY3Zk",
    method: "GET"
  }).done(function(response){
    console.log(response.results[0].geometry.location.lat + "," + response.results[0].geometry.location.lng);
  //convert geo location address to coordinates 
    coordinates = response.results[0].geometry.location.lat + "," + response.results[0].geometry.location.lng;
    queryURL = cors + "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + coordinates + "&radius=" + radius + "&type=park&keyword=" + gameType + "&key=AIzaSyDPEkigjm2_zBLC8qVTcHkuHtFZNjSY3Zk";
    console.log(queryURL);
    // Retrieve list of venues available for game
    getList(queryURL);
    renderMap(coordinates);
    }); 
});

//function to get list of parks from google API
function getList(listURL) {
  $.ajax({
      url: listURL,
      method: "GET"
    }).done(function(response){
      console.log(response);
      var resultsDiv = $("<div>")
      var results = response.results
      for (var i = 0; i < results.length; i++) {
        var nameP = $("<p>");
        var openP = $("<p>");
        // var photo = $("<img>");
        console.log(results[i].name);
        nameP.append(results[i].name);
        if (results[i].opening_hours !== undefined) {
          openP.append(results[i].opening_hours.open_now);          
          console.log(results[i].opening_hours.open_now);      
        };
        // photo.attr("src","")
        resultsDiv.append(nameP);
        resultsDiv.append(openP);
        resultsDiv.append("<hr>");        
      }
      $("#resultsDiv").html(resultsDiv);
        console.log("Done")
    }); 
}

function renderMap(coord) {
  var latlng = coord.split(",")
  var coordLat = parseFloat(latlng[0])
  var coordLng = parseFloat(latlng[1])
  var coordCenter = {lat: coordLat, lng: coordLng};
  map = new google.maps.Map(document.getElementById('map'), {
    center: coordCenter,
    zoom: 15
  });
  // Pull gamesList from Firebase
  var gamesList;
  // Create marker for each game nearby
  for (var i = 0; i < gamesList.length; i++) {
    var coords = gamesList[i]
    var marker = new google.maps.Marker({
      position: coords,
      map: map
    });
  };
};

// Construct map in div #map
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 15
  });
}