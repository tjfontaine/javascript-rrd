
/*
 * BinaryFile over XMLHttpRequest
 * Part of the javascriptRRD package
 * Copyright (c) 2009 Frank Wuerthwein, fkw@ucsd.edu
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 *
 * Original repository: http://javascriptrrd.sourceforge.net/
 *
 * Based on:
 *   Binary Ajax 0.1.5
 *   Copyright (c) 2008 Jacob Seidelin, cupboy@gmail.com, http://blog.nihilogic.dk/
 *   MIT License [http://www.opensource.org/licenses/mit-license.php]
 */

var fs = require('fs')

// ============================================================
// Exception class
function InvalidBinaryFile(msg) {
  this.message=msg;
  this.name="Invalid BinaryFile";
}

// pretty print
InvalidBinaryFile.prototype.toString = function() {
  return this.name + ': "' + this.message + '"';
}

// =====================================================================
// BinaryFile class
//   Allows access to element inside a binary stream
function BinaryFile(strData, iDataOffset, iDataLength) {
	var data = strData;
	var dataOffset = iDataOffset || 0;
	var dataLength = 0;
	// added 
	var doubleMantExpHi=Math.pow(2,-28);
	var doubleMantExpLo=Math.pow(2,-52);
	var doubleMantExpFast=Math.pow(2,-20);

  var fsstats = fs.fstatSync(data)
  dataLength = fsstats.size
  
  var buff = new Buffer(512)

	/*this.getRawData = function() {
	  var buff = new Buffer(dataLength);
		var bytes = fs.readSync(data, buff, 0, dataLength);
		return buff;
	}*/

	this.getByteAt = function(iOffset) {
	  var bytes = fs.readSync(data, buff, 0, 1, iOffset + dataOffset)
		return buff[0];
	}

	this.getLength = function() {
		return dataLength;
	}

	this.getSByteAt = function(iOffset) {
		var iByte = this.getByteAt(iOffset);
		if (iByte > 127)
			return iByte - 256;
		else
			return iByte;
	}

	this.getShortAt = function(iOffset) {
		var iShort = (this.getByteAt(iOffset + 1) << 8) + this.getByteAt(iOffset)
		if (iShort < 0) iShort += 65536;
		return iShort;
	}
	
	this.getSShortAt = function(iOffset) {
		var iUShort = this.getShortAt(iOffset);
		if (iUShort > 32767)
			return iUShort - 65536;
		else
			return iUShort;
	}
	
	this.getLongAt = function(iOffset) {
	  var bytes = fs.readSync(data, buff, 0, 4, iOffset)

		var iLong = (((((buff[3] << 8) + buff[2]) << 8) + buff[1]) << 8) + buff[0];
		if (iLong < 0) iLong += 4294967296;
		return iLong;
	}
	
	this.getSLongAt = function(iOffset) {
		var iULong = this.getLongAt(iOffset);
		if (iULong > 2147483647)
			return iULong - 4294967296;
		else
			return iULong;
	}
	
	this.getStringAt = function(iOffset, iLength) {
		var bytes = fs.readSync(data, buff, iOffset, iLength, 0)
		return buff.toString('ascii', 0, bytes)
	}

	// Added
	this.getCStringAt = function(iOffset, iMaxLength) {
	  
	  /*var aStr = [];
		for (var i=iOffset,j=0;(i<iOffset+iMaxLength) && (this.getByteAt(i)>0);i++,j++) {
			aStr[j] = String.fromCharCode(this.getByteAt(i));
		}
		return aStr.join("");*/

	  var bytes = fs.readSync(data, buff, 0, iMaxLength, iOffset)
	  
	  for(var i=0; i < bytes; i++) {
	    var b = buff.toString('ascii', i, i+1)
	    if(b == '\0') {
	      var ret = buff.toString('ascii', 0, i)
	      return ret
	    }
	  }
	  
	  return buff.toString('ascii', 0, bytes)
	}

	// Added
	this.getDoubleAt = function(iOffset) {
		var bytes = fs.readSync(data, buff, 0, 8, iOffset)
		
		var iSign=buff[7] >> 7;
		var iExpRaw=((buff[7] & 0x7F)<< 4) + (buff[6] >> 4);
		var iMantHi=((((((buff[6] & 0x0F) << 8) + buff[5]) << 8) + buff[4]) << 8) + buff[3];
		var iMantLo=((((buff[2]) << 8) + buff[1]) << 8) + buff[0];

		if (iExpRaw==0) return 0.0;
		if (iExpRaw==0x7ff) return undefined;

		var iExp=(iExpRaw & 0x7FF)-1023;

		var dDouble = ((iSign==1)?-1:1)*Math.pow(2,iExp)*(1.0 + iMantLo*doubleMantExpLo + iMantHi*doubleMantExpHi);
		return dDouble;
	}
	// added
	// Extracts only 4 bytes out of 8, loosing in precision (20 bit mantissa)
	this.getFastDoubleAt = function(iOffset) {
		var iByte5 = this.getByteAt(iOffset + 4),
			iByte6 = this.getByteAt(iOffset + 5),
			iByte7 = this.getByteAt(iOffset + 6),
			iByte8 = this.getByteAt(iOffset + 7);
		var iSign=iByte8 >> 7;
		var iExpRaw=((iByte8 & 0x7F)<< 4) + (iByte7 >> 4);
		var iMant=((((iByte7 & 0x0F) << 8) + iByte6) << 8) + iByte5;

		if (iExpRaw==0) return 0.0;
		if (iExpRaw==0x7ff) return undefined;

		var iExp=(iExpRaw & 0x7FF)-1023;

		var dDouble = ((iSign==1)?-1:1)*Math.pow(2,iExp)*(1.0 + iMant*doubleMantExpFast);
		return dDouble;
	}

	this.getCharAt = function(iOffset) {
		return String.fromCharCode(this.getByteAt(iOffset));
	}
}


// ===============================================================
// Load a binary file from the specified URL 
// Will return an object of type BinaryFile
function FetchBinaryURL(url) {
  return new BinaryFile(fs.openSync(url, 'r'));
}


// ===============================================================
// Asyncronously load a binary file from the specified URL 
//
// callback must be a function with one or two arguments:
//  - bf = an object of type BinaryFile
//  - optional argument object (used only if callback_arg not undefined) 
function FetchBinaryURLAsync(url, callback, callback_arg) {
  fs.open(url, 'r', function(err, fd) {
    callback(new BinaryFile(fd), callback_arg)
  });
}

exports.BinaryFile = BinaryFile;
exports.FetchBinaryURL = FetchBinaryURL;
exports.FetchBinaryURLAsync = FetchBinaryURLAsync;