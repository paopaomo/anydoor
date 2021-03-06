const { createGzip, createDeflate } = require('zlib');

module.exports = (rs, req, res) => {
  const acceptEncoding = req.headers['accept-encoding'];
  if (acceptEncoding.match(/\bgzip\b/)) {
    res.setHeader('Content-Encoding', 'gzip');
    return rs.pipe(createGzip());
  }
  if (acceptEncoding.match(/\bdeflate\b/)) {
    res.setHeader('Content-Encoding', 'deflate');
    return rs.pipe(createDeflate());
  }
  return rs;
};
