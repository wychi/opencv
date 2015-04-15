
QUnit.test("test_imgProc", function(assert) {
  // C++
  //   void calcHist(const Mat*, int, const int*, InputArray, OutputArray,
  //                 int, const int*, const float**, bool, bool)
  // Embind
  //   void calcHist(const Mat*, int, const int*, Mat &, Mat &,
  //                 int, uintptr_t, uintptr_t, bool, bool)
  {
    let histSize = 255;
    let source = Module.Mat.zeros(20, 20, Module.CV_8UC1);

    let hist = new Module.Mat();
    let mask = new Module.Mat();
    let binSize = Module._malloc(4);
    let binView = new Int32Array(Module.HEAP8.buffer, binSize);
    // Or, let binView = Module.HEAP32.subarray(binSize >> 2);
    binView[0] = 10;
    // TBD
    // float **: change this parameter to vector?
    Module.calcHist(source, 1, 0, mask, hist, 1, binSize, 0, true, false);

    let size = hist.size();
    assert.equal(size.size(), 2);
    assert.equal(size.get(0), 10);
    assert.equal(size.get(1), 1);

    // Do we need to verify data in histogram?
    let dataView = Module.HEAPU8.subarray(hist.data);

    // Free resource
    mask.delete();
    hist.delete();
    source.delete();
  }

  // C++
  //   void cvtColor(InputArray, OutputArray, int, int)
  // Embind
  //   void cvtColor(Mat &, Mat &, int, int);
  {
    let source = new Module.Mat(10, 10, Module.CV_8UC3);
    let dest = new Module.Mat();

    Module.cvtColor(source, dest, Module.CV_BGR2GRAY, 0);
    assert.equal(dest.channels(), 1);

    Module.cvtColor(source, dest, Module.CV_BGR2BGRA, 0);
    assert.equal(dest.channels(), 4);

    dest.delete();
    source.delete();
  }
  // C++
  //   void equalizeHist(InputArray, OutputArray);
  // Embind
  //   void equalizeHist(Mat &, Mat &);
  {
    let source = new Module.Mat(10, 10, Module.CV_8UC1);
    let dest = new Module.Mat();

    Module.equalizeHist(source, dest);

    // eualizeHist changes the content of a image, but does not alter meta data
    // of it.
    assert.equal(source.channels(), dest.channels());
    assert.equal(source.type(), dest.type());
    assert.equal(source.size().size(), dest.size().size());
    // Varifiy content>

    dest.delete();
    source.delete();
  }
});
