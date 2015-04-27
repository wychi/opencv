if (typeof OpenCV == "undefined" || !OpenCV) {
  OpenCV = {};
}

OpenCV.HistogramModule = new OpenCV.Module();
OpenCV.HistogramModule.getName = function() {
  return 'Histogram';
}

OpenCV.HistogramModule.attach = function($target) {
  Object.getPrototypeOf(this).attach.call(this, $target);

  this._$histCanvas = $('<canvas>')
    .appendTo(this._$rightPane)
    .width(this._$rightPane.width())
    .height(this._$rightPane.height() - 40)
    .attr('id', 'histogram')
    .attr('width', this._$rightPane.width())
    .attr('height', this._$rightPane.height() - 40)
    ;
}

OpenCV.HistogramModule.pin = function (imageData) {
  // Create and draw gray image.
  let source = imageDataToMat(imageData);
  let gray = new Module.Mat();

  Module.cvtColor(source, gray, Module.CV_RGBA2GRAY, 0);
  source.delete();

  {
    // Draw grayscale image.
    let rgba = new Module.Mat();
    Module.cvtColor(gray, rgba, Module.CV_GRAY2RGBA, 0);
    let width = rgba.size().get(1);
    let height = rgba.size().get(0);
    let length = width * height * rgba.elemSize();
    let grayView = new Uint8ClampedArray(Module.HEAPU8.buffer, rgba.data, length);

    this._$canvas.attr('width', width).attr('height', height);
    this._ctx.putImageData(new ImageData(grayView, width, height), 0, 0);

    rgba.delete();
 }

 {
    // Caculate histogram
    const bins = 100;
    let mask = new Module.Mat();
    let hist = new Module.Mat();
    let binSize = Module._malloc(4);
    let binView = new Int32Array(Module.HEAP8.buffer, binSize);
    binView[0] = bins;
    Module.calcHist(gray, 1, 0, mask, hist, 1, binSize, 0, true, false);

    // Draw histogram(hist)
    let canvasWidth = this._$histCanvas.width();
    let canvasHeight = this._$histCanvas.height();
    let width = gray.size().get(1);
    let height = gray.size().get(0);
    let length = width * height * gray.elemSize();
    let grayView = new Uint8ClampedArray(Module.HEAPU8.buffer, gray.data, length);
    let max = 0;
    for (let i = 0; i < length; i++) {
      if (grayView[i] > max)
        max = grayView[i];
    }
    let yratio = canvasHeight / max; 
    let xratio = canvasWidth / bins;
    let ctx = this._$histCanvas[0].getContext('2d');
    ctx.clearRect( 0, 0, canvasWidth, canvasHeight);
    ctx.save();
    // vertical flip 
    ctx.scale(1, -1);
    ctx.translate(0, -canvasHeight);
    ctx.fillStyle= "#0000FF";
    for (let i = 0; i < length; i++) {
      ctx.fillRect(i * xratio, 0, xratio, grayView[i] * yratio);
    }
    ctx.restore();
    mask.delete();
    Module._free(binSize);
  }

  gray.delete();
  return imageData;
}

OpenCV.PipelineBuilder.register(OpenCV.HistogramModule);