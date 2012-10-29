var util = require('util');
var url = require('url');


exports.sniffOn = function(server) {
	server.on('request', function(req, res){
		util.log('e_request');
		util.log(requestToString(req));
	});
};

function requestToString(req){
	var ret = 'request ' + req.method + ' ' + req.httpVersion + ' ' + req.url + '\n';
	
	ret += JSON.stringify(url.parse(req.url, true) + '\n');
	var keys = Object.keys(req.headers);
	for (var i = 0; i < keys.length; i++) {
			var key = keys[i];
			ret += i + ' ' + ' : ' + req.headers[key] + '\n';
		};	
	if (req.trailers)
		ret += req.trailers + '\n';
	return ret;
}

exports.requestToString = requestToString;