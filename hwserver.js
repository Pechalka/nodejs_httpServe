var http = require('http');
var sniffer = require('./httpsniffer');

var server = http.createServer(function(req, res) {
	res.writeHead(200, { 'Content-Type' : 'text/plain'});
	res.end('hellow, World!\n');
});
sniffer.sniffOn(server);
server.listen(3000);