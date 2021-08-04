const puppeteer = require('puppeteer-core');
const handlebars = require('handlebars');
const cheerio = require('cheerio');
const fs = require('fs');
const lastfm = require('../../utils/lastfm');

module.exports = async function routes (fastify, options) {
  fastify.post('/generate', async (request, reply) => {
    const layout = fs.readFileSync('./themes/_layout.html').toString();
    let theme = fs.readFileSync('./themes/classic.html').toString();

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

    const template = handlebars.compile(theme);
    const data = {
      user_info: user_info.data.user,
      top_tracks: top_tracks.data.toptracks
    };

    // patch some shit
    data.user_info.image = user_info.data.user.image[user_info.data.user.image.length - 1]['#text'];
    data.user_info.registered = user_info.data.user.registered.unixtime;
    data.top_tracks.attr = top_tracks.data.toptracks['@attr'];

    // TODO: foreach nas tracks pra pegar imagem do deezer

    const $ = cheerio.load(layout);
    $('body').html(template(data));

    const browser = await puppeteer.launch({
      executablePath: './bin/chrome-win/chrome.exe',
      headless: true
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1920 });
    await page.setContent($.html());
    // await page.waitForNavigation();
    await page.screenshot({ path: 'example.png' });
  
    await browser.close();

    return { hello: request.query };
  })
}