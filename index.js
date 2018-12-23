#!/usr/bin/env node

const argv = require('optimist').argv;
const server = require('crud-file-server');
const http = require('http');
const httpProxy = require('http-proxy');
const fs = require('fs');

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

console.log('listening on :' + port + '/' + vpath + ', serving ' + path);

var proxy = httpProxy.createProxyServer({});
proxy.on('error', function(err, req, res, url) {
  console.error('error happens: ', err);
  // console.error('req', req);
  // console.error('res', res);
  // console.error('url', url);
  res.statusCode = 404;
  res.end(JSON.stringify(err))
});

http.createServer(function (req, res) {
  isFileExists(path, vpath, req).then(function (local) {
    if (local) {
      server.handleRequest(vpath, path, req, res, readOnly, logHeadRequests);
    } else {
      // console.info(req);
      // var realUrl = req.url.substr(7).replace('/', '://');
      // req.headers.host = req.url.split('/')[3];
      // req.url = '';
      // proxy.web(req, res, {target: realUrl});
      if (!readCookie(req, 'x-domain')) {
        res.statusCode = 404;
        res.end();
        return;
      }
      req.headers.host = readCookie(req, 'x-domain');
      var target = readCookie(req, 'x-protocol') + '://' + readCookie(req, 'x-domain');
      console.info('forward to ', target, req.url);
      proxy.web(req, res, {target: target});
    }
  }).catch(function(err) {console.error(err)});
}).listen(port);

var isFileExists = function (path, vpath, req) {
  if (path.lastIndexOf('/') !== path.length - 1) {
    path += '/';
  } // make sure path ends with a slash
  var parsedUrl = require('url').parse(req.url);
  var query = query ? {} : require('querystring').parse(parsedUrl.query);
  var url = cleanUrl(parsedUrl.pathname);

  // normalize the url such that there is no trailing or leading slash /
  if (url.lastIndexOf('/') === url.length - 1) {
    url = url.slice(0, url.length);
  }
  if (url[0] === '/') {
    url = url.slice(1, url.length);
  }

  // check that url begins with vpath
  if (vpath && url.indexOf(vpath) != 0) {
    console.log('url does not begin with vpath');
    throw 'url [' + url + '] does not begin with vpath [' + vpath + ']';
  }

  if (req.method != 'HEAD') {
    console.log(req.method + ' ' + req.url);
  }
  var relativePath = vpath && url.indexOf(vpath) == 0 ?
  path + url.slice(vpath.length + 1, url.length) :
  path + url;

  console.info('relativePath is', relativePath);
  return new Promise(function (resolve, reject) {
    fs.stat(relativePath, function (err, stats) { // determine if the resource is a file or directory
      resolve(!err);
    });
  });
};

// don't let users crawl up the folder structure by using a/../../../c/d
var cleanUrl = function (url) {
  url = decodeURIComponent(url);
  while (url.indexOf('..') >= 0) {
    url = url.replace('..', '');
  }
  return url;
};

var readCookie = function (req, name) {
  var cookieStr = req.headers.cookie;
  var reg = new RegExp('(^' + name + '|\\s' + name + ')=([^;]*)');
  var matches = cookieStr.match(reg);
  if (matches) {
    return matches[2];
  } else {
    console.warn('cannot find ', reg, 'in', cookieStr);
    return null;
  }
};


