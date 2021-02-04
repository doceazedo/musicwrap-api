<?php

validate_request(['user']);

$last_fm = new Request('http://ws.audioscrobbler.com/2.0/', [
  'api_key' => CONFIG['lastfm_api_key'],
  'format' => 'json',
  'user' => REQUEST[0]
]);
$deezer = new Request('https://api.deezer.com/search/');

$user_info = $last_fm->get([
  'method' => 'user.getinfo'
]);

$top_tracks = $last_fm->get([
  'method' => 'user.gettoptracks',
  'period' => '7day',
  'limit' => 4
]);

$view_data = [
  'avatar' => proxy_url($user_info['user']['image'][3]['#text']),
  'playcount' => $top_tracks['toptracks']['@attr']['total']
];

foreach ($top_tracks['toptracks']['track'] as $track) {
  $title = $track['name'];
  $artist = $track['artist']['name'];
  $query = urlencode("{$artist} {$title}");
  
  $deezer_data = $deezer->get([
    'q' => $query
  ]);
  
  $view_data['tracks'][] = [
    'title' => $title,
    'artist' => $artist,
    'cover' => proxy_url($deezer_data['data'][0]['album']['cover_big'])
  ];
}

new Render('default', $view_data);