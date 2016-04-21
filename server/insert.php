<?php
header('Access-Control-Allow-Origin: *'); 
$link = mysqli_connect("mysqlsvr37.world4you.com", "sql7932275", "57zfz+a", "7932275db4");
 
// Check connection
if($link === false){
    die("ERROR: Could not connect. " . mysqli_connect_error());
}

if(isset($_POST['path'])) {
    $path = $_POST['path'];
    $pathId = $_POST['pathID'];
    $userId = $_POST['userID'];
  } else {


  }

$sql = "INSERT INTO geomap (userID, pathID, path) VALUES ('$userId', '$pathId', '$path')";

if(mysqli_query($link, $sql)){
    echo "Records added successfully.";
} else{
    echo "ERROR: Could not able to execute $sql. " . mysqli_error($link);
}
 
// close connection
mysqli_close($link);
?>
		