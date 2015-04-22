QUnit.test("test_core", function(assert) {
  // C++
  //  void addWeighted(InputArray, double, InputArray, double, double, OutputArray, int dtype = -1);
  // Embind
  //  void addWeighted(Mat&, double, Mat&, double, double, Mat&, int dtype = -1);
  {
	let mat1 = Module.Mat.zeros(2, 2, Module.CV_8UC1);
	let view1 = Module.HEAPU8.subarray(mat1.data);
	view1[0] = 2;
	view1[1] = 4;
	view1[2] = 6;
	view1[3] = 8;

	let mat2 = Module.Mat.zeros(2, 2, Module.CV_8UC1);
	let view2 = Module.HEAPU8.subarray(mat2.data);
	view1[0] = 22;
	view1[1] = 44;
	view1[2] = 66;
	view1[3] = 88;

    const alpha = 0.5;
    const beta = 0.5;
    const gamma = 1;
    // destView[0] = view1[0] * alpha + view2[0] * beta + gamma;
    let destMat = new Module.Mat(); 
	Module.addWeighted(mat1, alpha, mat2, beta, gamma, destMat, -1);
	let destView = Module.HEAPU8.subarray(destMat.data);

	for (let i = 0; i < 4; i++) {
	  assert.equal(destView[i], view1[i] * alpha + view2[i] * beta + gamma);
    }

	mat1.delete();
	mat2.delete();
	destMat.delete();
  }
});