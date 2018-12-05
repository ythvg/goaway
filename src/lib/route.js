const fs = require('fs')
const promisify = require('util').promisify
const path = require('path')
const Handlebars = require('Handlebars')
const conf = require('../config/defaultConfig')
const mime = require('../lib/mime')
const compress = require('../lib/compress')
const range = require('./range')
const stat = promisify(fs.stat)
const readdir = promisify(fs.readdir)

const hbsPath = path.join(__dirname, '../template/dir.hbs')
const template = Handlebars.compile(fs.readFileSync(hbsPath, 'utf-8'))

module.exports = async function (req, res, filePath) {
  try {
    const stats = await stat(filePath)
    if (stats.isFile()) {
      res.statusCode = 200
      const contentType = mime(filePath)
      res.setHeader('Content-Type', contentType)

      let rs 
      const {code, start, end} = range(stats.size, req, res)
      if (code === 200) {
          res.statusCode = 200;
          rs = fs.createReadStream(filePath)
      } else {
          res.statusCode = 206
          rs = fs.createReadStream(filePath, {start, end})
      }
      if (filePath.match(conf.compress)) {
          rs = compress(rs, req, res)
      }
      rs.pipe(res)
    } else if (stats.isDirectory()) {
      const files = await readdir(filePath)
      res.statusCode = 200
      res.setHeader('Content-Type', 'text/html')

      const dir = path.relative(conf.root, filePath)
      const data = {
        title: path.basename(filePath),
        dir: dir ? `/${dir}`: '',
        files
      }
      res.end(template(data))
    }
  } catch (error) {
    res.statusCode = 404
    res.setHeader('Content-Type', 'text/plain')
    res.end(`${filePath} is not a directory ro file`)
    return
  }
}
