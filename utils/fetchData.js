const lastfm = require('./api/lastfm');
const deezer = require('./api/deezer');

module.exports = async (lastfm_user) => {
  const user_info = await lastfm({
    method: 'user.getinfo',
    user: lastfm_user,
  });

  const top_tracks = await lastfm({
    method: 'user.gettoptracks',
    user: lastfm_user,
    period: '7day',
    limit: 4
  });

  const data = {
    user_info: user_info.data.user,
    top_tracks: top_tracks.data.toptracks
  };

  data.user_info.image = user_info.data.user.image[user_info.data.user.image.length - 1]['#text'];
  data.user_info.registered = user_info.data.user.registered.unixtime;
  data.top_tracks.attr = top_tracks.data.toptracks['@attr'];

  for (const i in data.top_tracks.track) {
    const trackName = data.top_tracks.track[i].name;
    const artistName = data.top_tracks.track[i].artist.name;

    const search = await deezer('search', {
      q: `${artistName} ${trackName}`
    });

    if (!search.data.total) continue; // TODO: retornar um placeholder seria bom; melhor ainda seria acessar outra api pra maior disponibilidade
    data.top_tracks.track[i].image = search.data.data[0].album.cover_big;
  }

  return data;
}