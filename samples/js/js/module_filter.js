if (typeof OpenCV == "undefined" || !OpenCV) {
  OpenCV = {};
}

// ==============================================================
//   Dummy Module
// in == out
OpenCV.FilterModule = new OpenCV.Module();
OpenCV.FilterModule.getName = function() {
  return 'Filter';
}

OpenCV.FilterModule.attach = function($target) {
  Object.getPrototypeOf(this).attach.call(this, $target);
  var self = this;
  // Default value.
  this._blurType = "blur"
  this._kernelSize = 3;

  // Filter algorithm selection widget.
  let $type = $('<div>')
    .attr('id', 'blur_type')
    .appendTo(this._$rightPane)
    .html('<input type="radio" id="bt_radio1" name="THRESH_TYPE" value="blur" checked="checked"><label for="bt_radio1">Blur</label> \
    <input type="radio" id="bt_radio2" name="THRESH_TYPE" value="GaussianBlur"><label for="bt_radio2">GaussianBlur</label> \
    <input type="radio" id="bt_radio3" name="THRESH_TYPE" value="medianBlur"><label for="bt_radio3">MedianBlur</label> \
    ')
    .css('margin-top', '10px')
    ;

  $('#blur_type input[type=radio]')
    .change(function() {
      self._blurType = this.value;
      self._pin();
    })
    ;

  $type.buttonset();

  // Kernel size selection.
  var kernelSizeCaption = $('<p>')
    .text('Kernel Size: ' + this._kernelSize)
    .attr('class', "ui-widget")
    .appendTo(this._$rightPane)
    ;
  $('<div>')
    .appendTo(this._$rightPane)
    .slider({
      value: this._kernelSize,
      min: 1,
      max: 11,
      step: 2,
      animation: true,
      slide: function(evt, ui) {
        if (!!self._source) {
          self._kernelSize = ui.value;
          kernelSizeCaption.text('Kernel size: ' + self._kernelSize);
          OpenCV.PipelineBuilder.push(self._pin(), self);
        }
      }
    });

}

OpenCV.FilterModule.pin = function(imageData) {
  this._source = imageData;  
  this._mat = imageDataToMat(imageData);
  return this._pin(this._source);
}

OpenCV.FilterModule._pin = function() {
  let filterMat = new Module.Mat();
  if (this._blurType === "blur") {
    Module.blur(this._mat, filterMat, [this._kernelSize, this._kernelSize], [-1,-1], Module.BORDER_DEFAULT);
  } else if (this._blurType === "GaussianBlur") {
    Module.GaussianBlur(this._mat, filterMat, [this._kernelSize, this._kernelSize], 0, 0, Module.BORDER_DEFAULT);
  } else if (this._blurType === "medianBlur") {
    Module.medianBlur(this._mat, filterMat, this._kernelSize);
  }

  let filterImageData = matToImageData(filterMat);
  this._$canvas.attr('width', filterMat.size().get(1));
  this._$canvas.attr('height', filterMat.size().get(0));
  this._ctx.putImageData(filterImageData, 0, 0);

  return filterImageData;
}

OpenCV.PipelineBuilder.register(OpenCV.FilterModule);