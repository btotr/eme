var https = require('https');
var http = require('http');
var fs = require('fs');
var url = require('url');

keys = {
    '10000000100010001000100000000001': new Buffer("3A2A1B68DD2BD9B2EEB25E84C4776668", 'hex'),
    '10000000100010001000100000000002': new Buffer("04714BD8D7E1F3815FC47D0A834F0E18", 'hex')
};

var options = {
    key: fs.readFileSync('security/cl_clearkey-key.pem'),
    cert: fs.readFileSync('security/cl_clearkey-cert.pem')
};

var addCORSHeaders = function(res, length) {
    res.writeHeader(200, {
        "Content-Length": length,
        "Content-Type": 'application/json',
        "Access-Control-Allow-Origin": '*',
        "Access-Control-Allow-Methods": 'GET, PUT, POST, DELETE, OPTIONS',
        "Access-Control-Allow-Headers": 'Content-Type, Authorization, Content-Length, X-Requested-Width'});
};

// Still testing this
https.createServer(options, function(req, res) {
    addCORSHeaders(res);
    res.end("hello world\n");

}).listen(8585);

http.createServer(function(req, res) {
    var parsed_url = url.parse(req.url, true);
    var query = parsed_url.query;

    // Validate query string
    if (query === undefined || query.keyid === undefined) {
        res.writeHeader(400, "Illegal query string");
        res.end();
    }

    var keyIDs = [];
    if (query.keyid instanceof Array) {
        keyIDs = query.keyid;
    } else {
        keyIDs.push(query.keyid);
    }

    var jwk_array = [];
    for (var i = 0; i < keyIDs.length; i++) {
        var jwk = {
            kty: "oct",
            alg: "A128GCM",
            kid: new Buffer(keyIDs[i], 'hex').toString('base64').replace(/=/g, ""),
            k: keys[keyIDs[i]].toString('base64').replace(/=/g, "")
        };
        jwk_array.push(jwk);
    }
    var response = {
        keys: jwk_array
    };
    var json_str_response = JSON.stringify(response);
    addCORSHeaders(res, json_str_response.length);
    res.write(json_str_response);
    res.end();

}).listen(8584);