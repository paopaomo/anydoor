const fs = require('fs');
const promisify = require('util').promisify;
const path = require('path');
const Handlebars = require('handlebars');
const config = require('../config/default');
const mime = require('./mime');
const compress = require('./compress');
const range = require('./range');

const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);

const tplPath = path.join(__dirname, '../template/dir.tpl');
const source = fs.readFileSync(tplPath);
const template = Handlebars.compile(source.toString());

const route = (req, res, filePath) => {
  stat(filePath)
    .then(stat => {
      if (stat.isFile()) {
        const contentType = mime(filePath);
        res.setHeader('Content-Type', contentType);
        let rs;
        const { code, start, end } = range(stat.size, req, res);
        if (code === 200) {
          res.statusCode = 200;
          rs = fs.createReadStream(filePath);
        } else {
          res.statusCode = 206;
          rs = fs.createReadStream(filePath, { start, end });
        }
        if (filePath.match(config.compress)) {
          rs = compress(rs, req, res);
        }
        rs.pipe(res);
      }
      if (stat.isDirectory()) {
        readdir(filePath).then(files => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/html');
          const dir = path.relative(config.root, filePath);
          const data = {
            title: path.basename(filePath),
            files: files.map(file => ({
              file,
              icon: mime(file)
            })),
            dir: dir ? `/${dir}` : ''
          };
          res.end(template(data));
        });
      }
    })
    .catch(err => {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end(`${filePath} is not a directory or file\n ${err.toString()}`);
    });
};

module.exports = route;
