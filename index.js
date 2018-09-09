const Peer = require('./peer')

let testPeer = new Peer(new Buffer('Sumthin Crazy'), '192.168.1.34', 3030)
console.log(testPeer.toString())
