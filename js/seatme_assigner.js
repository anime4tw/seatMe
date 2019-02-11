// Project
// 

var data;
var dataRoom;

data = '{"width":7,"height":5,"objects":[{"type":"seat","isActive":true,"cornerX":"0","cornerY":"25","w":100,"h":50,"rotation":0},{"type":"seat","isActive":true,"cornerX":"100","cornerY":"25","w":100,"h":50,"rotation":0},{"type":"seat","isActive":true,"cornerX":"200","cornerY":"25","w":100,"h":50,"rotation":0},{"type":"seat","isActive":true,"cornerX":"300","cornerY":"25","w":100,"h":50,"rotation":0},{"type":"seat","isActive":true,"cornerX":"400","cornerY":"25","w":100,"h":50,"rotation":0},{"type":"seat","isActive":true,"cornerX":"0","cornerY":"75","w":100,"h":50,"rotation":0},{"type":"seat","isActive":true,"cornerX":"100","cornerY":"75","w":100,"h":50,"rotation":0},{"type":"seat","isActive":true,"cornerX":"200","cornerY":"75","w":100,"h":50,"rotation":0},{"type":"seat","isActive":true,"cornerX":"300","cornerY":"75","w":100,"h":50,"rotation":0},{"type":"seat","isActive":true,"cornerX":"400","cornerY":"75","w":100,"h":50,"rotation":0},{"type":"seat","isActive":true,"cornerX":"0","cornerY":"175","w":100,"h":50,"rotation":0},{"type":"seat","isActive":true,"cornerX":"100","cornerY":"175","w":100,"h":50,"rotation":0},{"type":"seat","isActive":true,"cornerX":"200","cornerY":"175","w":100,"h":50,"rotation":0},{"type":"seat","isActive":true,"cornerX":"300","cornerY":"175","w":100,"h":50,"rotation":0},{"type":"seat","isActive":true,"cornerX":"400","cornerY":"175","w":100,"h":50,"rotation":0},{"type":"seat","isActive":true,"cornerX":"400","cornerY":"225","w":100,"h":50,"rotation":0},{"type":"seat","isActive":true,"cornerX":"300","cornerY":"225","w":100,"h":50,"rotation":0},{"type":"seat","isActive":true,"cornerX":"200","cornerY":"225","w":100,"h":50,"rotation":0},{"type":"seat","isActive":true,"cornerX":"100","cornerY":"225","w":100,"h":50,"rotation":0},{"type":"seat","isActive":true,"cornerX":"0","cornerY":"225","w":100,"h":50,"rotation":0},{"type":"seat","isActive":true,"cornerX":"0","cornerY":"325","w":100,"h":50,"rotation":0},{"type":"seat","isActive":true,"cornerX":"100","cornerY":"325","w":100,"h":50,"rotation":0},{"type":"seat","isActive":true,"cornerX":"200","cornerY":"325","w":100,"h":50,"rotation":0},{"type":"seat","isActive":true,"cornerX":"300","cornerY":"325","w":100,"h":50,"rotation":0},{"type":"seat","isActive":true,"cornerX":"400","cornerY":"325","w":100,"h":50,"rotation":0},{"type":"seat","isActive":true,"cornerX":"400","cornerY":"375","w":100,"h":50,"rotation":0},{"type":"seat","isActive":true,"cornerX":"300","cornerY":"375","w":100,"h":50,"rotation":0},{"type":"seat","isActive":true,"cornerX":"200","cornerY":"375","w":100,"h":50,"rotation":0},{"type":"seat","isActive":true,"cornerX":"100","cornerY":"375","w":100,"h":50,"rotation":0},{"type":"seat","isActive":true,"cornerX":"0","cornerY":"375","w":100,"h":50,"rotation":0},{"type":"seat","isActive":true,"cornerX":"0","cornerY":"450","w":100,"h":50,"rotation":0},{"type":"seat","isActive":true,"cornerX":"100","cornerY":"450","w":100,"h":50,"rotation":0},{"type":"seat","isActive":true,"cornerX":"200","cornerY":"450","w":100,"h":50,"rotation":0},{"type":"seat","isActive":true,"cornerX":"300","cornerY":"450","w":100,"h":50,"rotation":0},{"type":"seat","isActive":true,"cornerX":"400","cornerY":"450","w":100,"h":50,"rotation":0},{"type":"seat","isActive":true,"cornerX":"500","cornerY":"25","w":100,"h":50,"rotation":0},{"type":"seat","isActive":true,"cornerX":"500","cornerY":"75","w":100,"h":50,"rotation":0},{"type":"seat","isActive":true,"cornerX":"500","cornerY":"175","w":100,"h":50,"rotation":0},{"type":"seat","isActive":true,"cornerX":"500","cornerY":"225","w":100,"h":50,"rotation":0},{"type":"seat","isActive":true,"cornerX":"500","cornerY":"325","w":100,"h":50,"rotation":0},{"type":"seat","isActive":true,"cornerX":"500","cornerY":"375","w":100,"h":50,"rotation":0},{"type":"door","isActive":true,"cornerX":"550","cornerY":"475","w":100,"h":25,"rotation":0},{"type":"whiteBoard","isActive":true,"cornerX":"675","cornerY":"100","w":25,"h":200,"rotation":90}]}'
dataRoom = JSON.parse(data);

