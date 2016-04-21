<?php
//header('Content-Type: application/json');
/* Attempt MySQL server connection. Assuming you are running MySQL
server with default setting (user 'root' with no password) */
$link = mysqli_connect("mysqlsvr37.world4you.com", "sql7932275", "57zfz+a", "7932275db4");
 
// Check connection
if($link === false){
    die("ERROR: Could not connect. " . mysqli_connect_error());
}

if(isset($_POST['path'])) {
    $path = $_POST['path'];
    $pathId = $_POST['pathID'];
    $userId = $_POST['userID'];
    //var_dump(json_decode($path, true));
    //var_dump(json_decode($pathId, true));
    //var_dump(json_decode($userId, true));
  } else {

  }

//// Escape user inputs for security
//    $userId=$_POST['userID'];
//    $pathId=$_POST['pathID'];
//    $pathCords=$_POST['path'];
// 
// attempt insert query execution
//$sql = "INSERT INTO geomap (userID, pathID, path) VALUES ('$userId', '$pathId', '$pathCords')";
//$sql = "INSERT INTO geomap (path) VALUES ('$path')";
$sql = "INSERT INTO geomap (userID, pathID, path) VALUES ('$userId', '$pathId', '$path')";

if(mysqli_query($link, $sql)){
    echo "Records added successfully.";
} else{
    echo "ERROR: Could not able to execute $sql. " . mysqli_error($link);
}
 
// close connection
mysqli_close($link);
?>
		