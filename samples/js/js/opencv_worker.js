
importScripts('../lib/opencv.js');

function imageDataToMat(imageData) {
  var mat = new Module.Mat(imageData.height, imageData.width, Module.CV_8UC4);
  var view = Module.HEAPU8.subarray(mat.data);
  // XXX
  // Clone --- bad. We need this clone since mat.data must be located inside Emscripten HEAP.
  view.set(imageData.data);

  return mat;
}

// Clone mat.data into a data array which 
function matToImageData(mat) {
  var width = mat.size().get(1);
  var height = mat.size().get(0);
  var length = width * height * mat.elemSize();

  // XXX
  // Another clone -- even worse.... 
  // Why not just return mat.data back to main thread directly?
  // mat.data is belong to Module.HEAP, which is a ArrayBuffer, we can't just transfer 
  // Module.HEAP to main thread since we lost control of that HEAP here by doing taht, 
  // worker can not do anything without it. 
  // As a result, we need to clone We need this clone for transferable and memory management. 
  var matView = new Uint8ClampedArray(Module.HEAPU8.buffer, mat.data, length);
  var clonedBuffer = new ArrayBuffer(length);
  var clonedView = new Uint8ClampedArray(clonedBuffer);
  clonedView.set(matView);

  return new ImageData(clonedView, width, height);
}

var timeouts = [];

onmessage = function (event) {
	if (!!event.data.buffer) {
	  WorkerCommandDispatcher.recieveSourceImage(event.data.buffer, event.data.size);
  }
	if (!!event.data.settings) {
	  var settings = JSON.parse(event.data.settings);
	  timeouts.forEach(function(v) {
		  clearTimeout(v);
	  });
	  timeouts = [];

	  timeouts.push(setTimeout(function() { 
		  WorkerCommandDispatcher.receiveMessage(settings) 
	  }, 0));
	}
}

WorkerCommandDispatcher = {
	_image: null,

	Filter: function (setting, imageData) {
		var source = imageDataToMat(imageData);
		var dest = new Module.Mat();
		if (setting.type === "blur") {
		    Module.blur(source, dest, [setting.kernel, setting.kernel], [-1,-1], Module.BORDER_DEFAULT);
		} else if (setting.type === "GaussianBlur") {
		    Module.GaussianBlur(source, dest, [setting.kernel, setting.kernel], 0, 0, Module.BORDER_DEFAULT);
		} else if (setting.type === "medianBlur") {
			Module.medianBlur(source, dest, setting.kernel);
		} else {
			alert("Unsupport filter type.");
		}

		var proceeded = matToImageData(dest);

		source.delete();
		dest.delete();

		return proceeded;
	},

	Histogram: function (setting, imageData) {
  		var source = imageDataToMat(imageData);
  		var gray = new Module.Mat();

  		Module.cvtColor(source, gray, Module.CV_RGBA2GRAY, 0);
  		source.delete();

    	var rgba = new Module.Mat();
    	Module.cvtColor(gray, rgba, Module.CV_GRAY2RGBA, 0);
    	var proceeded = matToImageData(rgba);

    	rgba.delete();
    	gray.delete();

    	return proceeded;
	},

	Threshold : function (setting, imageData) {
	  	// Generate threshold matrix.
  		var source = imageDataToMat(imageData);
  		var dest= new Module.Mat();
  		Module.threshold(source, dest, setting.threshold, setting.thresholdMax, setting.type);

  		// Generate threshold image data.
  		var proceeded = matToImageData(dest);

  		source.delete();
  		dest.delete();

  		return proceeded;
	},

	recieveSourceImage: function(buffer, size) {
		var view = new Uint8ClampedArray(buffer);
  	this._image = new ImageData(view, size[0], size[1])
	},
	receiveMessage: function (settings) {
		var imageData = this._image;
		var imageDatas = [];
		var message = {}
		var self = this;
		settings.forEach(function (v) {
			var setting = JSON.parse(v);
			if (!!self[setting.id]) {
				imageData = self[setting.id](setting, imageData);
				console.assert(imageData);
				imageDatas.push(imageData.data.buffer);
				message[setting.id] = { 
					buffer: imageData.data.buffer,
					width: imageData.width,
					height: imageData.height
				};
			}
		});

		postMessage(message, imageDatas);
	}
};
