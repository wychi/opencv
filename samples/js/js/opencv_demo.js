
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

OpenCV.Module = function() {

};

OpenCV.Module.prototype = {
  constructor: OpenCV.Module,

  begin: function OCVM_begin(targetDiv) {
    this._targetDiv = targetDiv;
  },
};

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
          // Draw source image
          var $canvas = $("<canvas>");
          var ctx = $canvas[0].getContext('2d');
          $canvas.appendTo('body');
          $canvas.attr('width', imageData.width);
          $canvas.attr('height', imageData.height);
          ctx.putImageData(imageData, 0, 0);

          // Test threshold 
          let mat = new Module.Mat(imageData.height, imageData.width, Module.CV_8UC4);
          let matView = Module.HEAPU8.subarray(mat.data);
          matView.set(imageData.data);

          const THRESHOLD = 100.0;
          const THRESHOLD_MAX = 210.0;
          let dest = new Module.Mat();
          Module.threshold(mat, dest, THRESHOLD, THRESHOLD_MAX, Module.THRESH_BINARY);
          let dataLen = dest.size().get(0) * dest.size().get(1) * dest.elemSize();
          let destView = Module.HEAPU8.subarray(dest.data, dest.data + dataLen);
          imageData.data.set(destView);
          var $canvas2 = $("<canvas>");
          ctx = $canvas2[0].getContext('2d');
          $canvas2.appendTo('body');
          $canvas2.attr('width', imageData.width);
          $canvas2.attr('height', imageData.height);
          ctx.putImageData(imageData, 0, 0);
        })
        ;
    })
    ;
});