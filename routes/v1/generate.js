const puppeteer = require('puppeteer-core');

const cheerio = require('cheerio');
const fs = require('fs');
const lastfm = require('../../utils/lastfm');

module.exports = async function routes (fastify, options) {
  fastify.post('/generate', async (request, reply) => {
    const layout = fs.readFileSync('./themes/_layout.html').toString();
    let theme = fs.readFileSync('./themes/classic.html').toString();

    // api
    const user_info = await lastfm({
      method: 'user.getinfo',
      user: request.query.user,
    });

    const top_tracks = await lastfm({
      method: 'user.gettoptracks',
      user: request.query.user,
      period: '7day',
      limit: 4
    });

    theme = theme
      .replace(/{{user.playcount}}/g, top_tracks.data.toptracks['@attr'].total)
      .replace(/{{user.avatar}}/g, user_info.data.user.image[3]['#text']);

    const $ = cheerio.load(layout);
    $('body').html(theme);

    const browser = await puppeteer.launch({
      executablePath: './bin/chrome-win/chrome.exe',
      headless: true
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1920 });
    
    await page.setContent($.html());
    await page.screenshot({ path: 'example.png' });
  
    await browser.close();

    return { hello: request.query };
  })
}