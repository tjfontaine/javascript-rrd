/*
 * Export all the modules at once by attaching them to the 'exports' of this
 * file.
 *
 * Thusly:
 *
 * var rrd = require('javascript-rrd');
 * rrd.binaryFile.FetchBinaryURLAsync(FILENAME, function (b) {
 *      ...
 * });
 *
 */
exports.binaryFile = require('./binaryFile');
exports.rrdFile = require('./rrdFile');
exports.rrdFilter = require('./rrdFilter');
exports.rrdFlot = require('./rrdFlot');
exports.rrdFlotMatrix = require('./rrdFlotMatrix');
exports.rrdFlotSupport = require('./rrdFlotSupport');
exports.rrdMultiFile = require('./rrdMultiFile');
