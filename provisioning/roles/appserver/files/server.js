var fs = require('fs'),
    http = require('http'),
    url = require('url'),
    path = require('path');

    var media = {
        video:{}, 
        audio:{}
    }

fs.readFile(path.resolve(__dirname,"../../../../applications/bbb-clearkey.mp4"), function (err, data) {
    media.video.data = data;
    media.video.total = media.video.data.length
});

fs.readFile(path.resolve(__dirname,"../../../../applications/bbb-audio-clearkey.mp4"), function (err, data) {
    media.audio.data = data;
    media.audio.total = media.audio.data.length
});

http.createServer(function (req, res) {
    
    var reqResource = url.parse(req.url).pathname;
    console.log("Resource: " + reqResource);

    if(reqResource == "/"){
        fs.readFile(path.resolve(__dirname,"../../../../applications/index.html"), function (err, data) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
        });
    } else if (reqResource == "/favicon.ico"){
        res.writeHead(404);
        res.end();
    } else { // assume video or audio
        var type = reqResource.replace("/", "")
        var range = req.headers.range;
        var positions = range.replace(/bytes=/, "").split("-");
        var start = parseInt(positions[0], 10);
        var end = positions[1] ? parseInt(positions[1], 10) : total - 1;
        var chunksize = (end-start)+1;
        res.writeHead(206, { "Content-Range": "bytes " + start + "-" + end + "/" + media[type].total, 
                             "Accept-Ranges": "bytes",
                             "Content-Length": chunksize,
                             "Content-Type":"video/mp4"});
        res.end(media[type].data.slice(start, end+1), "binary");
    }
}).listen(2626);