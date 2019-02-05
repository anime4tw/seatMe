<?php header('Access-Control-Allow-Origin: *'); ?>

<?php	
	function getInstitutions(){
		$conn = newConnection();
		$sql = "SELECT id, name FROM institution";
		
		$result = $conn->query($sql);
		
		if ($result->num_rows > 0) {
			$response = '{"institutions":[';
			for($cont = 0;$row = $result->fetch_assoc();$cont++) {
				if($cont != 0){
					$response .= ',';
				}
				$response .= '{"id":'.$row['id'].',"name":"'.$row['name'].'",'.getRoomsByInstitutionId($row['id']).'}';
			}
			$response .= ']}';
		} else {
			$response=null;
		}
						
		closeConnection($conn);
		return $response;
	}
	function getInstitutionNameById($id){
		$conn = newConnection();
		$sql = "SELECT name FROM institution WHERE id=".$id;
		
		$result = $conn->query($sql);
		
		if ($result->num_rows > 0) {
			while($row = $result->fetch_assoc()) {
				$name = $row["name"];
			}
		} else {
			$name="";
		}		
					
		closeConnection($conn);
		return $name;
	}
	function getRoomsByInstitutionId($id){
		$conn = newConnection();
		$sql = "SELECT id, name FROM room WHERE id_institution =".$id;
		
		$result = $conn->query($sql);
		
		if ($result->num_rows > 0) {
			$response = '"rooms":[';			
			for($cont = 0;$row = $result->fetch_assoc();$cont++) {
				if($cont != 0){
					$response .= ',';
				}
				$response .= '{"id":'.$row['id'].',"name":"'.$row['name'].'"}';
				
			}
			$response .= ']';
		} else {
			$response='"rooms":[]';
		}
						
		closeConnection($conn);
		return $response;
	}
	
	function getJsonByRoomId($roomId){
		$conn = newConnection();
		$sql = "SELECT json FROM room WHERE id=".$roomId;
		$result = $conn->query($sql);
		
		if ($result->num_rows > 0) {
			while($row = $result->fetch_assoc()) {
				$json = $row["json"];
			}
		} else {
			$json="";
		}
						
		closeConnection($conn);
		return $json;
	}

	function insertRoom($nameRoom, $idInstitution, $json){
		$conn = newConnection();
		
		$query = "INSERT INTO room (name, id_institution, json)
			VALUES ('$nameRoom', $idInstitution, '$json')";

		$nameInstitution = getInstitutionNameById($idInstitution);
		if ($conn->query($query) === TRUE) {
		$message = 'The room '.$nameRoom.' was created successfully at '.$nameInstitution;
		} else {						
			if(substr($conn->error, 0, 15) == "Duplicate entry"){				
				$message = 'The room '.$nameRoom.' already exists at '.$nameInstitution;	
			}
			else{
				$message = 'An error occurred while creating your room, please try again';
			}			
		}
		closeConnection($conn);
		return $message;
	}
	
	function updateRoom($id, $json){
		$conn = newConnection();
				
		if($id != null){
			$query = "UPDATE room SET json='$json' WHERE id='$id'";
	
			if ($conn->query($query) === TRUE) {
				closeConnection($conn);
				$message = 'Room updated successfully';
			} else {
				closeConnection($conn);
				$message = 'An error occurred while updating your room, please try again';			
			}
		}else{
			$message = 'You need select a room to update';
		}
		
		closeConnection($conn);
		return $message;
	}
	
	function newConnection(){		
		//Langara's Server
		$servername = "localhost";
		$username = "mcam_seatme";
		$password = "Seatme2017";
		$dbname = "mcam_seatme";		
		
		/*
		//Maycon's Server
		$servername = "localhost";
		$username = "mmsitesc_seatme";
		$password = "@Seatme2017";
		$dbname = "mmsitesc_seatme";
		*/
		$conn = new mysqli($servername, $username, $password, $dbname);
	
		if ($conn->connect_error) {
			die("Connection failed: " . $conn->connect_error);
		}else{
			return $conn;
		}
	}
	
	function closeConnection($conn){
		$conn->close();
	}

	if ($_GET["getJsonByRoomId"]) {
		echo getJsonByRoomId($_GET["getJsonByRoomId"]);
	} 
	else{
		getInstitutions();
	}


?>