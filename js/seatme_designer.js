// Project
// 
var roomWidth = 7;
var roomHeight = 5;
var selectedObject;
var cellSize = 25;

// Used to control when an object can be created. Prevent overlay of objects.
var overlay = false;

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
		loadRoom();
	});
	_("widthLess").addEventListener("click", function () {
		changeRoomSize("w-");
	});
	_("widthMore").addEventListener("click", function () {
		changeRoomSize("w+");
	});
	_("heightLess").addEventListener("click", function () {
		changeRoomSize("h-");
	});
	_("heightMore").addEventListener("click", function () {
		changeRoomSize("h+");
	});
	_("toolSeatHorizontal").addEventListener("click", function () {
		selectObject(event, "horizontalSeat");
	});
	_("toolSeatVertical").addEventListener("click", function () {
		selectObject(event, "verticalSeat");
	});
	_("toolDoorHorizontal").addEventListener("click", function () {
		selectObject(event, "horizontalDoor");
	});
	_("toolDoorVertical").addEventListener("click", function () {
		selectObject(event, "verticalDoor");
	});
	_("toolWhiteBoardHorizontal").addEventListener("click", function () {
		selectObject(event, "horizontalWhiteBoard");
	});
	_("toolWhiteBoardVertical").addEventListener("click", function () {
		selectObject(event, "verticalWhiteBoard");
	});
	_("generateJSON").addEventListener("click", function () {
		generateJson();
	});
	_("drawingBox").addEventListener("click", function () {
		createObject(event);
	});
	_("drawingBox").addEventListener("drop", function () {
		drop(event);
	});
	_("drawingBox").addEventListener("dragover", function () {
		allowDrop(event);
	});
}

function drawBox(roomWidth, roomHeight) {
	_("drawingBox").setAttribute(
		"style",
		"width:" + roomWidth * 100 + "px;height:" + roomHeight * 100 + "px;"
	);

	//clear all lines, necessary to redraw the box
	[].forEach.call(document.querySelectorAll(".referenceLine"), function (e) {
		e.parentNode.removeChild(e);
	});

	// Horizontal reference lines
	for (var i = cellSize; i < roomHeight * 100; i += cellSize) {
		var line = document.createElement("div");
		line.style.borderBottom = "1px dashed #BBBBFF";
		line.style.height = cellSize - 1 + "px";
		line.style.width = roomWidth * 100 + "px";
		line.className = "referenceLine";
		line.style.backgroundColor = "transparent";

		_("drawingBox").appendChild(line);
	}

	// Vertical reference lines
	for (var i = cellSize; i < roomWidth * 100; i += cellSize) {
		var line = document.createElement("div");
		line.style.borderLeft = "1px dashed #BBBBFF";
		line.style.width = cellSize - 1 + "24";
		line.style.height = roomHeight * 100 + "px";
		line.className = "referenceLine";
		line.style.top = "0px";
		line.style.position = "absolute";
		line.style.left = i + "px";
		line.style.backgroundColor = "transparent";
		_("drawingBox").appendChild(line);
	}

	_("boxWidth").value = roomWidth;
	_("boxHeight").value = roomHeight;

	// Remove objects if they are outside of the drawing area
	var objects = document.querySelectorAll(".object");
	Array.prototype.forEach.call(objects, function (element, index) {
		var objX = element.style.left;
		var objY = element.style.top;
		var objW = element.style.width;
		var objH = element.style.height;

		if (
			parseInt(objX.substring(0, objX.length - 2)) +
			parseInt(objW.substring(0, objW.length - 2)) >
			roomWidth * 100
		) {
			_("drawingBox").removeChild(element);
		} else if (
			parseInt(objY.substring(0, objY.length - 2)) +
			parseInt(objH.substring(0, objH.length - 2)) >
			roomHeight * 100
		) {
			_("drawingBox").removeChild(element);
		}
	});
}

function changeRoomSize(command) {
	switch (command) {
		case "w-":
			roomWidth -= 0.25;
			break;
		case "w+":
			roomWidth += 0.25;
			break;
		case "h-":
			roomHeight -= 0.25;
			break;
		case "h+":
			roomHeight += 0.25;
			break;
	}

	stickToWall();

	drawBox(roomWidth, roomHeight);


}

function stickToWall() {
	var objects = Array.prototype.slice.call(document.getElementsByClassName("object door")).concat(Array.prototype.slice.call(document.getElementsByClassName("object whiteBoard")));
	for (var i = 0; i < objects.length; i++) {
		var element = objects[i];
		var objW = element.style.width;
		var objH = element.style.height;
		if (parseInt(objW.substring(0, objW.length - 2)) > parseInt(objH.substring(0, objH.length - 2))) {
			element.style.top = ((roomHeight * 100) - parseInt(objH.substring(0, objH.length - 2))) + "px";
		} else {
			element.style.left = ((roomWidth * 100) - parseInt(objW.substring(0, objW.length - 2))) + "px";
		}
	}
}

