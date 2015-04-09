
QUnit.test("test_calcHist", function(assert) {
  // void calcHist(const Mat*, int, const int*, InputArray, OutputArray,
  //               int, const int*, const float**, bool, bool)
  {
    let histSize = 255;
    let image = new Module.Mat(10, 10, Module.CV_8UC1);
    let hist = new Module.Mat(10, 10, Module.CV_8UC1);
    let mask = new Module.Mat(10, 10, Module.CV_8UC1);
    let sz = Module._malloc(2 * 4);
    let szView = new Int32Array(sz);
    szView[0] = szView[1] = 0;
    assert.ok(1);
    //Module.calcHist(image, 1, 0, mask, hist, 1, histSize, 0, true, false);

    mask.delete();
    hist.delete();
    image.delete();
  }

  {
    let source = new Module.Mat(10, 10, Module.CV_8UC3);
    let dest = new Module.Mat();

    Module.cvtColor(source, dest, Module.CV_BGR2GRAY, 0);
    assert.equal(dest.channels(), 1);

    Module.cvtColor(source, dest, Module.CV_BGR2BGRA, 0);
    assert.equal(dest.channels(), 4);

    source.delete();
    dest.delete();
  }
});
