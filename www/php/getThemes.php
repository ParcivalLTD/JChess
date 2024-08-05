<?php
header("Access-Control-Allow-Origin: *");

$dir = '../img/chesspieces/';
$folders = array_diff(scandir($dir), array('..', '.'));
echo json_encode(array_values($folders));