function selectObject(evt, type) {
	if (selectedObject == evt.target) {
		selectedObject.classList.toggle("selected");
		selectedObject = false;
	} else if (selectedObject) {
		selectedObject.classList.toggle("selected");
		selectedObject = evt.target;
		selectedObject.classList.toggle("selected");
	} else {
		selectedObject = evt.target;
		selectedObject.classList.toggle("selected");
	}
}

function createObject(evt) {

	if (!overlay) {
		var rect = evt.currentTarget.getBoundingClientRect(),
			offsetX = evt.clientX - rect.left,
			offsetY = evt.clientY - rect.top;

		if (selectedObject) {
			if ((Math.floor((offsetX) / cellSize) * cellSize <= (roomWidth * 100) - parseInt(window.getComputedStyle(selectedObject, null).getPropertyValue("width"))) &&
				(Math.floor((offsetY) / cellSize) * cellSize <= (roomHeight * 100) - parseInt(window.getComputedStyle(selectedObject, null).getPropertyValue("height")))) {
				switch (selectedObject.className.split(" ")[0]) {
					case "seat":
						drawObject(
							Math.floor(offsetX / cellSize) * cellSize,
							Math.floor(offsetY / cellSize) * cellSize,
							"seat"
						);
						break;
					case "door":
						drawObject(
							Math.floor(offsetX / cellSize) * cellSize,
							Math.floor(offsetY / cellSize) * cellSize,
							"door"
						);
						break;
					case "whiteBoard":
						drawObject(
							Math.floor(offsetX / cellSize) * cellSize,
							Math.floor(offsetY / cellSize) * cellSize,
							"whiteboard"
						);
						break;
				}
			}
		}
	}
	overlay = false;
}

function drawObject(x, y, objectType, obj = selectedObject) {
	var objW = parseInt(
		window.getComputedStyle(obj, null).getPropertyValue("width")
	);
	var objH = parseInt(
		window.getComputedStyle(obj, null).getPropertyValue("height")
	);

	var object = document.createElement("div");

	if (objectType == "seat") {
		if (objW > objH) {
			object.style.width = "100px";
			object.style.height = "50px";
		} else {
			object.style.width = "50px";
			object.style.height = "100px";
		}
		object.className += "seat object";
	} else if (objectType == "door") {
		if (objW > objH) {
			object.style.width = "100px";
			object.style.height = "25px";
		} else {
			object.style.width = "25px";
			object.style.height = "100px";
		}
		object.className += "door object";
	} else if (objectType == "whiteboard") {
		if (objW > objH) {
			object.style.width = "200px";
			object.style.height = "25px";
		} else {
			object.style.width = "25px";
			object.style.height = "200px";
		}
		object.className += "whiteBoard object";
	}

	object.style.position = "absolute";
	object.style.left = x + "px;";
	object.style.top = y + "px;";
	object.draggable = "true";

	object.addEventListener("dragstart", function (e) {
		drag(event);
	});

	object.addEventListener("mousedown", function (e) {
		diffX = e.offsetX;
		diffY = e.offsetY;
	});

	// Remove element on right click
	object.addEventListener("contextmenu", function (e) {
		e.preventDefault();
		_("drawingBox").removeChild(this);
	});

	object.addEventListener("click", function (e) {
		overlay = true;
	});

	// z-index is necessary, otherwise the reference lines are drawn over the objects each time the user expands or reduce the drawing box
	object.style.zIndex = "100";

	_("drawingBox").appendChild(object);

	stickToWall();
}

var dragElement;

function allowDrop(evt) {
	evt.preventDefault();
}

function drag(evt) {
	dragElement = evt.target;
}

function drop(evt) {
	evt.preventDefault();

	var rect = evt.currentTarget.getBoundingClientRect(),
		offsetX = evt.clientX - rect.left,
		offsetY = evt.clientY - rect.top;

	//drawSeat(Math.floor((offsetX - diffX) / cellSize) * cellSize, Math.floor((offsetY - diffY) / cellSize) * cellSize, "h");

	switch (dragElement.className.split(" ")[0]) {
		case "seat":
			drawObject(
				Math.floor((offsetX - diffX) / cellSize) * cellSize,
				Math.floor((offsetY - diffY) / cellSize) * cellSize,
				"seat",
				dragElement
			);
			break;
		case "door":
			drawObject(
				Math.floor((offsetX - diffX) / cellSize) * cellSize,
				Math.floor((offsetY - diffY) / cellSize) * cellSize,
				"door",
				dragElement
			);
			break;
		case "whiteBoard":
			drawObject(
				Math.floor((offsetX - diffX) / cellSize) * cellSize,
				Math.floor((offsetY - diffY) / cellSize) * cellSize,
				"whiteboard",
				dragElement
			);
			break;
	}

	_("drawingBox").removeChild(dragElement);
}

