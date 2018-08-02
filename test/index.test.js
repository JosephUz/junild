describe("index.js test", function () {
    it("run function in node child", function (done) {
        var nodeChild = require('../');

        nodeChild.get({
            fn: function () {
                var total = 2 + 2;
                this.end("total: " + total);
            },
            cb: function (message) {
                if (message == "total: 4")
                    done();
                else
                    done(new Error("run function is not working."));
            },
            ecb: done
        });
    });

    it("send parameters to function that runned in node child", function (done) {
        var nodeChild = require('../');

        nodeChild.get({
            fn: function (one, two) {
                var total = one + two;
                this.end("total: " + total);
            },
            params: [2, 2],
            cb: function (message) {
                if (message == "total: 4")
                    done();
                else
                    done(new Error("parameter sending is not working."));
            },
            ecb: done
        });
    });

    it("error capture in node child", function (done) {
        var nodeChild = require('../');

        nodeChild.get({
            fn: function (one, two) {
                throw new Error("test error");
            },
            ecb: function (err) {
                if (err.message == "test error")
                    done();
                else
                    done(err);
            }
        });
    });

    it("write log to console.txt", function (done) {
        var nodeChild = require('../');

        var path = require("path");
        var childConsolePath = path.join(__dirname, "console.txt");
        nodeChild.set("childConsolePath", childConsolePath);

        var fs = require("fs");
        if (fs.existsSync(childConsolePath))
            fs.writeFileSync(childConsolePath, "", { flags: 'w' });
        else
            done(new Error("no console file is exist."));

        nodeChild.get({
            fn: function (message) {
                this.log(message);
                this.end();
            },
            params: ["this is test message."],
            cb: function () {
                try {
                    var consoleLog = fs.readFileSync(childConsolePath);
                    if (consoleLog == "this is test message.\r\n--------------------------------------------------\r\n")
                        done();
                    else
                        done(new Error("console writting is not working."));
                } catch (err) {
                    done(err);
                }
            },
            ecb: done
        });
    });

    it("write log to console.txt by setting path in object", function (done) {
        var nodeChild = require('../');

        var path = require("path");
        var childConsolePath = path.join(__dirname, "console.copy.txt");
        nodeChild.set({
            childConsolePath: childConsolePath
        });

        var fs = require("fs");
        if (fs.existsSync(childConsolePath))
            fs.writeFileSync(childConsolePath, "", { flags: 'w' });
        else
            done(new Error("no console file is exist."));

        nodeChild.get({
            fn: function (message) {
                this.log(message);
                this.end();
            },
            params: ["this is test message."],
            cb: function () {
                try {
                    var consoleLog = fs.readFileSync(childConsolePath);
                    if (consoleLog == "this is test message.\r\n--------------------------------------------------\r\n")
                        done();
                    else
                        done(new Error("console writting is not working."));
                } catch (err) {
                    done(err);
                }
            },
            ecb: done
        });
    });

    it("main thread still works", function (done) {
        var nodeChild = require('../');

        var ticks = 0;

        nodeChild.get({
            fn: function () {
                for (var i = 0; i < 9999; i++) {
                    ticks = i;
                }
                this.end(ticks);
            },
            params: [ticks],
            cb: function (ticksFromChild) {
                if (ticks == 998 && ticksFromChild == 9998)
                    done();
                else
                    done(new Error("node child does not work properly."));
            },
            ecb: done
        });

        setTimeout(function () {
            for (var i = 0; i < 999; i++) {
                ticks = i;
            }
        }, 0);
    });
});