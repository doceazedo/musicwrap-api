<?php

require 'vendor/autoload.php';

require 'config.php';
require 'functions.php';

require 'src/classes/Request.php';
require 'src/classes/Render.php';
require 'src/classes/Router.php';

$router = new Router();
$router->route($router->request[0]);