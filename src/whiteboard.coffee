app = require("express").createServer()
fs = require "fs"
io = require "socket.io"

app.get "/", (req, res) ->
  fs.readFile "index.html", (err, data) ->
    res.end data

app.get "/canvas.js", (req, res) ->
  res.writeHead 200, 
    "content-type": "text/javascript"
  fs.readFile "canvas.js", (err, data) ->
    res.end data

app.listen 8000

socket = io.listen app
socket.on "connection", (c) ->
  console.log "Received a connection"

  c.on "message", (obj) ->
    c.broadcast obj
