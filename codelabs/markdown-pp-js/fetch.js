var http = require('http');
var https = require('https');
var url = require('url');
var util = require('util');

function get(inputUrl,options,config,callback) {
    var u = url.parse(inputUrl);
    var doRequest = (u.protocol && u.protocol.startsWith('https')) ? https.get : http.get;
    options.hostname = u.hostname;
    options.port = u.port;
    options.path = u.path;
    doRequest(options, function(response){
        var body = '';

        response.on('data', function(data) {
            body += data;
        });

        response.on('end', function() {
            if (callback) callback(null, response, body, config);
        });
    }).on('error', function(e) {
        console.log('error: %s', e.message);
        if (callback) callback(e, null, null);
        if (config.debug) {
            console.log('Got error: ' + e.message);
            console.log('Error: ' + util.inspect(e));
        }
    });
}

function post(inputUrl,options,postData,config,callback) {
    console.log('post '+inputUrl);
    var u = url.parse(inputUrl);
    var proto = (u.protocol && u.protocol.startsWith('https')) ? https : http;
    options.hostname = u.hostname;
    options.port = u.port;
    options.path = u.path;
    options.method = 'post';
    options.headers = {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
    };
    var postReq = proto.request(options, function(res) {
        res.setEncoding('utf8');
        var body = '';
        res.on('data', function (data) {
            body += data;
        });
        res.on('end', function(){
            if (callback) callback(null, res, body);
        });
    }).on('error', function(e) {
        console.log('error: %s', e.message);
        if (callback) callback(e, null, null);
        if (config.debug) {
            console.log('Got error: ' + e.message);
            console.log('Error: ' + util.inspect(e));
        }
    });

    // post the data
    postReq.write(postData);
    postReq.end();
}

module.exports = {
    get: get,
    post: post
};
