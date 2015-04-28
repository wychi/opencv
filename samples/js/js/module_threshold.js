if (typeof OpenCV == "undefined" || !OpenCV) {
  OpenCV = {};
}

OpenCV.ThresholdModule = new OpenCV.Module('Threshold', 'Threshold');

OpenCV.ThresholdModule.toJSON = function() {
    return JSON.stringify({
      id: this.name,
      type: this._thresholdType,
      threshold: this._threshold,
      thresholdMax: this._thresholdMax
    });
};

// By moving OpenCV call to worker thread, we suppose do not need to link opencv.js
// into main thread modules. Unfortunately, we still need some constant definition
// exported from opencv.js. Cheap solution is to re-define those constant manually. 
OpenCV.ThresholdType = {
  THRESH_BINARY: 0, 
  THRESH_BINARY_INV: 1, 
  THRESH_TRUNC: 2, 
  THRESH_TOZERO: 3, 
  THRESH_TOZERO_INV: 4, 
  THRESH_MASK: 7,
  THRESH_OTSU: 8, 
  THRESH_TRIANGLE: 16
}; 

OpenCV.ThresholdModule.attach = function($target) {
  Object.getPrototypeOf(this).attach.call(this, $target);
  var self = this;

  // default threshold vaue.
  this._thresholdType = OpenCV.ThresholdType.THRESH_BINARY;
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
      self._thresholdType = OpenCV.ThresholdType[this.value];
      OpenCV.MainCommandDispatcher.postMessage();
    })
    ;

  // Threshold label and slider.
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
        self._threshold = ui.value;
        tresholdCaption.text('Threshold :' + self._threshold);
        OpenCV.MainCommandDispatcher.postMessage();
      }
    });

  // Threshold max lable and slider.
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
        self._thresholdMax = ui.value;
        tresholdMaxCaption.text('Threshold Max: ' + self._thresholdMax);
        OpenCV.MainCommandDispatcher.postMessage();
      }
    });

  $type.buttonset();
}

OpenCV.PipelineBuilder.register(OpenCV.ThresholdModule);
