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
var address;
var radius;
var gameType;
var queryURL = cors + "https://maps.googleapis.com/maps/api/place/nearbysearch/json?query=" + coordinates + "&radius=" + radius + "&type=park&keyword=" + gameType + "&key=AIzaSyDPEkigjm2_zBLC8qVTcHkuHtFZNjSY3Zk";

//on click of find button
$('#find').on('click', function (event){
	event.preventDefault();
	//display the form for user to fill out
	$(".container").css("display", "inline");
	//pull up table with input fields
	// $('.container').slideToggle("slow");
	//create form with input fields
	// var addMember = $('<tr>');
	// var memberName = $('<tr>');
	// var memberAddress = $('<tr>');
	// var memberEmail = $('<tr>');
	// addMember.append(memberName);
	// addMember.append(memberAddress);
	// addMember.append(memberEmail);
	// $('#add-member').append(addMember);
});

//on click of submit button 
$('#submit').on('click', function(event){ 
	event.preventDefault();
	//pull value from input box
	address = $("#address").val().trim();
	//ajax call Google
  	$.ajax({
  		url: "https://maps.googleapis.com/maps/api/place/textsearch/json?query=" + address + "&key=AIzaSyDPEkigjm2_zBLC8qVTcHkuHtFZNjSY3Zk",
  		method: "GET"
  	}).done(function(response){
  		console.log(response);
  		console.log(response.results[0].geometry.location.lat + "," + response.results[0].geometry.location.lng);
		//convert geo location address to coordinates 
  		coordinates = response.results[0].geometry.location.lat + "," + response.results[0].geometry.location.lng;
  	});
		//pull information from firebase 

	//compare and see if there are games nearby
	//display the google maps 
});

//on click of join button
	//expand selection
	//push user info to firebase 
	//display message to confirm signup
		//have user input his or her email address to send them a confirmation and reminder email


//function game creation
	//pull values from form  
	//push the new object to firebase

