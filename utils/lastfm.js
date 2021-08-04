const axios = require('axios');
require('dotenv').config();

module.exports = async (params) => {
  return await axios.get('http://ws.audioscrobbler.com/2.0/', {
    params: {
      api_key: process.env.LASTFM_API_KEY,
      format: 'json',
      ...params
    }
  });
}