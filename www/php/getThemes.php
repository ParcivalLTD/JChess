<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");

$dir = '../img/chesspieces/';
$folders = array_diff(scandir($dir), array('..', '.'));
echo json_encode(array_values($folders));