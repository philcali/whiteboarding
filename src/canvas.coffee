window.onload = ->
  [x, y] = [0, 0]  
  draw = false
  # should be replaced with picker
  colors = ["black", "red", "blue", "green", "yellow"]
  color = 0 
  # should be replaced with sliders
  width = 1

  canvas = document.getElementById "whiteboard"
  canvas.width = document.width - 32
  canvas.height = document.height - 32

  context = canvas.getContext "2d"

  socket = new io.Socket()
  socket.connect()
  socket.on "message", (obj) ->  
    switch obj.msgtype
      when "drawing"
        draw = obj.value
        if draw then context.beginPath()
      when "clear" then clearContext()
      when "width" then width = obj.value
      when "color"
        color = obj.value
        document.getElementById("canvas-color").style.color = colors[color]
      when "moving"
        [fromX, fromY, toX, toY] = obj.value
        handleDraw(fromX, fromY, toX, toY)

  clearContext = ->
    context.clearRect(0, 0, canvas.width, canvas.height)

  # Controls
  document.getElementById("canvas-clear").onclick = ->
    socket.send({msgtype: "clear", value: "nothing"})
    clearContext()

  document.getElementById("canvas-color").onclick = ->
    color = if color == colors.length - 1 then 0 else color + 1
    socket.send({msgtype: "color", value: color})
    this.style.color = colors[color]

  document.getElementById("canvas-density").onclick = ->
    width = if width >= 17 then 1 else width + 4
    socket.send({msgtype: "width", value: width})

  handleDraw = (fX, fY, tX, tY)->
    context.moveTo fX, fY
    x = tX
    y = tY
    if draw
      context.lineTo x, y
      context.lineCap = "round"
      context.lineWidth = width
      context.strokeStyle = colors[color]
      context.stroke()

  drawing = (value) -> 
    socket.send({msgtype: "drawing", value: value})

  canvas.onmousemove = -> 
    [toX, toY] = [event.clientX - 9, event.clientY - 8]
    socket.send({msgtype: "moving", value: [x, y, toX, toY]})
    handleDraw(x, y, toX, toY)

  canvas.onmousedown = ->
    draw = true
    context.beginPath()
    drawing(draw)

  canvas.onmouseup = ->
    draw = false
    drawing(draw)

  cancel = (event) ->
    if event.preventDefault
      event.preventDefault()
    false

  # Cancel Browser Events
  canvas.ondragenter = cancel
  canvas.ondragover = cancel
  canvas.ondrop = ->
    cancel(event)
    data = event.dataTransfer
    reader = new FileReader()

    console.log reader

    reader.onloadend = (event) -> 
      image = new Image()
      [dX, dY] = [canvas.width / 4, 0]
      [dW, dH] = [canvas.width / 2, canvas.height]
      image.onload = ->
        context.drawImage(image, dX, dY, dW, dH)
      image.src = event.target.result

    reader.readAsDataURL data.files[0]
    false
