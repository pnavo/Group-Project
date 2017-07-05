
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
        console.log(results[i].opening_hours.open_now);
        nameP.append(results[i].name);
        openP.append(results[i].opening_hours.open_now);
        // photo.attr("src","")
        resultsDiv.append(nameP);
        // resultsDiv.append(openP);
        resultsDiv.append("<hr>");        
      }
      $("#resultsDiv").html(resultsDiv);

        console.log("Done")
    }); 
}

//create children in "game" object in firebase on click of "create" button
$('#create').on('click', function(event){
//pull the values from the create form
    //pull name val from HTML
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

//pull from "game" object in firebase when searching for a game
$('#search').on('click', function(event){ 
  database.ref('games').once("value", function (snapshot){
  var userEntry = $('<tr>');
  //create new variable to pull the value of the key/value from the Firebase snapshot
  var userName = snapshot.val().name;
  var userAddress = snapshot.val().address;
  var userStartTime = snapshot.val().startTime;
  var userEndTime = snapshot.val().endTime;
  //append the information pulled from the cloud to the new HTML row created above
  userEntry.append("<td>" + userName + "</td>");
  userEntry.append("<td>" + userAddress + "</td>");
  userEntry.append("<td>" + userStartTime + "</td>");
  userEntry.append("<td>" + userEndTime + "</td>");
  //append all of the user entries to the "train-entries" div
  $('#resultsDiv').append(userEntry);
  }); 
});