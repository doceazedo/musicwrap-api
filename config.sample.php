<?php

$config = [
  'dir' => 'api', // Deixe em branco para raíz
  'lastfm_api_key' => 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX' // API key do last.fm (https://www.last.fm/api/accounts)
];

define('CONFIG', $config);
unset($config);