var http = require('http');
var url = require('url');

var lookupContainer = function(htserver, host, path){
	for (var i = 0; i < htserver.basicServer.containers.length; i++) {
		var container = htserver.basicServer.containers[i];
		var hostMacthes = host.toLowerCase().match(container.host);
		var pathMacthes = path.match(container.path);
		if (hostMacthes !== null && pathMacthes !== null){
			return {
				container : container, 
				host : hostMacthes, 
				path : pathMacthes
			};
		}
	};
	return undefined;
}

var processHeaders = function(req, res){
	req.basicServer.cookies = [];
	var keys = Object.keys(req.headers);
	for (var i = 0; i < keys.length; i++) {
		var hname = keys[i];
		var hval = req.headers[hname];
		if (hname.toLowerCase() === 'host'){
			req.basicServer.host = hval;
		}

		if (hname.toLowerCase() === 'cookie'){
			req.basicServer.cookies.push(hval);
		}
	};
};

var dispatchToContainer = function(htserver, req, res){
	var container = lookupContainer(
		htserver, 
		req.basicServer.host,
		req.basicServer.urlparsed.pathname
		);
	if (container !== undefined){

		req.basicServer.hostMacthes = container.host;
		req.basicServer.pathMacthes = container.path;
		req.basicServer.container = container.container;

		//2 line fix
		req.container = container.container;
		req.urlparsed = req.basicServer.urlparsed
		
		container.container.module.handle(req, res);
	} else {
		res.writeHead(404, { 'Content-Type' : 'text/plain' });
		res.end('no handler found for ' + req.host + "/" + req.urlparsed.path);		
	}
};

exports.createServer = function() {
	var htserver = http.createServer(function(req, res){
		req.basicServer = {
			urlparsed : url.parse(req.url, true)
		};
		processHeaders(req, res);
		dispatchToContainer(htserver, req, res);
	});

	htserver.basicServer = { containers : [] };

	htserver.addContainer = function(host, path, module, options){
		if (lookupContainer(htserver, host, path) !== undefined){
			throw new Error('Already mapped ' + host + "/" + path)
		}
		
		htserver.basicServer.containers.push({
			host : host, path : path,
			module : module, options : options
		});
	};

	htserver.useFavIcon = function(host, path){
		return this.addContainer(
			host, 
			"/favicon.ico", 
			require('./faviconHandler'),
			{ iconPath : path}
		);
	};

	htserver.docroot = function(host, path, rootPath){
		return this.addContainer(host, path, require("./staticHandle"), 
			{ docroot : rootPath })
	};

	return htserver;
}