
if (typeof OpenCV == "undefined" || !OpenCV) {
  OpenCV = {};
}

//  Image data generator.
OpenCV.ImageGenerator = {
  _canvas: null,
  _ctx: null,

  load: function(blob) {
    this._lazyInit();

    var self = this;
    var promise = new Promise(function(resolve, reject) {
      var reader = new FileReader();
      reader.onload = function()  {
        var dataURL = reader.result;

        try {
          self
            ._drawImage(dataURL)
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
    var self = this;

    var $image = $("<img>");
    $image.appendTo("body");

    return new Promise(function(resolve, reject) {
      $image[0].onload = function() {
        self._canvas.width = this.width;
        self._canvas.height = this.height;

        self._ctx.drawImage(this, 0, 0);
        $('body').remove('#draw_target');
        resolve();
      }
      $image.attr('id', 'draw_target');
      $image.attr('src', dataURL);
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
          var $canvas = $("<canvas>");
          $canvas.appendTo('body');
          var data = OpenCV.ImageGenerator.createImageData();
          $canvas[0].putImageData(data.data, 0, 0);
        })
        ;
    })
    ;
});