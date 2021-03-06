(function() {

  window.onload = function() {
    var cancel, canvas, clearContext, color, colors, context, draw, drawing, handleDraw, socket, width, x, y, _ref;
    _ref = [0, 0], x = _ref[0], y = _ref[1];
    draw = false;
    colors = ["black", "red", "blue", "green", "yellow"];
    color = 0;
    width = 1;
    canvas = document.getElementById("whiteboard");
    canvas.width = document.width - 32;
    canvas.height = document.height - 32;
    context = canvas.getContext("2d");
    socket = io.connect();
    socket.on("message", function(obj) {
      var fromX, fromY, toX, toY, _ref2;
      switch (obj.msgtype) {
        case "drawing":
          draw = obj.value;
          if (draw) return context.beginPath();
          break;
        case "clear":
          return clearContext();
        case "width":
          return width = obj.value;
        case "color":
          color = obj.value;
          return document.getElementById("canvas-color").style.color = colors[color];
        case "moving":
          _ref2 = obj.value, fromX = _ref2[0], fromY = _ref2[1], toX = _ref2[2], toY = _ref2[3];
          return handleDraw(fromX, fromY, toX, toY);
      }
    });
    clearContext = function() {
      return context.clearRect(0, 0, canvas.width, canvas.height);
    };
    document.getElementById("canvas-clear").onclick = function() {
      socket.emit("message", {
        msgtype: "clear",
        value: "nothing"
      });
      return clearContext();
    };
    document.getElementById("canvas-color").onclick = function() {
      color = color === colors.length - 1 ? 0 : color + 1;
      socket.emit("message", {
        msgtype: "color",
        value: color
      });
      return this.style.color = colors[color];
    };
    document.getElementById("canvas-density").onclick = function() {
      width = width >= 17 ? 1 : width + 4;
      return socket.emit("message", {
        msgtype: "width",
        value: width
      });
    };
    handleDraw = function(fX, fY, tX, tY) {
      context.moveTo(fX, fY);
      x = tX;
      y = tY;
      if (draw) {
        context.lineTo(x, y);
        context.lineCap = "round";
        context.lineWidth = width;
        context.strokeStyle = colors[color];
        return context.stroke();
      }
    };
    drawing = function(value) {
      return socket.emit("message", {
        msgtype: "drawing",
        value: value
      });
    };
    canvas.onmousemove = function() {
      var toX, toY, _ref2;
      _ref2 = [event.clientX - 9, event.clientY - 8], toX = _ref2[0], toY = _ref2[1];
      socket.emit("message", {
        msgtype: "moving",
        value: [x, y, toX, toY]
      });
      return handleDraw(x, y, toX, toY);
    };
    canvas.onmousedown = function() {
      draw = true;
      context.beginPath();
      return drawing(draw);
    };
    canvas.onmouseup = function() {
      draw = false;
      return drawing(draw);
    };
    cancel = function(event) {
      if (event.preventDefault) event.preventDefault();
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
        var dH, dW, dX, dY, image, _ref2, _ref3;
        image = new Image();
        _ref2 = [canvas.width / 4, 0], dX = _ref2[0], dY = _ref2[1];
        _ref3 = [canvas.width / 2, canvas.height], dW = _ref3[0], dH = _ref3[1];
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