function generateJson() {
	var objects = document.querySelectorAll(".object");

	var roomName = "";

	if (_("rooms").options.length) {
		roomName = _("rooms").options[_("rooms").selectedIndex].text;
	}

	var jsonStr = "{\"width\":" + roomWidth + ",\"height\":" + roomHeight + ",\"objects\":[]}";

	var json = JSON.parse(jsonStr);

	Array.prototype.forEach.call(objects, function (element, index) {
		var objX = element.style.left;
		var objY = element.style.top;
		var objW = element.style.width;
		var objH = element.style.height;

		var objectType = element.className.split(" ")[0];

		var rotation;

		if (
			parseInt(objW.substring(0, objW.length - 2)) >
			parseInt(objH.substring(0, objH.length - 2))
		) {
			rotation = 0;
		} else {
			rotation = 90;
		}

		json["objects"].push({
			type: objectType,
			isActive: true,
			cornerX: objX.substring(0, objX.length - 2),
			cornerY: objY.substring(0, objY.length - 2),
			w: parseInt(objW.substring(0, objW.length - 2)),
			h: parseInt(objH.substring(0, objH.length - 2)),
			rotation: rotation
		});
	});

	jsonStr = JSON.stringify(json);
	console.log(jsonStr);
	alert(jsonStr);
}

// Assign event handler to size inputs
for (
	var i = 0; i < document.getElementsByClassName("inputBoxSize").length; i++
) {
	document
		.getElementsByClassName("inputBoxSize")[i].addEventListener("focusout", function (e) {
			roomWidth = +_("boxWidth").value;
			roomHeight = +_("boxHeight").value;
			drawBox(roomWidth, roomHeight);
			stickToWall();
		});
}

drawBox(roomWidth, roomHeight);

/**
 * ***** LOCATION AND ROOM SELECTS *****
 */

var institutionsSelect = _("institutions");
var roomsSelect = _("rooms");

// Get the JSON containing all locations and the rooms for each location, and populate the Location select
function getLocations() {

	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'http://www.seatme.mayconcsantos.com/storeData.php');
	xhr.onload = function () {
		if (xhr.status === 200) {
			data_institutions = xhr.responseText;
			json_institutions = JSON.parse(data_institutions);

			// Populate the Location select
			for (var key in json_institutions.institutions) {
				var option = document.createElement("option");
				option.text = json_institutions.institutions[key].name;
				option.value = json_institutions.institutions[key].id;
				institutionsSelect.add(option);
			}

			// Populate the Room select
			populateRoom();
		} else {
			alert('Request failed.  Returned status of ' + xhr.status);
		}
	};
	xhr.send();

}

// Populate the Room select
function populateRoom() {

	// Clean select and add the first option
	roomsSelect.options.length = 0;

	// Populate the room select
	for (var key in json_institutions.institutions) {

		if (json_institutions.institutions[key].id == institutionsSelect.value) {

			// Check if rooms array is empty
			if (json_institutions.institutions[key].rooms.length == 0) {
				var option = document.createElement("option");
				option.text = "There is no room available for the selected instituition";
				roomsSelect.add(option);
			}

			// If not, populate the room select
			else {
				var option = document.createElement("option");
				option.text = "Select a room";
				roomsSelect.add(option);

				for (var room in json_institutions.institutions[key].rooms) {
					var option = document.createElement("option");
					option.text = json_institutions.institutions[key].rooms[room].name;
					option.value = json_institutions.institutions[key].rooms[room].id;
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
		xhr.open('GET', 'http://www.seatme.mayconcsantos.com/storeData.php?getJsonByRoomId=' + roomsSelect.value);

		xhr.onload = function () {
			if (xhr.status === 200) {

				// data_room variable contains the JSON with properties and objects of the room
				data_room = xhr.responseText;

				//console.log(data_room);

				//document.getElementById("json-content").innerHTML = "<pre>" + data_room + "</pre>";
			} else {
				alert('Request failed.  Returned status of ' + xhr.status);
			}
		};
		xhr.send();
	}
}