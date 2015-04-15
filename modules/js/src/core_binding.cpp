#include <emscripten/bind.h>
#include "opencv2/core.hpp"
#include "common.hpp"

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

// Current template spec does not support lambda template paremater.
// As a result, we still neeed to define a simple wrapper function here.
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

EMSCRIPTEN_BINDINGS(stl_wrappers) {
  register_vector<int>("VectorInt");
  register_vector<cv::Mat>("VectorMat");
}

EMSCRIPTEN_BINDINGS(ocv_matrix) {
  value_array<cv::Size>("Size")
    .element(&cv::Size::height)
    .element(&cv::Size::width)
    ;

#define BIND_FUNCTION(N, name, binded) \
  typedef ExplicitConversion<N, cv::MatExpr (*)(int, int, int)> name##_miii; \
  name##_miii::bind(&binded);

  BIND_FUNCTION(0, zeros, cv::Mat::zeros);
  BIND_FUNCTION(1, eye, cv::Mat::eye);
  BIND_FUNCTION(2, ones, cv::Mat::ones);
#undef BIND_FUNCTION

#define BIND_FUNCTION(N, name, binded) \
  typedef ExplicitConversion<N, cv::MatExpr (*)(cv::Size, int)> name##_msi; \
  name##_msi::bind(&binded);

  BIND_FUNCTION(3, zeros, cv::Mat::zeros);
  BIND_FUNCTION(4, eye, cv::Mat::eye);
  BIND_FUNCTION(5, ones, cv::Mat::ones);
#undef BIND_FUNCTION

  // TBD: export cv::MatExpr (*)(int, const int *, int) is mixup with
  // cv::MatExpr (*)(int, int, int)> for some unknown reason. Skip exporting
  // these API before I figure it out.
  /*
  #define BIND_FUNCTION(N, name, binded) \
  typedef ExplicitConversion<N, cv::MatExpr (*)(int, const int *, int)> name##_miipi; \
  name##_miipi::bind(&binded);

  BIND_FUNCTION(6, zeros, cv::Mat::zeros);
  BIND_FUNCTION(7, ones, cv::Mat::ones);
  BIND_FUNCTION(12, aaaa, aaaa);
  #undef BIND_FUNCTION
  */

  using BindMatPtrVPI = ExplicitConversion<8, void *(cv::Mat::*)(int)>;
  BindMatPtrVPI::bind(&cv::Mat::ptr);
  using BindMatPtrVPII = ExplicitConversion<9, void *(cv::Mat::*)(int, int)>;
  BindMatPtrVPII::bind(&cv::Mat::ptr);

  using BindConvertTo = ExplicitConversion<10, decltype(&cv::Mat::convertTo)>;
  BindConvertTo::bind(&cv::Mat::convertTo);

  using BindMatCreate = ExplicitConversion<11, cv::Mat *(*)(cv::Size, int, void*, size_t)>;
  BindMatCreate::bind([] (cv::Size size, int type, void *data, size_t step) {
      return new cv::Mat(size, type, data, step);
      });

  class_<cv::Mat>("Mat")
    // Constructor && external creators.
    .constructor<>()
    .constructor<int, int, int>()
    .constructor<const cv::Mat&>()
    .constructor(&BindMatCreate::call)
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
    // We support Mat::ptr, but do not support Mat::at.
    // A user can use typed array to access element data with correct type.
    .function("ptr", &BindMatPtrVPI::call)
    .function("ptr", &BindMatPtrVPII::call)
    .function("create", select_overload<void (int, int, int)>(&cv::Mat::create))
    .function("create", select_overload<void (cv::Size, int)>(&cv::Mat::create))
    // Since we can't overwrite + operator at js side, we should return a matrix
    // instance, not MatExpr one, in exported eyes/ones/zeros
    .class_function("zeros", &zeros_miii::call)
    .class_function("ones", &ones_miii::call)
    .class_function("eye", &eye_miii::call)
    .class_function("zeros", &zeros_msi::call)
    .class_function("ones", &ones_msi::call)
    .class_function("eye", &eye_msi::call)
    // Misc
    .function("convertTo", &BindConvertTo::call)
    /*
       Mat rowRange(int startrow, int endrow) const;
       Mat rowRange(const Range& r) const;
       Mat colRange(int startcol, int endcol) const;
       Mat colRange(const Range& r) const;
       static Mat diag(const Mat& d);
       Mat diag(int d=0) const;

       Mat clone() const;
       void copyTo( OutputArray m ) const;
       void copyTo( OutputArray m, InputArray mask ) const;
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
       template<typename _Tp> operator std::vector<_Tp>() const;
       template<typename _Tp, int n> operator Vec<_Tp, n>() const;
       template<typename _Tp, int m, int n> operator Matx<_Tp, m, n>() const;
       bool isContinuous() const;
       bool isSubmatrix() const;
       size_t elemSize() const;
       size_t elemSize1() const;
       size_t step1(int i=0) const;
       size_t total() const;
       int checkVector(int elemChannels, int depth=-1, bool requireContinuous=true) const;
       template<typename _Tp, typename Functor> void forEach(const Functor& operation);
       */
    ;

  // Misc API.
  // void split(const Mat& src, Mat* mvbegin);
  // void split(InputArray m, OutputArrayOfArrays mv)
  using BindSplit = ExplicitConversion<20, void (*)(cv::Mat &, std::vector<cv::Mat> &)>;
  BindSplit::bind([] (cv::Mat &m, std::vector<cv::Mat> &mv) { cv::split(m, mv); });
  function("split", &BindSplit::call);

  // void perspectiveTransform(InputArray, OutputArray, InputArray);

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
