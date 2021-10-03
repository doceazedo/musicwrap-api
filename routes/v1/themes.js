module.exports = async function routes (fastify, options) {
  fastify.get('/themes', async (request, reply) => {
    console.log(global.themes);
    return { themes: global.themes }
  })
}