const routes = require('./routes');
const ReplysHandler = require('./handler');

module.exports = {
  name: 'replys',
  register: async (server, { container }) => {
    const replysHandler = new ReplysHandler(container);
    server.route(routes(replysHandler));
  },
};
