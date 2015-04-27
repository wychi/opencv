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

  push: function ML_push(imageData, from) {
    var index = this._selectedList.indexOf(from);
    // The last one.
    if (index === (this._selectedList.length - 1)) {
      return;
    }

    index = (index === -1) ? 0: index + 1;
    for (; index < this._selectedList.length; index++) {
      imageData = this._selectedList[index].pin(imageData);
    }
  }
};



// ==============================================================
//   Dummy Module
// in == out
OpenCV.DummyModule = new OpenCV.Module();
OpenCV.DummyModule.getName = function() {
  return 'Source Image';
}

OpenCV.DummyModule.pin = function(imageData) {
  this._$canvas.attr('width', imageData.width);
  this._$canvas.attr('height', imageData.height);
  this._ctx.putImageData(imageData, 0, 0);

  return imageData;
}

OpenCV.PipelineBuilder.register(OpenCV.DummyModule);

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
          OpenCV.PipelineBuilder.build([OpenCV.DummyModule, OpenCV.ThresholdModule, OpenCV.FilterModule, OpenCV.HistogramModule]);
          OpenCV.PipelineBuilder.push(imageData);
        })
        ;
    })
    ;
});
