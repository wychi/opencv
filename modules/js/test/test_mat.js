// Test all classes defined in mat.hpp

QUnit.test("test_mat_creation", function(assert) {
  // Mat constructors.
  {
    // Mat::Mat(int rows, int cols, int type)
    //  : by giving size and type
    let mat = new Module.Mat(10, 20, Module.CV_8UC3);
    assert.equal(mat.type(), Module.CV_8UC3);
    assert.equal(mat.depth(), Module.CV_8U);
    assert.equal(mat.channels(), 3);
    assert.ok(mat.empty() === false);
    assert.equal(mat.size().width === 10);
    assert.equal(mat.size().height === 20);

    mat.delete();
  }

  {
    // Mat::Mat(const Mat &)
    //  : Copy from another Mat
    let mat = new Module.Mat(mat);
    assert.equal(mat.type(), mat.type());
    assert.equal(mat.depth(), mat.depth());
    assert.equal(mat.channels(), mat.channels());
    assert.equal(mat.empty(), mat.empty());
    assert.equal(mat.size(), mat.size());

    mat.delete();
  }

  {
    // Mat::Mat(Size size, int type, void *data, size_t step=AUTO_STEP)
    //  : primitive pointer is not supported. Need to create an external constructor.
    let matSize = {
      width : 10,
      height: 10
    }
    // 10 * 10 and one channel
    let data = Module._malloc(10 * 10 * 1);
    let view = new Uint8Array(Module.HEAPU8.buffer, data, 10 * 10 * 1);
    let mat = new Module.Mat(matSize, Module.CV_8UC1, view.byteOffset, Module.AUTO_STEP);
    assert.equal(mat.type(), Module.CV_8UC1);
    assert.equal(mat.depth(), Module.CV_8U);
    assert.equal(mat.channels(), 1);
    assert.ok(mat.empty() === false);
    assert.equal(mat.size().width === 10);
    assert.equal(mat.size().height === 10);

    data.delete();
  }
});

QUnit.test("test_mat_buffer_allocation", function(assert) {
  // Allocate buffer after Mat creation.
  //   Mat::create
});

QUnit.test("test_mat_matrix_expression", function(assert) {
  // Matrix operations: A and B are Matrix. S is scalar
  //  A + B
  //  A * C
  //  and so on....
  // We can't customize operator at javascript side.
  // How about replace "+" by add function, "-" by sub and so on.
});

QUnit.test("test_mat_elementAccess", function(assert) {
  const RValue = 1;
  const GValue = 7;
  const BValue = 197;
  const AValue = 123;

  // Test 1.
  //   Mat::data
  {
    let mat = new Module.Mat(10, 10, Module.CV_8UC4);
    let dataView = Module.HEAPU8.subarray(mat.data);

    // Alter Mat::data directly.
    dataView[0] = RValue;
    dataView[1] = GValue;
    dataView[2] = BValue;
    dataView[3] = AValue;

    // Read altered data by Mat::at and verify.
    dataView = Module.HEAPU8.subarray(mat.at(0, 0));

    assert.equal(dataView[0], RValue);
    assert.equal(dataView[1], GValue);
    assert.equal(dataView[2], BValue);
    assert.equal(dataView[3], AValue);
  }

  // No good. Template is not supported in js.
  //  at<uchar> => atInteger
  //  at<Double> => atDouble
  //  at<Vect3b> => atVec3b
  //  at<Point> ?? Are we going to export Point?

  // Test 2.
  //   Mat::at<uchar>
  {
    const GrayScaleValue = 7;

    // Write the value of a specific pixel.
    let mat = new Module.Mat(1, 10, Module.CV_8UC1);
    var pixel = Module.HEAPU8.subarray(mat.at(5));

    pixel = GrayScaleValue;

    // Verify.
    pixel = Module.HEAPU8.subarray(mat.at(5));
    assert.equal(pixel[0], GrayScaleValue);
  }

  // Test 3.
  //   Mat::at<Vect3b>
  {
    let mat = new Module.Mat(10, 10, Module.CV_8UC3);
    // In c++, you need only call Mat::at<type>(index), which does two
    // things for you
    //   1. pointer address evaluation by index.
    //   2. type casting by template argument.
    // In javascript, you have to
    //   1. call Matrix.at to get the raw address.
    //   2. create a data viewer for this returning address.
    // Sorta verbose.
    // We may either inherit Mat in JS side to combine #1 and #2 in
    // one function call, or use emscripten::val in c++ wrap function.
    var pixel = Module.HEAPU8.subarray(mat.at(5, 5));

    pixel[0] = RValue;
    pixel[1] = GValue;
    pixel[2] = BValue;
    pixel[3] = AValue;

    pixel = new Uint8Array(Module.HEAPU8, mat.at(5, 5), 3);

    assert.equal(pixel[0], RValue);
    assert.equal(pixel[1], GValue);
    assert.equal(pixel[2], BValue);
    assert.equal(pixel[3], AValue);

    mat.delete();
  }
});

QUnit.test("test_mat_zeros", function(assert) {
  var mat = Module.Mat.zeros(10, 10, Module.CV_8UC1);
  var total = 0;
  Module.HEAPU8.subarray((0).forEach(function(element, index, array) {
    total += element;
  });

  assert.equal(total, 0);
});

QUnit.test("test_mat_ones", function(assert) {
  var mat = Module.Mat.ones(10, 10, Module.CV_8UC1);
  var total = 0;
  Module.HEAPU8.subarray((0).forEach(function(element, index, array) {
    total += element;
  });

  assert.equal(total, 100);
});

QUnit.test("test_mat_eyes", function(assert) {
  var mat = Module.Mat.eyes(10, 10, Module.CV_8UC1);
  var total = 0;
  Module.HEAPU8.subarray((0).forEach(function(element, index, array) {
    total += element;
  });

  assert.equal(total, 10);
});

QUnit.test("test_mat_properties", function(assert) {
  // TBD: do we need this test? test_mat_creation containts most of getter we
  // need.
});


// Mat::zeros
