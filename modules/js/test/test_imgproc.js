
QUnit.test("test_imgProc", function(assert) {
  // C++
  //   void calcHist(const Mat*, int, const int*, InputArray, OutputArray,
  //                 int, const int*, const float**, bool, bool)
  // Embind
  //   void calcHist(const Mat*, int, const int*, InputArray, OutputArray,
  //                 int, uintptr_t, uintptr_t, bool, bool)
  {
    let histSize = 255;
    let source = new Module.Mat(10, 10, Module.CV_8UC1);
    let hist = new Module.Mat();
    let mask = new Module.Mat();
    let sz = Module._malloc(4);
    let szView = new Int32Array(sz);
    szView[0] = 255;
    Module.calcHist(source, 1, 0, mask, hist, 1, sz, 0, true, false);

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
});
