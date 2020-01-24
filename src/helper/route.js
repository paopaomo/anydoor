const fs = require('fs');
const promisify = require('util').promisify;

const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);

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
          res.setHeader('Content-Type', 'text/plain');
          res.end(files.join(','));
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
