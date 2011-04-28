app = require("express").createServer()
fs = require "fs"
io = require "socket.io"

app.get "/:file?.:format?", (req, res) ->
  [file, ext] = if not req.params.file 
    ["index", "html"] 
  else 
    [req.params.file, req.params.format]

  format = switch ext 
    when "js" then "javascript"
    when "txt" then "text"
    else ext

  res.writeHead 200, 
    "content-type": "text/" + format
  fs.readFile file + "." + ext, (err, data) ->
    if err then console.warn err.message
    res.end data

app.listen 8000

socket = io.listen app
socket.on "connection", (c) ->
  console.log "Received a connection"

  c.on "message", (obj) ->
    c.broadcast obj
