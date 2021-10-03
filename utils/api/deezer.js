const axios = require('axios');

module.exports = async (method, params) => {
  return await axios.get(`https://api.deezer.com/${method}`, {
    params
  });
}