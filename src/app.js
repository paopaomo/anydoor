const http = require('http');
const chalk = require('chalk');
const path = require('path');
const route = require('./helper/route');

const defaultConfig = require('./config/default');

class Server {
  constructor(config) {
    this.config = { ...defaultConfig, ...config };
  }

  start() {
    const server = http.createServer((req, res) => {
      const filePath = path.join(this.config.root, req.url);
      route(req, res, filePath, this.config);
    });

    server.listen(this.config.port, this.config.hostname, () => {
      const address = `http://${this.config.hostname}:${this.config.port}`;
      console.log(`Server started at ${chalk.green(address)}`);
    });
  }
}

module.exports = Server;
