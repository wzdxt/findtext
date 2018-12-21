#!/usr/bin/env node

var argv = require('optimist').argv;
var server = require('crud-file-server');
var http = require('http');
var httpProxy = require('http-proxy');

if (!argv.q) {
  console.log('usage:');
  console.log('  crud-file-server [options]');
  console.log('');
  console.log('this starts a file server using the specified command-line options');
  console.log('');
  console.log('options:');
  console.log('');
  console.log('  -f file system path to expose over http');
  console.log('  -h log head requests');
  console.log('  -p port to listen on (example, 80)');
  console.log('  -q suppress this message');
  console.log('  -r read only');
  console.log('  -v virtual path to host the file server on');
  console.log('');
  console.log('example:');
  console.log('');
  console.log('  crud-file-server -f c:/ -p 8080 -q -v filez');
  console.log('');
}

var port = argv.p || 8080;
var path = argv.f || process.cwd();
var vpath = (argv.v || '').trimLeft();
var readOnly = argv.r;
var logHeadRequests = argv.h;

var proxy = httpProxy.createProxyServer({});
proxy.on('error', console.error);

http.createServer(function (req, res) {
  if (req.url.startsWith('/proxy/')) {
    var realUrl = req.url.substr(7).replace('/', '://');
    req.headers.host = 'github.com';
    req.url = '';
    proxy.web(req, res, {target: realUrl});
    console.info("real url:", realUrl);
    return;
  } else {
    server.handleRequest(vpath, path, req, res, readOnly, logHeadRequests);
  }
}).listen(port);

console.log('listening on :' + port + '/' + vpath + ', serving ' + path);




