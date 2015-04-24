OpenCV.ThresholdModule = new OpenCV.Module();
OpenCV.ThresholdModule.getName = function() {
  return 'Threshold Module';
}

OpenCV.ThresholdModule.attach = function($target) {
  Object.getPrototypeOf(this).attach.call(this, $target);
  var self = this;
  // Add slider
  $('<p>')
    .text('Threshold')
    .css('text-align', 'center')
    .appendTo(this._$rightPane)
    ;
  $('<div>')
    .attr('id', 'threshold_slider')
    .appendTo(this._$rightPane)
    .slider({
      value: 100,
      min: 0,
      max: 255,
      step: 1,
      animation: true,
      slide: function(evt, ui) {
        if (!!self._source) {
          self._threshold = ui.value;
          self._pin(self._source);
        }
      }
    });
  $('<p>')
    .text('Threshold Max')
    .css('text-align', 'center')
    .appendTo(this._$rightPane)
    ;
  $('<div>')
    .attr('id', 'thresholdmax_slider')
    .appendTo(this._$rightPane)
    .slider({
      value: 210,
      min: 0,
      max: 255,
      step: 1,
      animation: true,
      slide: function(evt, ui) {
        if (!!self._source) {
          self._thresholdMax = ui.value;
          self._pin(self._source);
        }
      }
    });
  let $type = $('<div>')
    .attr('id', 'threshold_type')
    .appendTo(this._$rightPane)
    .html('<input type="radio" id="radio1" name="THRESH_TYPE" value="THRESH_BINARY" checked="checked"><label for="radio1">THRESH_BINARY</label> \
    <input type="radio" id="radio3" name="THRESH_TYPE" value="THRESH_TRUNC"><label for="radio3">THRESH_TRUNC</label> \
    <input type="radio" id="radio4" name="THRESH_TYPE" value="THRESH_TOZERO"><label for="radio4">THRESH_TOZERO</label> \
    ')
    .css('margin-top', '10px')
    ;
    // Tempoary remove INV types since it's not work.
    //<input type="radio" id="radio2" name="THRESH_TYPE" value="THRESH_BINARY_INV"><label for="radio2">THRESH_BINARY_INV</label> \
    //<input type="radio" id="radio5" name="THRESH_TYPE" value="THRESH_TOZERO_INV"><label for="radio5">THRESH_TOZERO_INV</label> \
  $('#threshold_type input[type=radio]')
    .change(function() {
      self._thresholdType = Module[this.value];
      self._pin(self._source);
    })
    ;
  $type.buttonset();

  // default threshold vaue.
  this._thresholdType = Module.THRESH_BINARY;
  this._threshold = 100;
  this._thresholdMax = 210;
}

OpenCV.ThresholdModule.pin = function (imageData) {
  this._source = new ImageData(imageData.data, imageData.width, imageData.height);
  return this._pin(this._source);
}

OpenCV.ThresholdModule._pin = function (imageData) {
  // Generate threshold matrix.
  let sourceMat = imageDataToMat(imageData);
  let thresholdMat= new Module.Mat();
  Module.threshold(sourceMat, thresholdMat, this._threshold, this._thresholdMax, this._thresholdType);

  // Generate threshold image data.
  let width = thresholdMat.size().get(1);
  let height = thresholdMat.size().get(0);
  let length = width * height * thresholdMat.elemSize();
  let thresholdView = new Uint8ClampedArray(Module.HEAPU8.buffer, thresholdMat.data, length);
  let thresholdImageData = new ImageData(thresholdView, width, height);

  // Draw threshold image data.
  this._$canvas.attr('width', width);
  this._$canvas.attr('height', height);
  this._ctx.putImageData(thresholdImageData, 0, 0);

  sourceMat.delete();
  thresholdMat.delete();
  return thresholdImageData;
}

OpenCV.PipelineBuilder.register(OpenCV.ThresholdModule);
