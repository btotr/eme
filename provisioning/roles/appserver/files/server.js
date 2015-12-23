var fs = require('fs'),
    http = require('http'),
    url = require('url'),
    path = require('path');

var indexPage, movie;

// load the video files and the index html page
fs.readFile(path.resolve(__dirname,"applications/bbb.mp4"), function (err, data) {
    movie = data;
});

// create http server
http.createServer(function (req, res) {
    
    var reqResource = url.parse(req.url).pathname;
    console.log("Resource: " + reqResource);

    if(reqResource == "/"){
        fs.readFile(path.resolve(__dirname,"applications/index.html"), function (err, data) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
        });
    } else if (reqResource == "/favicon.ico"){
        res.writeHead(404);
        res.end();
    } else {
            var total;
            if(reqResource == "/video"){
                total = movie.length;
                var range = req.headers.range;
                var positions = range.replace(/bytes=/, "").split("-");
                var start = parseInt(positions[0], 10);
                var end = positions[1] ? parseInt(positions[1], 10) : total - 1;
                var chunksize = (end-start)+1;
                res.writeHead(206, { "Content-Range": "bytes " + start + "-" + end + "/" + total, 
                                     "Accept-Ranges": "bytes",
                                     "Content-Length": chunksize,
                                     "Content-Type":"video/mp4"});
                res.end(movie.slice(start, end+1), "binary");
            }
    }
}).listen(8888);