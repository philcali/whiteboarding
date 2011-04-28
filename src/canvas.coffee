window.onload = ->
  [x, y] = [0, 0]  
  draw = false

  socket = new io.Socket()
  socket.connect()
  socket.on "message", (obj) ->  
    switch obj.msgtype
      when "drawing" then draw = obj.value
      when "moving"
        [fromX, fromY, toX, toY] = obj.value
        handleDraw(fromX, fromY, toX, toY)

  canvas = document.getElementById "whiteboard"
  canvas.width = document.width - 32
  canvas.height = document.height - 32

  context = canvas.getContext "2d"

  handleDraw = (fX, fY, tX, tY)->
    context.moveTo fX, fY
    x = tX
    y = tY
    if draw
      context.lineTo x, y
      context.stroke()

  drawing = (value) -> socket.send({msgtype: "drawing", value: value})

  canvas.onmousemove = -> 
    [toX, toY] = [event.clientX - 9, event.clientY - 8]
    socket.send({msgtype: "moving", value: [x, y, toX, toY]})
    handleDraw(x, y, toX, toY)

  canvas.onmousedown = ->
    draw = true
    drawing(draw)

  canvas.onmouseup = ->
    draw = false
    drawing(draw)
