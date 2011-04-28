(function() {
  window.onload = function() {
    var cancel, canvas, context, draw, drawing, handleDraw, socket, x, y, _ref;
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
    canvas.onmouseup = function() {
      draw = false;
      return drawing(draw);
    };
    cancel = function(event) {
      if (event.preventDefault) {
        event.preventDefault();
      }
      return false;
    };
    canvas.ondragenter = cancel;
    canvas.ondragover = cancel;
    return canvas.ondrop = function() {
      var data, reader;
      cancel(event);
      data = event.dataTransfer;
      reader = new FileReader();
      console.log(reader);
      reader.onloadend = function(event) {
        var dH, dW, dX, dY, image, _ref, _ref2;
        image = new Image();
        _ref = [canvas.width / 4, 0], dX = _ref[0], dY = _ref[1];
        _ref2 = [canvas.width / 2, canvas.height], dW = _ref2[0], dH = _ref2[1];
        image.onload = function() {
          return context.drawImage(image, dX, dY, dW, dH);
        };
        return image.src = event.target.result;
      };
      reader.readAsDataURL(data.files[0]);
      return false;
    };
  };
}).call(this);
