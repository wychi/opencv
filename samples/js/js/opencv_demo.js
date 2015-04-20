
if (typeof OpenCV == "undefined" || !OpenCV) {
  OpenCV = {};
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

    console.log("canvas.width = " + this._canvas.width);
    console.log("canvas.height = " + this._canvas.height);
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
  this._$control = null;
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
    this._$control = $("<div>")
      .attr('class', 'right_pane')
      .appendTo(this._$pane);
  }
};

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
    .appendTo(this._$control)
    ;
  $('<div>')
    .attr('id', 'threshold_slider')
    .appendTo(this._$control)
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
    .appendTo(this._$control)
    ;
  $('<div>')
    .attr('id', 'thresholdmax_slider')
    .appendTo(this._$control)
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

  this._threshold = 100;
  this._thresholdMax = 210;
}

OpenCV.ThresholdModule.pin = function (imageData) {
  this._source = new ImageData(imageData.data, imageData.width, imageData.height);
  return this._pin(this._source);
}

OpenCV.ThresholdModule._pin = function (imageData) {
  // Generate threshold matrix.
  let sourceMat = new Module.Mat(imageData.height, imageData.width, Module.CV_8UC4);
  let sourceView = Module.HEAPU8.subarray(sourceMat.data);
  sourceView.set(imageData.data);
  let thresholdMat= new Module.Mat();
  Module.threshold(sourceMat, thresholdMat, this._threshold, this._thresholdMax, Module.THRESH_BINARY);

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
          OpenCV.PipelineBuilder.build([OpenCV.DummyModule, OpenCV.ThresholdModule]);
          OpenCV.PipelineBuilder.push(imageData);
        })
        ;
    })
    ;
});