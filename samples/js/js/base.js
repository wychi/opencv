if (typeof OpenCV == "undefined" || !OpenCV) {
  OpenCV = {};
}

function imageDataToMat(imageData) {
  let mat = new Module.Mat(imageData.height, imageData.width, Module.CV_8UC4);
  let view = Module.HEAPU8.subarray(mat.data);
  view.set(imageData.data);

  return mat;
}

function matToImageData(mat) {
  let width = mat.size().get(1);
  let height = mat.size().get(0);
  let length = width * height * mat.elemSize();
  let view = new Uint8ClampedArray(Module.HEAPU8.buffer, mat.data, length);

  return new ImageData(view, width, height);
}

OpenCV.Module = function() {
  this._$pane = null;
  this._$rightPane = null;
  this._$canvas = null;
  this._ctx = null;
};

OpenCV.Module.prototype = {
  constructor: OpenCV.Module,
  attach: function M_attach($target) {
    this._$pane = $("<div>")
        .attr('class', 'image_pane')
        .appendTo($target);

    var $leftPane = $("<div>")
      .attr('class', 'left_pane')
      .appendTo(this._$pane);

   this._$canvas = $("<canvas>")
        .appendTo($leftPane);

    // this._ctx is where you put generated image.  
    this._ctx = this._$canvas[0].getContext('2d');

    // Right pane. Module parameters.
    this._$rightPane = $("<div>")
      .attr('class', 'right_pane')
      .appendTo(this._$pane);
    $('<p>')
      .attr('class', "ui-widget")
      .text(this.getName())
      .appendTo(this._$rightPane)
      ;
  }
};