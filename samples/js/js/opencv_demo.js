if (typeof OpenCV == "undefined" || !OpenCV) {
  OpenCV = {};
}

function imageDataToMat(imageData) {
  let mat = new Module.Mat(imageData.height, imageData.width, Module.CV_8UC4);
  let view = Module.HEAPU8.subarray(mat.data);
  view.set(imageData.data);

  return mat;
}

//  Image data generator.
OpenCV.ImageGenerator = {
  _canvas: null,
  _ctx: null,

  load: function(blob) {
    /*this._lazyInit();

    let $image = $('#baboon_img');
    this._canvas.width = $image[0].width;
    this._canvas.height = $image[0].height;

    this._ctx.drawImage($image[0], 0, 0);
    return new Promise(function(resolve, reject) {
        resolve();
      });*/
    this._lazyInit();
    var self = this;
    var reader = new FileReader();
    var promise = new Promise(function(resolve, reject) {
      reader.onload = function(e)  {
        var dataURL = reader.result;
        //var dataURL = reader.result.split(',')[1];
        //dataURL = atob(dataURL);
        //var aaa = btoa(decodeURIComponent(escape(dataURL)));

        try {
          self
            ._drawImage(dataURL)
            //._drawImage("data:image/png;base64," + aaa)
            .then(function() { 
              resolve();
            });
        } catch(e) {
          alert("TBD: something wrong. Error message.");
          reject();
        }
      };
        
      reader.readAsDataURL(blob);
    });

    return promise;
  },

  createImageData: function SI_getImageData() {
    if (this._ctx === undefined) {
      return null;
    }

    return this._ctx.getImageData(0, 0, this._canvas.width, this._canvas.height);
  },

  _drawImage: function SI_load(dataURL) {
    var $image = $("<img>");
    $image.appendTo("body");

    $image.attr('display', 'none');
    $image.attr('id', 'draw_target');
    $image.attr('src', dataURL);

    var self = this;
    return new Promise(function(resolve, reject) {
      $image[0].onload = function() {
        self._canvas.width = this.width;
        self._canvas.height = this.height;

        self._ctx.drawImage(this, 0, 0);
        $('#draw_target').remove();
        resolve();
      }
    });
  },

  _lazyInit: function SI_lazyInit() {
    if (null === this._canvas) {
      this._canvas = $("<canvas>")[0];
      this._ctx = this._canvas.getContext("2d");
    }
  }
};

OpenCV.PipelineBuilder = {
  _moduleList: [],
  _selectedList: [],

  register: function ML_register(module) {
    this._moduleList.push(module);
  },
  build: function ML_build(selectedModules) {
    $('#pane_holder').empty(); 
    selectedModules.forEach(function(item) {
      item.attach($('#pane_holder'));
      }); 
    this._selectedList = selectedModules;
  },

  push: function ML_push(imageData) {
    for (let i = 0; i < this._selectedList.length; i++) {
      imageData = this._selectedList[i].pin(imageData);
    }
  }
};

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

    // Control pane
    this._$rightPane = $("<div>")
      .attr('class', 'right_pane')
      .appendTo(this._$pane);
  }
};

// ==============================================================
//   Dummy Module
// in == out
OpenCV.DummyModule = new OpenCV.Module();
OpenCV.DummyModule.getName = function() {
  return 'Dummy Module';
}

OpenCV.DummyModule.pin = function(imageData) {
  this._$canvas.attr('width', imageData.width);
  this._$canvas.attr('height', imageData.height);
  this._ctx.putImageData(imageData, 0, 0);

  return imageData;
}

OpenCV.PipelineBuilder.register(OpenCV.DummyModule);

// ==============================================================
//   Histogram Module
OpenCV.HistogramModule = new OpenCV.Module();
OpenCV.HistogramModule.getName = function() {
  return 'Histogram Module';
}

OpenCV.HistogramModule.attach = function($target) {
  Object.getPrototypeOf(this).attach.call(this, $target);
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

    // Create a canvas for drawing histogram(hist)
    let $histCanvas = $('<canvas>')
      .appendTo(this._$rightPane)
      .width(this._$rightPane.width())
      .height(this._$rightPane.height())
      .attr('width', this._$rightPane.width())
      .attr('height', this._$rightPane.height())
      ;

    // Draw histogram(hist)
    let canvasWidth = $histCanvas.width();
    let canvasHeight = $histCanvas.height();
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
    let ctx = $histCanvas[0].getContext('2d');
    ctx.save();
    // vertical flip 
    ctx.scale(1, -1);
    ctx.translate(0, -canvasHeight);
    ctx.fillStyle="#0000FF";
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

// ==============================================================
//   Threshold Module
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

//OpenCV.Module.
$(function() {
  // Load button.
  $("#load_button")
    .button()
    .on("click", function(event) {
      $("#load_file_input").click(); 
    })
    ;

  // File Reader.
  $("#load_file_input")
    .change(function(evt) {
      var file = evt.target.files[0];
      OpenCV.ImageGenerator
        .load(file)
        .then(function() {
          var imageData = OpenCV.ImageGenerator.createImageData();
          //OpenCV.PipelineBuilder.build([OpenCV.DummyModule, OpenCV.ThresholdModule]);
          OpenCV.PipelineBuilder.build([OpenCV.DummyModule, OpenCV.HistogramModule, OpenCV.ThresholdModule]);
          OpenCV.PipelineBuilder.push(imageData);
        })
        ;
    })
    ;
});
