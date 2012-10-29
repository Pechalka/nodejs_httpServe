var fs = require('fs');
var mime = require('mime');

exports.handle = function(req, res){
	if (res.method !== 'GET'){
		res.writeHead(404, { 'Content-Type' : 'text/plain' });
		res.end('invalid method ' + req.method);
	} else {
		var fname = req.container.options.docroot + req.urlparsed.pathname;
		if (fname.match(/\/$/)) fname += "index.html";
		fs.stat(fname, function(err, stat){
			if (err){
					res.writeHead(500, { 'Content-Type' : 'text/plain' });
					res.end('file ' + fname + ' not found ' + err);
				} else {
					fs.readFile(req.basicServer.container.options.iconPath, 
						function(err, buf){
							if (err){
								res.writeHead(500, { 'Content-Type' : 'text/plain' });
								res.end('file ' + fname + ' not readable ' + err);
							} else {
								res.writeHead(200, { 
									'Content-Type' : mime.lookup(req.basicServer.container.options.iconPath),
									'Content-Length' : buf.length
								});
							res.end(buf);
						}
					});			
				}
		});
	}
};