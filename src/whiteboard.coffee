express = require "express"
app = express.createServer()

fs = require "fs"
io = require "socket.io"

app.configure "development", ->
  app.use express.static __dirname + "/../target"

app.listen 8000

socket = io.listen app
socket.sockets.on "connection", (c) ->
  console.log "Received a connection"

  c.on "message", (obj) ->
    c.broadcast.emit "message", obj
