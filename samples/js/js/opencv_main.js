if (typeof OpenCV == "undefined" || !OpenCV) {
  OpenCV = {};
}

OpenCV.PipelineBuilder = {
  _moduleList: [],
  _selectedList: [],
  _sourceDrawer: null,

  register: function ML_register(module) {
    this._moduleList.push(module);
  },

  build: function ML_build(selectedModules) {
    $('#pane_holder').empty(); 

    // this._sourceDrawer is in charge of drawing source image in the page. 
    this._sourceDrawer = new OpenCV.Module("Source Image", "Source Image");
    
    this._sourceDrawer.attach = function($target) {
      Object.getPrototypeOf(this).attach.call(this, $target);

      $('<p>')
        .attr('id', 'image_width')
        .attr('class', "ui-widget")
        .appendTo(this._$rightPane)
        ;
    }
    this._sourceDrawer.draw = function (message) {
      Object.getPrototypeOf(this).draw.call(this, message);
      this._$rightPane.find('#image_width')
        .text('Width: ' + message.imageData.width + '; Height: ' + message.imageData.height); 
        ; 
    };
    this._sourceDrawer.attach($('#pane_holder'));

    selectedModules.forEach(function(item) {
      item.attach($('#pane_holder'));
      }); 

    this._selectedList = selectedModules;
  }
};

OpenCV.MainCommandDispatcher = {
  _worker: null,

  init: function MCD_init() {
    this._worker = new Worker('js/opencv_worker.js');
    this._worker.onmessage = this.receiveMessage;
  },

  receiveMessage: function MCD_receiveMessage(e) {
    var aMessage = e.data;

    for (let key in aMessage) {
      if (aMessage.hasOwnProperty(key)) {

        OpenCV.PipelineBuilder._moduleList.every( (m) => {
          if (m.name === key) {
            m.draw(aMessage[key]);
            return false;
          }
          // Keep searching.    
          return true;
        })
      }
    }
  },

  postMessage: function ML_postMessage(sendBuffer) {
    // Pass image data to worker thread. Invoke a memory copy 
    if (!!sendBuffer) {
      let imageData = OpenCV.ImageLoader.createImageData();
      OpenCV.PipelineBuilder._sourceDrawer.draw({
        imageData: imageData
      });

      this._worker.postMessage({
        buffer: imageData.data.buffer,
        size: [imageData.width, imageData.height]
      }, [imageData.data.buffer]);
    // Pass opencv algorithm setting.
    } else {
      this._worker.postMessage({
        settings: JSON.stringify(OpenCV.PipelineBuilder._selectedList),
      });
    }
  }
};

//OpenCV.Module.
$(function() {  
  OpenCV.MainCommandDispatcher.init();
  
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
      OpenCV.ImageLoader
        .load(file)
        .then(function() {
          OpenCV.PipelineBuilder.build([OpenCV.ThresholdModule, OpenCV.FilterModule, OpenCV.MorphologyModule, OpenCV.HistogramModule]);
          OpenCV.MainCommandDispatcher.postMessage(true);
          OpenCV.MainCommandDispatcher.postMessage();
        })
        ;
    })
    ;
});
