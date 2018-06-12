const express = require('express');
const httpProxy = require('http-proxy');
const path = require('path');

const proxy = httpProxy.createProxyServer();
const app = express();

app.use(express.static(path.join(__dirname, 'build')));

const config = {
    api_uri: process.env.BACKEND_PORT || "http://localhost:5000",
    root_path: path.normalize(__dirname + '/')
};

app.route('/api/*').get(function(req, res) {
    proxy.web(req, res, {target: config.api_uri});
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'/build/index.html'));
});

app.listen(8080);

console.log('Listening on 8080');
