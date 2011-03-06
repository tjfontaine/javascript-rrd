/*
Example HTML/javascript file that display the
content of a RRD archive file
Part of the javascriptRRD package
Copyright (c) 2009 Frank Wuerthwein, fkw@ucsd.edu

Original repository: http://javascriptrrd.sourceforge.net/

MIT License [http://www.opensource.org/licenses/mit-license.php]
*/

var bf = require('../lib/binaryFile.js')
var rrf = require('../lib/rrdFile.js')

console.log('RRD Header Info')

var fname = 'example1.rrd'
bf.FetchBinaryURLAsync(fname, function(binfile, blarg) {
  var rrdfile = new rrf.RRDFile(binfile)

  console.log('Min Step', rrdfile.getMinStep())
  console.log('Last update', new Date(rrdfile.getLastUpdate() * 1000))

  console.log('DS ---')
  for(var i=0; i < rrdfile.getNrDSs(); i++) {
    var ds = rrdfile.getDS(i);
    console.log(ds.getName(), ds.getType());
  }

  console.log('RRAs ---')
  for(var i=0; i < rrdfile.getNrRRAs(); i++) {
    var rra = rrdfile.getRRAInfo(i)
    console.log('rows', rra.getNrRows(), 'step', rra.getStep())
  }  
})
