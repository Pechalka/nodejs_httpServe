var fs = require('fs');
var mime = require('mime');

exports.handle = function(req, res){
	if (req.method !== 'GET'){
		res.writeHead(404, { 'Content-Type' : 'text/plain' });
		res.end('invalid method1 ' + req.method);
	} else {
		var fname = req.container.options.docroot + req.urlparsed.pathname;
		if (fname.match(/\/$/)) fname += "index.html";

		console.log('file ' + fname);
		
		fs.stat(fname, function(err, stat){
			if (err){
					res.writeHead(500, { 'Content-Type' : 'text/plain' });
					res.end('file ' + fname + ' not found ' + err);
				} else {
					fs.readFile(fname, 
						function(err, buf){
							if (err){
								res.writeHead(500, { 'Content-Type' : 'text/plain' });
								res.end('file ' + fname + ' not readable ' + err);
							} else {
								res.writeHead(200, { 
									'Content-Type' : mime.lookup(fname),
									'Content-Length' : buf.length
								});
							res.end(buf);
							}
						}
					);	
				}
		});
	}
};