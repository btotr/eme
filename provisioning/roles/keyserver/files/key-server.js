var https = require('https');
var http = require('http');
var fs = require('fs');
var url = require('url');

keys = {
    '10000000100010001000100000000001': new Buffer("3A2A1B68DD2BD9B2EEB25E84C4776668", 'hex'),
    '10000000100010001000100000000002': new Buffer("04714BD8D7E1F3815FC47D0A834F0E18", 'hex'),
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

function Base64ToHex(str){
    var b = new Buffer(str, 'base64')
    return b.toString('hex');
}

function HexToBase64(str) {
    var b = new Buffer(str, 'hex')
    return b.toString('base64').replace("==", "");
}

http.createServer(function(req, res) {
    
    var parsed_url = url.parse(req.url, true);
    var query = parsed_url.query;

    // Validate query string
    if (query === undefined || query.keyid === undefined) {
        res.writeHeader(400, "Illegal query string");
        res.end();
    }
    
    var msg = JSON.parse(query.keyid )

    var outKeys = [];
    for (var i = 0; i < msg.kids.length; i++) {
      var id64 = msg.kids[i];
      var idHex = Base64ToHex(msg.kids[i]).toLowerCase();
      var key = keys[idHex];

      if (key) {
        outKeys.push({
          "kty":"oct",
          "alg":"A128KW",
          "kid":id64,
          "k":HexToBase64(key)
        });
     } else {
        console.log("couldn't find key for key id " + idHex);
     }
    }

    var update = JSON.stringify({
      "keys" : outKeys,
      "type" : msg.type
    });
    console.log(update)
    var bufferUpdate = new Buffer(update, "binary")
    addCORSHeaders(res, bufferUpdate.length);
    res.write(bufferUpdate);
    res.end();

}).listen(8584);