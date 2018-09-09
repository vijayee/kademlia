const crypto = require('crypto')
const base58 = require('bs58')
let _nodeId = new WeakMap()
let _ipaddress = new WeakMap()
let _port = new WeakMap()


module.exports = class Peer {
  constructor(nodeId, ipaddress, port) {
    _nodeId.set(this, nodeId)
    _ipaddress.set(this, ipaddress)
    _port.set(this, port)
  }

  get key () {
    return base58.encode(this.nodeId)
  }
  get nodeId () {
    let nodeId = _nodeId.get(this)
    return nodeId.slice(0)
  }
  get port () {
    let port = _port.get(this)
    return port
  }
  get ipaddress() {
    let ipaddress = _ipaddress.get(this)
    return ipaddress
  }
  toString() {
    return `NodeID: ${this.key}, ip: ${this.ip}, port: ${this.port}`
  }
}
