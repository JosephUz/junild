var exports = {};

var opt = {
    childConsolePath: ""
};

function streamToJSON(stream) {
    var str = stream.toString();
    str = str.substr(str.indexOf('{'))
    var obj = JSON.parse(str);
    if (obj.fn) {
        var fn = obj.fn.replace(/\\n/g, '');
        eval('obj.fn = ' + fn);
    }
    return obj;
}

function log(str) {
    if (opt.childConsolePath) {
        var fs = require("fs");
        if (fs.existsSync(opt.childConsolePath)) {
            var olds = fs.readFileSync(opt.childConsolePath) || '';
            olds = olds.toString();
            olds += str + '\r\n';
            olds += '--------------------------------------------------\r\n';
            fs.writeFileSync(opt.childConsolePath, olds, { flags: 'w' });
        }
    }
}

exports.get = function (obj) {
    var ecb = obj.ecb,
        cb = obj.cb,
        fn = obj.fn.toString(),
        params = obj.params || [];

    var child = require('child_process').spawn('node', ['./' + __filename.slice(__dirname.length + 1, -3) + '.js'], {
        env: {
            ischild: true,
            childConsolePath: opt.childConsolePath
        }
    });

    child.stdout.on('data', function (stream) {
        var res = streamToJSON(stream);
        if (cb)
            cb(res.result);
    });

    child.stderr.on('data', function (stream) {
        var res = streamToJSON(stream);
        if (ecb)
            ecb(new Error(res.result));
    });

    child.stdin.write(JSON.stringify({ params: params, fn: fn }));
    child.stdin.end();
}

exports.set = function (key, value) {
    if (typeof (key) == "object") {
        opt.childConsolePath = key.childConsolePath;
    } else if (typeof (key) == "string") {
        opt[key] = value;
    }
}

if (process.env.ischild == "true") {
    process.on('uncaughtException', function (err) {
        process.stderr.write(JSON.stringify({ result: err.message }));
        process.exit();
    });

    exports.set("childConsolePath", process.env.childConsolePath);

    process.stdin.on('data', function (stream) {
        var req = streamToJSON(stream);

        var params = req.params ? req.params : [];
        req.fn.apply({
            log: log,
            req: req,
            error: function (err) {
                process.stderr.write(JSON.stringify({ result: err.message }));
                process.exit();
            },
            end: function (result) {
                process.stdout.write(JSON.stringify({ result: result || null }));
                process.exit();
            }
        }, params);
    });

}

module.exports = exports;