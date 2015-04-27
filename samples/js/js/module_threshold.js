if (typeof OpenCV == "undefined" || !OpenCV) {
  OpenCV = {};
}

OpenCV.ThresholdModule = new OpenCV.Module();
OpenCV.ThresholdModule.getName = function() {
  return 'Threshold';
}

OpenCV.ThresholdModule.attach = function($target) {
  Object.getPrototypeOf(this).attach.call(this, $target);
  var self = this;

  // default threshold vaue.
  this._thresholdType = Module.THRESH_BINARY;
  this._threshold = 100;
  this._thresholdMax = 210;

  // Threshold type radio buttons.
  let $type = $('<div>')
    .attr('id', 'threshold_type')
    .appendTo(this._$rightPane)
    .html('<input type="radio" id="radio1" name="THRESH_TYPE" value="THRESH_BINARY" checked="checked"><label for="radio1">Binary</label> \
    <input type="radio" id="radio3" name="THRESH_TYPE" value="THRESH_TRUNC"><label for="radio3">Truncate</label> \
    <input type="radio" id="radio4" name="THRESH_TYPE" value="THRESH_TOZERO"><label for="radio4">ToZero</label> \
    ')
    .css('margin-top', '10px')
    ;
    // Tempoary remove INV types since it's just not work.
    //<input type="radio" id="radio2" name="THRESH_TYPE" value="THRESH_BINARY_INV"><label for="radio2">THRESH_BINARY_INV</label> \
    //<input type="radio" id="radio5" name="THRESH_TYPE" value="THRESH_TOZERO_INV"><label for="radio5">THRESH_TOZERO_INV</label> \
  $('#threshold_type input[type=radio]')
    .change(function() {
      self._thresholdType = Module[this.value];
      OpenCV.PipelineBuilder.push(self._pin(), self);
    })
    ;

  // Threshold slider.
  var tresholdCaption = $('<p>')
    .text('Threshold: ' + this._threshold)
    .attr('class', "ui-widget")
    .appendTo(this._$rightPane)
    ;
  $('<div>')
    .appendTo(this._$rightPane)
    .slider({
      value: this._threshold,
      min: 0,
      max: 255,
      step: 1,
      animation: true,
      slide: function(evt, ui) {
        if (!!self._source) {
          self._threshold = ui.value;
          tresholdCaption.text('Threshold :' + self._threshold);
          OpenCV.PipelineBuilder.push(self._pin(), self);
        }
      }
    });

  // Threshold max slider.
  var tresholdMaxCaption = $('<p>')
    .text('Threshold Max: ' + this._thresholdMax)
    .attr('class', "ui-widget")
    .appendTo(this._$rightPane)
    ;
  $('<div>')
    .appendTo(this._$rightPane)
    .slider({
      value: this._thresholdMax,
      min: 0,
      max: 255,
      step: 1,
      animation: true,
      slide: function(evt, ui) {
        if (!!self._source) {
          self._thresholdMax = ui.value;
          tresholdMaxCaption.text('Threshold Max: ' + self._thresholdMax);
          OpenCV.PipelineBuilder.push(self._pin(), self);
        }
      }
    });

  $type.buttonset();
}

OpenCV.ThresholdModule.pin = function (imageData) {
  this._source = new ImageData(imageData.data, imageData.width, imageData.height);
  return this._pin();
}

OpenCV.ThresholdModule._pin = function () {
  // Generate threshold matrix.
  let sourceMat = imageDataToMat(this._source);
  let thresholdMat= new Module.Mat();
  Module.threshold(sourceMat, thresholdMat, this._threshold, this._thresholdMax, this._thresholdType);

  // Generate threshold image data.
  let thresholdImageData = matToImageData(thresholdMat);
  
  // Draw threshold image data.
  this._$canvas.attr('width', thresholdMat.size().get(1));
  this._$canvas.attr('height', thresholdMat.size().get(0));
  this._ctx.putImageData(thresholdImageData, 0, 0);

  sourceMat.delete();
  thresholdMat.delete();

  return thresholdImageData;
  //return this._source;
}

OpenCV.PipelineBuilder.register(OpenCV.ThresholdModule);
