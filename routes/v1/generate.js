const puppeteer = require('puppeteer');
const handlebars = require('handlebars');
const cheerio = require('cheerio');
const fs = require('fs');
const createError = require('http-errors');
const fetchData = require('../../utils/fetchData');

module.exports = async function (fastify, options) {
  const schema = {
    querystring: {
      type: 'object',
      required: ['username', 'theme'],
      properties: {
        username:  { type: 'string' },
        theme: { type: 'string' },
      },
    }
  };

  fastify.get('/generate', { schema }, async (request, reply) => {
    const themePath = `./themes/${request.query.theme}.handlebars`;

    if (!fs.existsSync(themePath)) {
      reply.send(createError(400, 'The specified theme doesn\'t exist'));
      return;
    }

    const layout = fs.readFileSync('./themes/_layout.html').toString();
    let theme = fs.readFileSync('./themes/classic.handlebars').toString();

    const template = handlebars.compile(theme);
    const data = await fetchData(request.query.username);

    if (data.error) {
      reply.send(createError(500, data.error));
      return;
    }

    const $ = cheerio.load(layout);
    $('body').html(template(data));

    const browser = await puppeteer.launch({
      args: [
        '--incognito',
        '--no-sandbox',
        '--single-process',
        '--no-zygote'
      ],
      headless: true,
      ignoreHTTPSErrors: true,
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