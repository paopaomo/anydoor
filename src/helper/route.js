const fs = require('fs');
const promisify = require('util').promisify;
const path = require('path');
const Handlebars = require('handlebars');
const { root } = require('../config/default');

const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);

const tplPath = path.join(__dirname, '../template/dir.tpl');
const source = fs.readFileSync(tplPath);
const template = Handlebars.compile(source.toString());

const route = (req, res, filePath) => {
  stat(filePath)
    .then(stat => {
      if (stat.isFile()) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        fs.createReadStream(filePath).pipe(res);
      }
      if (stat.isDirectory()) {
        readdir(filePath).then(files => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/html');
          const dir = path.relative(root, filePath);
          const data = {
            title: path.basename(filePath),
            files,
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
