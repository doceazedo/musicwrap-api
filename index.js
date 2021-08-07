const fastify = require('fastify')({
  logger: true
});
const getFiles = require('./utils/getFiles');

(async () => {
  fastify.register(require('fastify-cors'), { origin: "*" });

  for await (const file of getFiles('./routes')) {
    if (!file.endsWith('.js')) continue;
    fastify.register(require(file), { prefix: '/v1' });
  }

  global.themes = [];
  for await (const file of getFiles('./themes')) {
    let theme = file.replace(/\\/g, '/').split('/');
    theme = theme[theme.length - 1];

    if (theme.startsWith('_')) continue;
    theme = theme.split('.')[0];
    global.themes.push(theme);
  }

  try {
    await fastify.listen(process.env.PORT)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})();