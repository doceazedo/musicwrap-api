<?php

class Router {
  function __construct() {
    if (isset($_SERVER['HTTPS']) && ($_SERVER['HTTPS'] == 'on' || $_SERVER['HTTPS'] == 1) || isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] == 'https') {
      $protocol = 'https://';
    } else {
      $protocol = 'http://';
    }
    $url = str_replace('\\', '/', $protocol . $_SERVER['HTTP_HOST'] . substr(getcwd(), strlen($_SERVER['DOCUMENT_ROOT'])));
    $url = explode('?', $url)[0];
    define('BASE_URL', $url);
    
    $request = explode('?', $_SERVER['REQUEST_URI'], 2)[0];
    $request = explode('/', $request);
    $this->request = [];
    foreach ($request as $req) {
      if (empty($req) || $req === CONFIG['dir']) continue;
      $this->request[] = $req;
    }
    if (empty($this->request)) {
      http_response_code(400);
      die();
    }
  }

  public function route($route) {
    $route = "src/routes/{$route}.php";
    if (!file_exists($route)) die("A página {$route} não existe.");
    require $route;
  }
}
