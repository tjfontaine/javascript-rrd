/*
 Example HTML/javascript file that display the
 content of a RRD archive file
 Part of the javascriptRRD package
 Copyright (c) 2009 Frank Wuerthwein, fkw@ucsd.edu

 Original repository: http://javascriptrrd.sourceforge.net/
 
 MIT License [http://www.opensource.org/licenses/mit-license.php]
*/

/*
 This example will print out RRD content in integer format.
 Make sure all RRD values can fit in an integer
*/
var bf = require('../lib/binaryFile.js')
var rrf = require('../lib/rrdFile.js')

console.log('RRD Raw Content')
var fname = 'example1.rrd'

bf.FetchBinaryURLAsync(fname, function(binfile){
  var rrd_data = new rrf.RRDFile(binfile)
  var nrDSs=rrd_data.getNrDSs()
  
  for (var i=0; i<nrDSs; i++) {
    var ds=rrd_data.getDS(i)
    var rra=rrd_data.getRRA(i)
    console.log(ds.getName())
    for(var j=0; j<rra.getNrRows(); j++) {
      console.log(Math.round(rra.getElFast(j, i)))
    }
  }
})
