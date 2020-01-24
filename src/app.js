const http = require('http');
const chalk = require('chalk');
const { hostname, port } = require('./config/default');

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello Http!');
});

server.listen(port, hostname, () => {
  const address = `http://${hostname}:${port}`;
  console.log(`Server started at ${chalk.green(address)}`);
});
