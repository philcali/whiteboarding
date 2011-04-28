(function() {
  var app, fs, io, socket;
  app = require("express").createServer();
  fs = require("fs");
  io = require("socket.io");
  app.get("/:file?.:format?", function(req, res) {
    var ext, file, format, _ref;
    _ref = !req.params.file ? ["index", "html"] : [req.params.file, req.params.format], file = _ref[0], ext = _ref[1];
    format = (function() {
      switch (ext) {
        case "js":
          return "javascript";
        case "txt":
          return "text";
        default:
          return ext;
      }
    })();
    res.writeHead(200, {
      "content-type": "text/" + format
    });
    return fs.readFile(file + "." + ext, function(err, data) {
      if (err) {
        console.warn(err.message);
      }
      return res.end(data);
    });
  });
  app.listen(8000);
  socket = io.listen(app);
  socket.on("connection", function(c) {
    console.log("Received a connection");
    return c.on("message", function(obj) {
      return c.broadcast(obj);
    });
  });
}).call(this);
