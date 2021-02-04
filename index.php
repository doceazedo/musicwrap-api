<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require 'vendor/autoload.php';

require 'config.php';
require 'functions.php';

require 'src/classes/Request.php';
require 'src/classes/Render.php';
require 'src/classes/Router.php';

$router = new Router();
$router->route($router->request[0]);