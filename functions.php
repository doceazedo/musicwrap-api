<?php

function validate_request($req) {
  global $router;
  array_shift($router->request);
  if (count($router->request) !== count($req)) {
    http_response_code(400);
    die();
  }

  // $requests = [];
  // foreach ($req as $request) {
  //   $request[$request] = $router->request[]
  // }

  define('REQUEST', $router->request);
}

function proxy_url($url) {
  return BASE_URL . '/proxy/' . base64_encode($url);
}