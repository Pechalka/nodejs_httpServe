var port = 4080;
var server = require('./basicserver').createServer();
server.addContainer('.*', '/l/(.*)$', require('./redirector'), {});
server.useFavIcon('localhost', './public/favicon.png');
server.docroot('localhost', '/', './public');

require('./httpsniffer').sniffOn(server);

server.listen(port);