window.onload = function () {
	getLocations();
	setup();
};


// Useful for selecting elements by ID
function _(id) {
	return document.getElementById(id);
}

// Event Listeners
function setup() {
	_("institutions").addEventListener("change", function () {
		populateRoom();
	});
	_("rooms").addEventListener("change", function () {
		//Get from Server
		// loadRoom();

		//Convert to JSON - always assigned to dataRoom
		JSON.parse(dataRoom);
	});
	_("assign").addEventListener("click", function() {
		convertList(_("inputStudents"));
		resetSeats();
		assignStudents();
	});
}

var seats = [];

function drawRoom() {
	_("drawRoom").setAttribute("style", "width:" + dataRoom.width * 100 + "px;height:" + dataRoom.height * 100 + "px;");
	for (var object = 0; object < dataRoom.objects.length; object++) {
		var currentObject;
		currentObject = new RoomObject(object, dataRoom.objects[object].type, dataRoom.objects[object].isActive, dataRoom.objects[object].cornerX, dataRoom.objects[object].cornerY, dataRoom.objects[object].w, dataRoom.objects[object].h, dataRoom.objects[object].rotation);
		var cnv = _("drawRoom");
		currentObject.draw(cnv);
		// Pushes all active seats to the array
		if (currentObject.type == "seat" && currentObject.isActive === true) {
			seats.push(currentObject);
		}
	}
}

// THIS IS FOR TESTING
// THIS IS FOR TESTING
// REMOVE AFTER DATABASE WORKS, AND PARSE DATA FROM THERE DYNAMICALLY
drawRoom();
//
//
//

function RoomObject(id, type, isActive, x, y, w, h, rotation) {
	this.type = type;
	this.isActive = isActive;
	this.x = parseInt(x);
	this.y = parseInt(y);
	this.w = parseInt(w);
	this.h = parseInt(h);
	this.rotation = rotation;
	this.id = id;
	// additional parameters
	this.assigned = false;
	this.draw = function(placeToDraw) {
		//create a new div, append to *variable*
		this.element = document.createElement("div");
		this.element.className = this.type + " active" + this.isActive;
		this.element.style.position = "absolute";
		this.element.style.left = this.x + "px";
		this.element.style.top = this.y + "px";
		this.element.style.width = this.w + "px";
		this.element.style.height = this.h + "px";
		this.element.id = this.id;
		placeToDraw.appendChild(this.element);
	};
	
}

