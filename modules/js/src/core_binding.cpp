#include "opencv2/core/mat.hpp"
#include <emscripten/bind.h>

using namespace emscripten;

// Mat wrappers
// The 1st parameter of a free getter need to be const reference
//   struct GetterPolicy<GetterReturnType (*)(const GetterThisType&)>
// Member getters have to be const function.
//   struct GetterPolicy<GetterReturnType (GetterThisType::*)() const>
static uintptr_t Mat_getData(const cv::Mat& mat)
{
  return uintptr_t(mat.data);
}

static void Mat_setData(cv::Mat& mat, uintptr_t data)
{
  mat.data = reinterpret_cast<uchar *>(data);
}

static std::vector<int> Mat_getSize(const cv::Mat &mat)
{
  std::vector<int> size;
  for (int i = 0; i < mat.dims; i++) {
    size.push_back(mat.size[i]);
  }

  return size;
}

// http://emscripten-discuss.narkive.com/51XSL2Cs/returning-references-with-embind
uintptr_t Mat_at(cv::Mat &mat, int i0, int i1)
{
  return (uintptr_t)&mat.at<unsigned char>(i0, i1);
}

uintptr_t Mat_ptr(cv::Mat &mat, int i0)
{
  return (uintptr_t)mat.ptr(i0);
}

uintptr_t Mat_ptr(cv::Mat &mat, int i0, int i1)
{
  return (uintptr_t)mat.ptr(i0, i1);
}

template <int N, typename R>
struct FunctionWrapper;

template <int N, typename R, typename P1, typename P2>
struct FunctionWrapper<N, R (*)(P1, P2)>
{
  typedef R (*FunctionSig)(P1, P2);

  static void bind(FunctionSig f) { mF = f;}
  template <typename T> static T call(P1 p1, P2 p2)
  { return mF(p1, p2); }

  static FunctionSig mF;
};

template <int N, typename R, typename P1, typename P2>
typename FunctionWrapper<N, R (*)(P1, P2)>::FunctionSig
FunctionWrapper<N, R (*)(P1, P2)>::mF = nullptr;

template <int N, typename R, typename P1, typename P2, typename P3>
struct FunctionWrapper<N, R (*)(P1, P2, P3)>
{
  typedef R (*FunctionSig)(P1, P2, P3);

  static void bind(FunctionSig f) { mF = f;}
  template <typename T> static T call(P1 p1, P2 p2, P3 p3)
  { return mF(p1, p2, p3); }

  static FunctionSig mF;
};

template <int N, typename R, typename P1, typename P2, typename P3>
typename FunctionWrapper<N, R (*)(P1, P2, P3)>::FunctionSig
FunctionWrapper<N, R (*)(P1, P2, P3)>::mF = nullptr;

// TODO:
// How to auto gen wrapper for function with void * pointer parameters.
cv::Mat *createMat(cv::Size size, int type, uintptr_t data, size_t step) {
  return new cv::Mat(size, type, reinterpret_cast<void *>(data), step);
}

EMSCRIPTEN_BINDINGS(stl_wrappers) {
  register_vector<int>("VectorInt");
}

