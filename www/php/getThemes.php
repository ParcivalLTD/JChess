<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");

// Directory path where the chess piece images are stored
$dir = 'img/chesspieces/';

// Get all the folders in the directory, excluding '.' and '..'
$folders = array_diff(scandir($dir), array('..', '.'));

// Encode the folder names as JSON and echo the result
echo json_encode(array_values($folders));