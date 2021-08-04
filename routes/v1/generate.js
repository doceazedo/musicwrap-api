const puppeteer = require('puppeteer-core');
const handlebars = require('handlebars');
const cheerio = require('cheerio');
const fs = require('fs');
const fetchData = require('../../utils/fetchData');

module.exports = async function routes (fastify, options) {
  fastify.get('/generate', async (request, reply) => {
    const layout = fs.readFileSync('./themes/_layout.html').toString();
    let theme = fs.readFileSync('./themes/classic.handlebars').toString();

    const template = handlebars.compile(theme);
    const data = await fetchData(request.query.user);

    const $ = cheerio.load(layout);
    $('body').html(template(data));

    const browser = await puppeteer.launch({
      executablePath: './bin/chrome-win/chrome.exe',
      headless: true
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1920 });
    await page.setContent($.html());
    const image = await page.screenshot();
  
    await browser.close();

    reply.type('image/png');
    reply.send(image);
  })
}