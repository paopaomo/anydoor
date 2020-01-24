const http = require('http');
const chalk = require('chalk');
const path = require('path');
const route = require('./helper/route');

const { hostname, port, root } = require('./config/default');

const server = http.createServer((req, res) => {
  const filePath = path.join(root, req.url);
  route(req, res, filePath);
});

server.listen(port, hostname, () => {
  const address = `http://${hostname}:${port}`;
  console.log(`Server started at ${chalk.green(address)}`);
});
