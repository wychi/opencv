#include <emscripten/bind.h>
#include "common.hpp"
#include "opencv2/imgproc.hpp"
#include "opencv2/imgproc/types_c.h"

using namespace emscripten;

EMSCRIPTEN_BINDINGS(ocv_imgproc) {
  // void calcHist(const Mat*, int, const int*, InputArray, OutputArray,
  // int, const int*, const float**, bool, bool)
  typedef ExplicitConversion<100, void (*)(const cv::Mat*, int, const int*,
      cv::InputArray, cv::OutputArray, int, const int*,
      const float**, bool, bool)> ImgProc_calcHist;
  ImgProc_calcHist::bind(cv::calcHist);
  //typedef ExplicitConversion<100, void (*)(const cv::Mat*, int, uintptr_t,
  //    cv::Mat &, cv::Mat &, int, uintptr_t,
  //    uintptr_t, bool, bool)> ImgProc_calcHist;
  //ImgProc_calcHist::bind([](const cv::Mat* p1, int p2, uintptr_t p3,
  //    cv::Mat &p4, cv::Mat &p5, int p6, uintptr_t p7,
  //    uintptr_t p8, bool p9, bool p10) {
  //      int a = 255;
  //      cv::calcHist(p1, p2, (const int *)p3,p4,p5,p6,&a, (const float **)p8, p9,p10);
  //    }
  //);
  function("calcHist", &ImgProc_calcHist::call, allow_raw_pointers());

  //  void equalizeHist( InputArray src, OutputArray dst );
  typedef ExplicitConversion<101, void (*)(cv::InputArray, cv::OutputArray)> ImgProc_equalizeHist;
  ImgProc_equalizeHist::bind(cv::equalizeHist);
  function("equalizeHist", &ImgProc_equalizeHist::call);

  // void cvtColor(InputArray src, OutputArray dst, int code, int dstCn=0)
  typedef ExplicitConversion<101,  void (*)(cv::InputArray, cv::OutputArray, int, int)> ImgProc_cvtColor;
  ImgProc_cvtColor::bind(cv::cvtColor);
  function("cvtColor", &ImgProc_cvtColor::call);

  // http://stackoverflow.com/questions/5720359/no-matching-function-call-to-anonymous-enum
  //  template<typename ConstantType>
  //  void constant(const char* name, const ConstantType& v) {
  // Prefix + to promote unnamed emun to integer. Or by using static_cast<int>.
  // Regular expression to convert this unname enum into embind::constant
  // : %s/\(CV_.*\)/constant("\1", +\1);/gc
  constant("CV_BGR2BGRA", +CV_BGR2BGRA);
  constant("CV_RGB2RGBA", +CV_RGB2RGBA);
  constant("CV_BGRA2BGR", +CV_BGRA2BGR);
  constant("CV_RGBA2RGB", +CV_RGBA2RGB);
  constant("CV_BGR2RGBA", +CV_BGR2RGBA);
  constant("CV_RGB2BGRA", +CV_RGB2BGRA);
  constant("CV_RGBA2BGR", +CV_RGBA2BGR);
  constant("CV_BGRA2RGB", +CV_BGRA2RGB);
  constant("CV_BGR2RGB", +CV_BGR2RGB);
  constant("CV_RGB2BGR", +CV_RGB2BGR);
  constant("CV_BGRA2RGBA", +CV_BGRA2RGBA);
  constant("CV_RGBA2BGRA", +CV_RGBA2BGRA);
  constant("CV_BGR2GRAY", +CV_BGR2GRAY);
  constant("CV_RGB2GRAY", +CV_RGB2GRAY);
  constant("CV_GRAY2BGR", +CV_GRAY2BGR);
  constant("CV_GRAY2RGB", +CV_GRAY2RGB);
  constant("CV_GRAY2BGRA", +CV_GRAY2BGRA);
  constant("CV_GRAY2RGBA", +CV_GRAY2RGBA);
  constant("CV_BGRA2GRAY", +CV_BGRA2GRAY);
  constant("CV_RGBA2GRAY", +CV_RGBA2GRAY);
  constant("CV_BGR2BGR565", +CV_BGR2BGR565);
  constant("CV_RGB2BGR565", +CV_RGB2BGR565);
  constant("CV_BGR5652BGR", +CV_BGR5652BGR);
  constant("CV_BGR5652RGB", +CV_BGR5652RGB);
  constant("CV_BGRA2BGR565", +CV_BGRA2BGR565);
  constant("CV_RGBA2BGR565", +CV_RGBA2BGR565);
  constant("CV_BGR5652BGRA", +CV_BGR5652BGRA);
  constant("CV_BGR5652RGBA", +CV_BGR5652RGBA);
  constant("CV_GRAY2BGR565", +CV_GRAY2BGR565);
  constant("CV_BGR5652GRAY", +CV_BGR5652GRAY);
  constant("CV_BGR2BGR555", +CV_BGR2BGR555);
  constant("CV_RGB2BGR555", +CV_RGB2BGR555);
  constant("CV_BGR5552BGR", +CV_BGR5552BGR);
  constant("CV_BGR5552RGB", +CV_BGR5552RGB);
  constant("CV_BGRA2BGR555", +CV_BGRA2BGR555);
  constant("CV_RGBA2BGR555", +CV_RGBA2BGR555);
  constant("CV_BGR5552BGRA", +CV_BGR5552BGRA);
  constant("CV_BGR5552RGBA", +CV_BGR5552RGBA);
  constant("CV_GRAY2BGR555", +CV_GRAY2BGR555);
  constant("CV_BGR5552GRAY", +CV_BGR5552GRAY);
  constant("CV_BGR2XYZ", +CV_BGR2XYZ);
  constant("CV_RGB2XYZ", +CV_RGB2XYZ);
  constant("CV_XYZ2BGR", +CV_XYZ2BGR);
  constant("CV_XYZ2RGB", +CV_XYZ2RGB);
  constant("CV_BGR2YCrCb", +CV_BGR2YCrCb);
  constant("CV_RGB2YCrCb", +CV_RGB2YCrCb);
  constant("CV_YCrCb2BGR", +CV_YCrCb2BGR);
  constant("CV_YCrCb2RGB", +CV_YCrCb2RGB);
  constant("CV_BGR2HSV", +CV_BGR2HSV);
  constant("CV_RGB2HSV", +CV_RGB2HSV);
  constant("CV_BGR2Lab", +CV_BGR2Lab);
  constant("CV_RGB2Lab", +CV_RGB2Lab);
  constant("CV_BayerBG2BGR,", +CV_BayerBG2BGR);
  constant("CV_BayerGB2BGR,", +CV_BayerGB2BGR);
  constant("CV_BayerRG2BGR,", +CV_BayerRG2BGR);
  constant("CV_BayerGR2BGR,", +CV_BayerGR2BGR);
  constant("CV_BayerBG2RGB", +CV_BayerBG2RGB);
  constant("CV_BayerGB2RGB", +CV_BayerGB2RGB);
  constant("CV_BayerRG2RGB", +CV_BayerRG2RGB);
  constant("CV_BayerGR2RGB", +CV_BayerGR2RGB);
  constant("CV_BGR2Luv", +CV_BGR2Luv);
  constant("CV_RGB2Luv", +CV_RGB2Luv);
  constant("CV_BGR2HLS", +CV_BGR2HLS);
  constant("CV_RGB2HLS", +CV_RGB2HLS);
  constant("CV_HSV2BGR", +CV_HSV2BGR);
  constant("CV_HSV2RGB", +CV_HSV2RGB);
  constant("CV_Lab2BGR", +CV_Lab2BGR);
  constant("CV_Lab2RGB", +CV_Lab2RGB);
  constant("CV_Luv2BGR", +CV_Luv2BGR);
  constant("CV_Luv2RGB", +CV_Luv2RGB);
  constant("CV_HLS2BGR", +CV_HLS2BGR);
  constant("CV_HLS2RGB", +CV_HLS2RGB);
  constant("CV_BayerBG2BGR_VNG", +CV_BayerBG2BGR_VNG);
  constant("CV_BayerGB2BGR_VNG", +CV_BayerGB2BGR_VNG);
  constant("CV_BayerRG2BGR_VNG", +CV_BayerRG2BGR_VNG);
  constant("CV_BayerGR2BGR_VNG", +CV_BayerGR2BGR_VNG);
  constant("CV_BayerBG2RGB_VNG", +CV_BayerBG2RGB_VNG);
  constant("CV_BayerGB2RGB_VNG", +CV_BayerGB2RGB_VNG);
  constant("CV_BayerRG2RGB_VNG", +CV_BayerRG2RGB_VNG);
  constant("CV_BayerGR2RGB_VNG", +CV_BayerGR2RGB_VNG);
  constant("CV_BGR2HSV_FULL", +CV_BGR2HSV_FULL);
  constant("CV_RGB2HSV_FULL", +CV_RGB2HSV_FULL);
  constant("CV_BGR2HLS_FULL", +CV_BGR2HLS_FULL);
  constant("CV_RGB2HLS_FULL", +CV_RGB2HLS_FULL);
  constant("CV_HSV2BGR_FULL", +CV_HSV2BGR_FULL);
  constant("CV_HSV2RGB_FULL", +CV_HSV2RGB_FULL);
  constant("CV_HLS2BGR_FULL", +CV_HLS2BGR_FULL);
  constant("CV_HLS2RGB_FULL", +CV_HLS2RGB_FULL);
  constant("CV_LBGR2Lab", +CV_LBGR2Lab);
  constant("CV_LRGB2Lab", +CV_LRGB2Lab);
  constant("CV_LBGR2Luv", +CV_LBGR2Luv);
  constant("CV_LRGB2Luv", +CV_LRGB2Luv);
  constant("CV_Lab2LBGR", +CV_Lab2LBGR);
  constant("CV_Lab2LRGB", +CV_Lab2LRGB);
  constant("CV_Luv2LBGR", +CV_Luv2LBGR);
  constant("CV_Luv2LRGB", +CV_Luv2LRGB);
  constant("CV_BGR2YUV", +CV_BGR2YUV);
  constant("CV_RGB2YUV", +CV_RGB2YUV);
  constant("CV_YUV2BGR", +CV_YUV2BGR);
  constant("CV_YUV2RGB", +CV_YUV2RGB);
  constant("CV_BayerBG2GRAY", +CV_BayerBG2GRAY);
  constant("CV_BayerGB2GRAY", +CV_BayerGB2GRAY);
  constant("CV_BayerRG2GRAY", +CV_BayerRG2GRAY);
  constant("CV_BayerGR2GRAY", +CV_BayerGR2GRAY);
  constant("CV_YUV2RGB_NV12", +CV_YUV2RGB_NV12);
  constant("CV_YUV2BGR_NV12", +CV_YUV2BGR_NV12);
  constant("CV_YUV2RGB_NV21", +CV_YUV2RGB_NV21);
  constant("CV_YUV2BGR_NV21", +CV_YUV2BGR_NV21);
  constant("CV_YUV420sp2RGB", +CV_YUV420sp2RGB);
  constant("CV_YUV420sp2BGR", +CV_YUV420sp2BGR);
  constant("CV_YUV2RGBA_NV12", +CV_YUV2RGBA_NV12);
  constant("CV_YUV2BGRA_NV12", +CV_YUV2BGRA_NV12);
  constant("CV_YUV2RGBA_NV21", +CV_YUV2RGBA_NV21);
  constant("CV_YUV2BGRA_NV21", +CV_YUV2BGRA_NV21);
  constant("CV_YUV420sp2RGBA", +CV_YUV420sp2RGBA);
  constant("CV_YUV420sp2BGRA", +CV_YUV420sp2BGRA);
  constant("CV_YUV2RGB_YV12", +CV_YUV2RGB_YV12);
  constant("CV_YUV2BGR_YV12", +CV_YUV2BGR_YV12);
  constant("CV_YUV2RGB_IYUV", +CV_YUV2RGB_IYUV);
  constant("CV_YUV2BGR_IYUV", +CV_YUV2BGR_IYUV);
  constant("CV_YUV2RGB_I420", +CV_YUV2RGB_I420);
  constant("CV_YUV2BGR_I420", +CV_YUV2BGR_I420);
  constant("CV_YUV420p2RGB", +CV_YUV420p2RGB);
  constant("CV_YUV420p2BGR", +CV_YUV420p2BGR);
  constant("CV_YUV2RGBA_YV12", +CV_YUV2RGBA_YV12);
  constant("CV_YUV2BGRA_YV12", +CV_YUV2BGRA_YV12);
  constant("CV_YUV2RGBA_IYUV", +CV_YUV2RGBA_IYUV);
  constant("CV_YUV2BGRA_IYUV", +CV_YUV2BGRA_IYUV);
  constant("CV_YUV2RGBA_I420", +CV_YUV2RGBA_I420);
  constant("CV_YUV2BGRA_I420", +CV_YUV2BGRA_I420);
  constant("CV_YUV420p2RGBA", +CV_YUV420p2RGBA);
  constant("CV_YUV420p2BGRA", +CV_YUV420p2BGRA);
  constant("CV_YUV2GRAY_420", +CV_YUV2GRAY_420);
  constant("CV_YUV2GRAY_NV21", +CV_YUV2GRAY_NV21);
  constant("CV_YUV2GRAY_NV12", +CV_YUV2GRAY_NV12);
  constant("CV_YUV2GRAY_YV12", +CV_YUV2GRAY_YV12);
  constant("CV_YUV2GRAY_IYUV", +CV_YUV2GRAY_IYUV);
  constant("CV_YUV2GRAY_I420", +CV_YUV2GRAY_I420);
  constant("CV_YUV420sp2GRAY", +CV_YUV420sp2GRAY);
  constant("CV_YUV420p2GRAY", +CV_YUV420p2GRAY);
  constant("CV_YUV2RGB_UYVY", +CV_YUV2RGB_UYVY);
  constant("CV_YUV2BGR_UYVY", +CV_YUV2BGR_UYVY);
  constant("CV_YUV2RGB_Y422", +CV_YUV2RGB_Y422);
  constant("CV_YUV2BGR_Y422", +CV_YUV2BGR_Y422);
  constant("CV_YUV2RGB_UYNV", +CV_YUV2RGB_UYNV);
  constant("CV_YUV2BGR_UYNV", +CV_YUV2BGR_UYNV);
  constant("CV_YUV2RGBA_UYVY", +CV_YUV2RGBA_UYVY);
  constant("CV_YUV2BGRA_UYVY", +CV_YUV2BGRA_UYVY);
  constant("CV_YUV2RGBA_Y422", +CV_YUV2RGBA_Y422);
  constant("CV_YUV2BGRA_Y422", +CV_YUV2BGRA_Y422);
  constant("CV_YUV2RGBA_UYNV", +CV_YUV2RGBA_UYNV);
  constant("CV_YUV2BGRA_UYNV", +CV_YUV2BGRA_UYNV);
  constant("CV_YUV2RGB_YUY2", +CV_YUV2RGB_YUY2);
  constant("CV_YUV2BGR_YUY2", +CV_YUV2BGR_YUY2);
  constant("CV_YUV2RGB_YVYU", +CV_YUV2RGB_YVYU);
  constant("CV_YUV2BGR_YVYU", +CV_YUV2BGR_YVYU);
  constant("CV_YUV2RGB_YUYV", +CV_YUV2RGB_YUYV);
  constant("CV_YUV2BGR_YUYV", +CV_YUV2BGR_YUYV);
  constant("CV_YUV2RGB_YUNV", +CV_YUV2RGB_YUNV);
  constant("CV_YUV2BGR_YUNV", +CV_YUV2BGR_YUNV);
  constant("CV_YUV2RGBA_YUY2", +CV_YUV2RGBA_YUY2);
  constant("CV_YUV2BGRA_YUY2", +CV_YUV2BGRA_YUY2);
  constant("CV_YUV2RGBA_YVYU", +CV_YUV2RGBA_YVYU);
  constant("CV_YUV2BGRA_YVYU", +CV_YUV2BGRA_YVYU);
  constant("CV_YUV2RGBA_YUYV", +CV_YUV2RGBA_YUYV);
  constant("CV_YUV2BGRA_YUYV", +CV_YUV2BGRA_YUYV);
  constant("CV_YUV2RGBA_YUNV", +CV_YUV2RGBA_YUNV);
  constant("CV_YUV2BGRA_YUNV", +CV_YUV2BGRA_YUNV);
  constant("CV_YUV2GRAY_UYVY", +CV_YUV2GRAY_UYVY);
  constant("CV_YUV2GRAY_YUY2", +CV_YUV2GRAY_YUY2);
  constant("CV_YUV2GRAY_Y422", +CV_YUV2GRAY_Y422);
  constant("CV_YUV2GRAY_UYNV", +CV_YUV2GRAY_UYNV);
  constant("CV_YUV2GRAY_YVYU", +CV_YUV2GRAY_YVYU);
  constant("CV_YUV2GRAY_YUYV", +CV_YUV2GRAY_YUYV);
  constant("CV_YUV2GRAY_YUNV", +CV_YUV2GRAY_YUNV);
  constant("CV_RGBA2mRGBA", +CV_RGBA2mRGBA);
  constant("CV_mRGBA2RGBA", +CV_mRGBA2RGBA);
  constant("CV_RGB2YUV_I420", +CV_RGB2YUV_I420);
  constant("CV_BGR2YUV_I420", +CV_BGR2YUV_I420);
  constant("CV_RGB2YUV_IYUV", +CV_RGB2YUV_IYUV);
  constant("CV_BGR2YUV_IYUV", +CV_BGR2YUV_IYUV);
  constant("CV_RGBA2YUV_I420", +CV_RGBA2YUV_I420);
  constant("CV_BGRA2YUV_I420", +CV_BGRA2YUV_I420);
  constant("CV_RGBA2YUV_IYUV", +CV_RGBA2YUV_IYUV);
  constant("CV_BGRA2YUV_IYUV", +CV_BGRA2YUV_IYUV);
  constant("CV_RGB2YUV_YV12", +CV_RGB2YUV_YV12);
  constant("CV_BGR2YUV_YV12", +CV_BGR2YUV_YV12);
  constant("CV_RGBA2YUV_YV12", +CV_RGBA2YUV_YV12);
  constant("CV_BGRA2YUV_YV12", +CV_BGRA2YUV_YV12);
  constant("CV_BayerBG2BGR_EA", +CV_BayerBG2BGR_EA);
  constant("CV_BayerGB2BGR_EA", +CV_BayerGB2BGR_EA);
  constant("CV_BayerRG2BGR_EA", +CV_BayerRG2BGR_EA);
  constant("CV_BayerGR2BGR_EA", +CV_BayerGR2BGR_EA);
  constant("CV_BayerBG2RGB_EA", +CV_BayerBG2RGB_EA);
  constant("CV_BayerGB2RGB_EA", +CV_BayerGB2RGB_EA);
  constant("CV_BayerRG2RGB_EA", +CV_BayerRG2RGB_EA);
  constant("CV_BayerGR2RGB_EA", +CV_BayerGR2RGB_EA);
}
