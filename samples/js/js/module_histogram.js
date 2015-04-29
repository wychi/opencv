if (typeof OpenCV == "undefined" || !OpenCV) {
  OpenCV = {};
}

OpenCV.HistogramModule = new OpenCV.Module('Histogram', 'Histogram');

OpenCV.HistogramModule.toJSON = function() {
  return JSON.stringify({
    id: this.name
  });
};

OpenCV.HistogramModule.attach = function($target) {
  Object.getPrototypeOf(this).attach.call(this, $target);

  // Add a canvas in right pane for histogram drawing.
  this._$histCanvas = $('<canvas>')
  .appendTo(this._$rightPane)
  .width(this._$rightPane.width())
  .height(this._$rightPane.height() - 40)
  .attr('id', 'histogram')
  .attr('width', this._$rightPane.width())
  .attr('height', this._$rightPane.height() - 40)
  ;
}

OpenCV.HistogramModule.draw = function (message) {
  Object.getPrototypeOf(this).draw.call(this, message);
  
  // Draw histogram
  // XXX:
  // It's too bad that we can submit draw call in worker thread.
  // Canvas proxy need!
  let canvasWidth = this._$histCanvas.width();
  let canvasHeight = this._$histCanvas.height();
  let view = new Uint8ClampedArray(message.histogramBuffer);
  let max = 0;
  for (let i = 0; i < message.histogramLength; i++) {
    if (view[i] > max)
      max = view[i];
  }
  
  let yratio = canvasHeight / max; 
  let xratio = canvasWidth / message.histogramBins;
  let ctx = this._$histCanvas[0].getContext('2d');
  ctx.save();

  // clear
  ctx.clearRect( 0, 0, canvasWidth, canvasHeight);

  // draw 
  ctx.scale(1, -1);
  ctx.translate(0, -canvasHeight);
  ctx.fillStyle= "#0000FF"; // I am blue....
  for (let i = 0; i < message.histogramLength; i++) {
    // "- 1" to introduce a gap between two bars.
    ctx.fillRect(i * xratio, 0, xratio - 1, view[i] * yratio);
  }

  ctx.restore();
}

OpenCV.PipelineBuilder.register(OpenCV.HistogramModule);