if (typeof OpenCV == "undefined" || !OpenCV) {
  OpenCV = {};
}

OpenCV.PipelineBuilder = {
  _moduleList: [],
  _selectedList: [],
  _source: null,

  register: function ML_register(module) {
    this._moduleList.push(module);
  },

  build: function ML_build(selectedModules) {
    $('#pane_holder').empty(); 
    this._source = new OpenCV.Module("Source Image", "Source Image");
    this._source.attach($('#pane_holder'));

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
    var message = e.data;

    for (let key in message) {
      if (message.hasOwnProperty(key)) {
        OpenCV.PipelineBuilder._moduleList.every( (m) => {
          if (m.name === key) {
            m.draw(message[key].buffer, message[key].width, message[key].height);
            return false;
          }
          // Keep searching.    
          return true;
        })
      }
    }
  },

  postMessage: function ML_postMessage(sendBuffer) {
    if (!!sendBuffer) {
      let imageData = OpenCV.ImageLoader.createImageData();
      OpenCV.PipelineBuilder._source.draw(imageData.data.buffer, imageData.width, imageData.height);

      this._worker.postMessage({
        buffer: imageData.data.buffer,
        size: [imageData.width, imageData.height]
      }, [imageData.data.buffer]);
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
          OpenCV.PipelineBuilder.build([OpenCV.ThresholdModule, OpenCV.FilterModule, OpenCV.HistogramModule]);
          OpenCV.MainCommandDispatcher.postMessage(true);
          OpenCV.MainCommandDispatcher.postMessage();
        })
        ;
    })
    ;
});
