(function() {
  var app, fs, io, socket;
  app = require("express").createServer();
  fs = require("fs");
  io = require("socket.io");
  app.get("/", function(req, res) {
    return fs.readFile("index.html", function(err, data) {
      return res.end(data);
    });
  });
  app.get("/canvas.js", function(req, res) {
    res.writeHead(200, {
      "content-type": "text/javascript"
    });
    return fs.readFile("canvas.js", function(err, data) {
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
