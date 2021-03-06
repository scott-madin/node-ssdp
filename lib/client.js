var SSDP = require('./')
  , util = require('util')


/**
 *
 * @param opts
 * @param [sock]
 * @constructor
 */
function SsdpClient(opts, sock) {
  this._subclass = 'ssdp-client'
  SSDP.call(this, opts, sock)
}



util.inherits(SsdpClient, SSDP)


/**
 * Start the listener for multicast notifications from SSDP devices
 * @param [cb]
 */
SsdpClient.prototype.start = function (cb) {
  this._start(this._ssdpPort, this._unicastHost, cb)
}


/**
 *
 * @param {String} serviceType
 * @returns {*}
 */
SsdpClient.prototype.search = function search(serviceType) {
  var self = this

  if (!this._started) {
    return this.start(function () {
      self.search(serviceType)
    })
  }

  var pkt = self._getSSDPHeader(
    'M-SEARCH',
    {
      'HOST': self._ssdpServerHost,
      'ST': serviceType,
      'MAN': '"ssdp:discover"',
      'MX': 3
    }
  )

  self._logger.trace('Sending an M-SEARCH request')

  var message = new Buffer(pkt)

  self._send(message, function (err, bytes) {
    self._logger.trace({'message': pkt}, 'Sent M-SEARCH request')
  })
}



module.exports = SsdpClient
