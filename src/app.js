const http = require('http')
const path = require('path')
const chalk = require('chalk')
const route = require('./lib/route')
const conf = require('./config/defaultConfig')
const openUrl = require('./lib/openUrl')

class Server {
  constructor(userConf) {
    this.conf = Object.assign({}, conf, userConf)
  }
  start() {
    const server = http.createServer((req, res) => {
      const filePath = path.join(this.conf.root, req.url)
      route(req, res, filePath, this.conf)
    })
    
    server.listen(this.conf.port, this.conf.hostname, () => {
      const addr = `http://${this.conf.hostname}:${this.conf.port}`
      console.info(`Server started at ${chalk.green(addr)}`)
      openUrl(addr)
    })
  }
}

module.exports = Server
