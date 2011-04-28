(function() {
  window.onload = function() {
    var canvas, context, draw, drawing, handleDraw, socket, x, y, _ref;
    _ref = [0, 0], x = _ref[0], y = _ref[1];
    draw = false;
    socket = new io.Socket();
    socket.connect();
    socket.on("message", function(obj) {
      var fromX, fromY, toX, toY, _ref;
      switch (obj.msgtype) {
        case "drawing":
          return draw = obj.value;
        case "moving":
          _ref = obj.value, fromX = _ref[0], fromY = _ref[1], toX = _ref[2], toY = _ref[3];
          return handleDraw(fromX, fromY, toX, toY);
      }
    });
    canvas = document.getElementById("whiteboard");
    canvas.width = document.width - 32;
    canvas.height = document.height - 32;
    context = canvas.getContext("2d");
    handleDraw = function(fX, fY, tX, tY) {
      context.moveTo(fX, fY);
      x = tX;
      y = tY;
      if (draw) {
        context.lineTo(x, y);
        return context.stroke();
      }
    };
    drawing = function(value) {
      return socket.send({
        msgtype: "drawing",
        value: value
      });
    };
    canvas.onmousemove = function() {
      var toX, toY, _ref;
      _ref = [event.clientX - 9, event.clientY - 8], toX = _ref[0], toY = _ref[1];
      socket.send({
        msgtype: "moving",
        value: [x, y, toX, toY]
      });
      return handleDraw(x, y, toX, toY);
    };
    canvas.onmousedown = function() {
      draw = true;
      return drawing(draw);
    };
    return canvas.onmouseup = function() {
      draw = false;
      return drawing(draw);
    };
  };
}).call(this);
