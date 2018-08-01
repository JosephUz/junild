var nodeChild = require("../../");

var path = require("path");
nodeChild.set("childConsolePath", path.join(__dirname, "console.txt"));

//  Run "npm install express" command before this example.
var express = require("express");

var app = express();

// This service locks the main thread for 5-10 seconds.
app.get('/main', function (req, res) {
    var sd = new Date();
    for (var i = 0; i < 9999999999; i++) {

    }
    res.send('<div>Processing Time: ' + Math.abs((new Date().getTime() - sd.getTime()) / 1000) + 'ms</div><div>Variable i value: ' + i + '</div>');
});

// This service does not lock the main thread.
app.get('/child/:m?/:i?', function (req, res) {
    var sd = new Date();
    nodeChild.get({
        fn: function (message, i) {
            // This scope does not show the sd variable.
            // However shows i variable that has value of req.params.i
            for (; i < 9999999999; i++) {

            }

            // Used to write any strig to console.txt.
            this.log(message + " " + new Date().toISOString());

            // This is end of thread. This method will close child thread and then returns parameter. 
            this.end(i);
        },
        // Only values in JSON format can be sent.
        params: [
            req.params.m,
            Number(req.params.i || 0)
        ],
        cb: function (i) {
            res.send('<div>Processing Time: ' + Math.abs((new Date().getTime() - sd.getTime()) / 1000) + 'ms</div><div>Variable i value: ' + i + '</div>');
        },
        ecb: function (err) {
            console.log(err);
        }
    })
});

// This service returns value instantly.
app.get('/time', function (req, res) {
    var sd = new Date();
    res.send('Processing Time: ' + Math.abs((new Date().getTime() - sd.getTime()) / 1000) + 'ms');
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});