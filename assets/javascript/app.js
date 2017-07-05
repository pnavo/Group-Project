
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


//on click of find button to search for games, form for user to fill out details is shown
$('#find').on('click', function (event){
  event.preventDefault();
  //display the form for user to fill out
  $(".container").css("display", "inline");
  //pull up table with input fields
  // $('.container').slideToggle("slow");
});

var cors = "https://cors-anywhere.herokuapp.com/";
var coordinates;
var queryURL;
// Default values
var address = "160 Spear St, San Francisco";
var radius = 5000;
var gameType = "Basketball+Court";

//on click of submit button to receive the coordinates of the user address
$("#submit").on("click",function(e){
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
    }); 
});

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
        console.log(results[i].opening_hours.open_now);
        nameP.append(results[i].name);
        openP.append(results[i].opening_hours.open_now);
        // photo.attr("src","")
        resultsDiv.append(nameP);
        // resultsDiv.append(openP);
        resultsDiv.append("<hr>");        
      }
      $("#resultsDiv").html(resultsDiv);
      console.log("Done");
    }); 
};

