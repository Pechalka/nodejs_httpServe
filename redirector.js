var util = require('util');
var code2url = {
	'ex1' : 'http://example1.com',
	'ex2' : 'http://example2.com'	
};

var notFound = function(req, res){
	res.writeHead(404, {'Content-Type' : 'text/plain' });
	res.end('no matching redirect code found for ' + req.basicServer.host 
		+ '/' + req.basicServer.urlparsed.pathname);
};

exports.handle = function(req, res){
	var code = req.basicServer.pathMacthes[1];
	if (code){
		if (code2url[code]){
			var url = code2url[code];
			res.writeHead(302, { 'Location' : url });
			res.end();
		} else {
			notFound(req, res);
		}
	} else {
		notFound(req, res);
	}
}