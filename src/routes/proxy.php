<?php

validate_request(['url']);

$url = base64_decode(REQUEST[0]);
$img = getimagesize($url);

if (empty($img)) {
  $url = BASE_URL . '/public/img/cover.png';
  $img = getimagesize($url);
}

header("Content-type: {$img['mime']}");
readfile($url);