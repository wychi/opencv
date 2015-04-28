if (typeof OpenCV == "undefined" || !OpenCV) {
  OpenCV = {};
}

// ==============================================================
//   Dummy Module
// in == out
OpenCV.FilterModule = new OpenCV.Module('Filter', 'Filter');

OpenCV.FilterModule.toJSON = function() {
    return JSON.stringify({
    	id: this.name,
    	type: this._blurType,
    	kernel: this._kernelSize
    });
};

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
      OpenCV.MainCommandDispatcher.postMessage();
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
        self._kernelSize = ui.value;
        kernelSizeCaption.text('Kernel size: ' + self._kernelSize);
        OpenCV.MainCommandDispatcher.postMessage();
      }
    });
}

OpenCV.PipelineBuilder.register(OpenCV.FilterModule);