/**
 * ***** LOCATION AND ROOM SELECTS *****
 */



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
				option.text =
					"There is no room available for the selected instituition";
				roomsSelect.add(option);
			} else {
				// If not, populate the room select
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
		xhr.open(
			"GET",
			"http://www.seatme.mayconcsantos.com/storeData.php?getJsonByRoomId=" +
			roomsSelect.value
		);

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