var studentList;
function convertList(list) {
	studentList = list.value.replace(/\r\n/g,"\n").split("\n");
}
function resetSeats() {
	for (var seat=0; seat < seats.length; seat++) {
		_(seats[seat].id).innerHTML = "";
		seats[seat].assigned = false;
		_(seats[seat].id).classList.remove("assigned");
	}
}

function assignStudents() {
	for (var student = 0; student < studentList.length; student++) {
		// for every student on the list, assign it to a random seat, and remove the seat from the list of available seats
		// create text in the div; a number and the name.
		// make the number visible; then on hover make it not visible.
		// make the name not visible; then on hover make it visible.
		var currentStudent = studentList[student];
		var randomSeat = randomInt(0,seats.length-1);
		var div = _(seats[randomSeat].id);
		if (seats[randomSeat].assigned === false) {
			var currentSeat = seats[randomSeat];
			currentSeat.assigned = true;
		}
		else {
			student--;
			continue;
		}
		div.innerHTML = currentSeat.id + currentStudent;
		div.classList.add("assigned");
	}
}


function randomInt(min,max) {
	return Math.floor(Math.random() * (max-min+1) +min);
}
/*
 *****************************************
 ***** LOCATION AND ROOM SELECTS 
 *****************************************
 */

var institutionsSelect = _("institutions");
var roomsSelect = _("rooms");

// Get the JSON containing all locations and the rooms for each location, and populate the Location select
function getLocations() {

	var xhr = new XMLHttpRequest();
	xhr.open("GET", "http://www.seatme.mayconcsantos.com/storeData.php");
	xhr.onload = function () {
		if (xhr.status === 200) {
			dataInstitutions = xhr.responseText;
			jsonInstitutions = JSON.parse(dataInstitutions);

			// Populate the Location select
			for (var key in jsonInstitutions.institutions) {
				var option = document.createElement("option");
				option.text = jsonInstitutions.institutions[key].name;
				option.value = jsonInstitutions.institutions[key].id;
				institutionsSelect.add(option);
			}

			// Populate the Room select
			populateRoom();
		} else {
			alert("Request failed.  Returned status of " + xhr.status);
		}
	};
	xhr.send();

}

// Populate the Room select
function populateRoom() {

	// Clean select and add the first option
	roomsSelect.options.length = 0;

	// Populate the room select
	for (var key in jsonInstitutions.institutions) {

		if (jsonInstitutions.institutions[key].id == institutionsSelect.value) {

			// Check if rooms array is empty
			if (jsonInstitutions.institutions[key].rooms.length == 0) {
				var option = document.createElement("option");
				option.text = "There is no room available for the selected instituition";
				roomsSelect.add(option);
			}

			// If not, populate the room select
			else {
				var option = document.createElement("option");
				option.text = "Select a room";
				roomsSelect.add(option);

				for (var room in jsonInstitutions.institutions[key].rooms) {
					var option = document.createElement("option");
					option.text = jsonInstitutions.institutions[key].rooms[room].name;
					option.value = jsonInstitutions.institutions[key].rooms[room].id;
					roomsSelect.add(option);
				}
			}
		}
	}

}

// Get the JSON containing the room properties and objects
function loadRoom() {

	// Request the server only if the room is selected
	if (roomsSelect.value != "") {
		var xhr = new XMLHttpRequest();

		// Request the JSON using the value of the room select
		xhr.open("GET", "http://www.seatme.mayconcsantos.com/storeData.php?getJsonByRoomId=" + roomsSelect.value);

		xhr.onload = function () {
			if (xhr.status === 200) {

				// dataRoom variable contains the JSON with properties and objects of the room
				dataRoom = xhr.responseText;

				//console.log(dataRoom);

				//document.getElementById("json-content").innerHTML = "<pre>" + dataRoom + "</pre>";
			} else {
				alert("Request failed.  Returned status of " + xhr.status);
			}
		};
		xhr.send();
	}
}