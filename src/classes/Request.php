<?php

class Request {
  function __construct($url = '', $params = []) {
    $this->url = $url . '?';

    if (count($params) > 0) {
      $params = http_build_query($params);
      $this->url .= $params . '&';
    }
  }

  function get($params = []) {
    $params = http_build_query($params);
    return json_decode(file_get_contents($this->url . $params), true);
  }
}