EMSCRIPTEN_BINDINGS(ocv_matrix) {
  typedef FunctionWrapper<0, cv::MatExpr (*)(int, int, int)> MatZero1;
  typedef FunctionWrapper<1, cv::MatExpr (*)(int, int, int)> MatEye1;
  typedef FunctionWrapper<2, cv::MatExpr (*)(int, int, int)> MatOnes1;
  MatZero1::bind(cv::Mat::zeros);
  MatEye1::bind(cv::Mat::eye);
  MatOnes1::bind(cv::Mat::ones);
  typedef FunctionWrapper<0, cv::MatExpr (*)(cv::Size, int)> MatZero2;
  typedef FunctionWrapper<1, cv::MatExpr (*)(cv::Size, int)> MatEye2;
  typedef FunctionWrapper<2, cv::MatExpr (*)(cv::Size, int)> MatOnes2;
  MatZero2::bind(cv::Mat::zeros);
  MatEye2::bind(cv::Mat::eye);
  MatOnes2::bind(cv::Mat::ones);

  value_array<cv::Size>("Size")
    .element(&cv::Size::height)
    .element(&cv::Size::width)
    ;
  class_<cv::Mat>("Mat")
    // Constructor && external creators.
    .constructor<>()
    .constructor<int, int, int>()
    .constructor<const cv::Mat&>()
    .constructor(&createMat, allow_raw_pointers())
    // Mat properties
    .function("type", &cv::Mat::type)
    .function("depth", &cv::Mat::depth)
    .function("channels", &cv::Mat::channels)
    .function("empty", &cv::Mat::empty)
    .function("size", &Mat_getSize)
    // data access
    .function("row", &cv::Mat::row)
    .function("col", &cv::Mat::row)
    .property("data", &Mat_getData, &Mat_setData)
    // We support Mat::ptr and do not supprt Mat::at.
    // User should use typed array to access element data with correct type.
    .function("ptr", select_overload<uintptr_t (cv::Mat &, int)>(&Mat_ptr))
    .function("ptr", select_overload<uintptr_t (cv::Mat &, int, int)>(&Mat_ptr))
    .function("create", select_overload<void (int, int, int)>(&cv::Mat::create))
    .function("create", select_overload<void (cv::Size, int)>(&cv::Mat::create))
    // Since we can't overwrite + operator at js side, we should return a matrix
    // instance, not MatExpr one, in exported eyes/ones/zeros
    .class_function("zeros", &MatZero1::call<cv::Mat>)
    .class_function("ones", &MatOnes1::call<cv::Mat>)
    .class_function("eye", &MatEye1::call<cv::Mat>)
    .class_function("zeros", &MatZero2::call<cv::Mat>)
    .class_function("ones", &MatOnes2::call<cv::Mat>)
    .class_function("eye", &MatEye2::call<cv::Mat>)
/*
    Mat rowRange(int startrow, int endrow) const;
    Mat rowRange(const Range& r) const;
    Mat colRange(int startcol, int endcol) const;
    Mat colRange(const Range& r) const;
    static Mat diag(const Mat& d);

    Mat clone() const;
    void copyTo( OutputArray m ) const;
    void copyTo( OutputArray m, InputArray mask ) const;
    void convertTo( OutputArray m, int rtype, double alpha=1, double beta=0 ) const;
    void assignTo( Mat& m, int type=-1 ) const;
    Mat& operator = (const Scalar& s);
    Mat& setTo(InputArray value, InputArray mask=noArray());
    Mat reshape(int cn, int rows=0) const;
    Mat reshape(int cn, int newndims, const int* newsz) const;
    MatExpr t() const;
    MatExpr inv(int method=DECOMP_LU) const;
    MatExpr mul(InputArray m, double scale=1) const;
    Mat cross(InputArray m) const;
    double dot(InputArray m) const;
    static MatExpr zeros(int ndims, const int* sz, int type);
    static MatExpr ones(int ndims, const int* sz, int type);
    void deallocate();
    void copySize(const Mat& m);
    void reserve(size_t sz);
    void resize(size_t sz);
    void resize(size_t sz, const Scalar& s);
    void push_back_(const void* elem);
    template<typename _Tp> void push_back(const _Tp& elem);
    template<typename _Tp> void push_back(const Mat_<_Tp>& elem);
    void push_back(const Mat& m);
    void pop_back(size_t nelems=1);
    void locateROI( Size& wholeSize, Point& ofs ) const;
    Mat& adjustROI( int dtop, int dbottom, int dleft, int dright );
    Mat operator()( Range rowRange, Range colRange ) const;
    Mat operator()( const Rect& roi ) const;
    Mat operator()( const Range* ranges ) const;
    Mat diag(int d=0) const;
*/
    ;

    // constants.
    constant("CV_8UC1", CV_8UC1);
    constant("CV_8UC2", CV_8UC2);
    constant("CV_8UC3", CV_8UC3);
    constant("CV_8UC4", CV_8UC4);
    constant("CV_8SC1", CV_8SC1);
    constant("CV_8SC2", CV_8SC2);
    constant("CV_8SC3", CV_8SC3);
    constant("CV_8SC4", CV_8SC4);
    constant("CV_16UC1", CV_16UC1);
    constant("CV_16UC2", CV_16UC2);
    constant("CV_16UC3", CV_16UC3);
    constant("CV_16UC4", CV_16UC4);
    constant("CV_16SC1", CV_16SC1);
    constant("CV_16SC2", CV_16SC2);
    constant("CV_16SC3", CV_16SC3);
    constant("CV_16SC4", CV_16SC4);
    constant("CV_32SC1", CV_32SC1);
    constant("CV_32SC1", CV_32SC1);
    constant("CV_32SC2", CV_32SC2);
    constant("CV_32SC3", CV_32SC3);
    constant("CV_32SC4", CV_32SC4);
    constant("CV_32FC1", CV_32FC1);
    constant("CV_32FC2", CV_32FC2);
    constant("CV_32FC3", CV_32FC3);
    constant("CV_32FC4", CV_32FC4);
    constant("CV_64FC1", CV_64FC1);
    constant("CV_64FC2", CV_64FC2);
    constant("CV_64FC3", CV_64FC3);
    constant("CV_64FC4", CV_64FC4);
    constant("CV_8U", CV_8U);
    constant("CV_8S", CV_8S);
    constant("CV_16U", CV_16U);
    constant("CV_16S", CV_16S);
    constant("CV_32S", CV_32S);
    constant("CV_32F", CV_32F);
    constant("CV_64F", CV_64F);
    constant("AUTO_STEP", size_t(cv::Mat::AUTO_STEP));
}
