let _bucketSize = new WeakMap()
let _bucket = new WeakMap()
let _one = new WeakMap()
let _zero = new WeakMap()
module.exports = class KBucket {
  constructor (bucketSize) {
    _bucketSize.set(this, bucketSize)
    _bucket.set(this, [])
  }
  add (peer, index) { //index within nodeId that we need to check
    if (!index) {
      index = 0
    }
    let bucket = _bucket.get(this)
    if (bucket) {// this node contains values
      let bucketSize = _bucketSize.get(this)
      function peerEqual (kpeer) {
        return kpeer.id.compare(peer.id) === 0
      }
      let foundIndex = bucket.findIndex(peerEqual)
      if (foundIndex !== -1) {
        return this.update(foundIndex, peer)
      }
      if (bucket.length === bucketSize) { //split the bucket
        return this.split()
      } else {
        return bucket.push(peer)
      }
    } else { // this node has been split
      if (getBit(peer.id, index)) {
        let one = _one.get(this)
        return one.add(peer, index++)
      } else {
        let zero = _zero.get(this)
        return zero.add(peer, index++)
      }
    }

  }
  update (foundIndex, peer) {
    let bucket = _bucket.get(this)
    bucket[foundIndex] = peer
  }
  split (index) {
    if (!index) {
      index = 0
    }
    let bucket = _bucket.get(this)
    let bucketSize = _bucketSize.get(this)
    let one = new KBucket(bucketSize)
    let zero = new KBucket(bucketSize)
    for (let peer of bucket) {
      if (getBit(peer.id, index)) {
        let one = _one.get(this)
        return one.add(peer, index++)
      } else {
        let zero = _zero.get(this)
        return zero.add(peer, index++)
      }
    }
    _bucket.set(this, null)
  }
  closest (id) {

  }
  remove (peer) {

  }

}
//index is index of bit
//byteIndex is index of the position in the curent byte of the nodejs Buffer
function getBit (id, index) {
  if (!index) {
    index = 0
  }
  let byte = parseInt(index / 8, 10)
  let byteIndex = index % 8 // index of bit within byte
  if ((id.length < byte) && (byteIndex !== 0)) {
    return false
  }
  if (id[ byte ] & Math.pow(2, (7 - byteIndex))) {
    return true
  } else {
    return false
  }
}
