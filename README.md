# OpenCV: Open Source Computer Vision Library

## Setup Emscripten
[Emscripten installation guide from Emscripten.org](http://kripken.github.io/emscripten-site/docs/getting_started/downloads.html)

Version 1.29 and above is recommended for better performance.

## Compile

#### Download source code and switch to opencvjs branch
```
git clone https://github.com/kakukogou/opencv.git
cd opencv
git checkout -b opencvjs
```
#### [optional] Modify the CMakelists.txt
If you decide not to compile from the opencvjs branch, please do the following modification to avoid running test_big_endian module. The test_big_endian uses try_compile which is not supported in the Emscripten tool-chain now. We temporarily hard-code it to let the build system knows that the Emscripten is little endian.

In CMakelists.txt, add the follwing **bolded lines**.
<pre>
# ----------------------------------------------------------------------------
#  Detect endianness of build platform
# ----------------------------------------------------------------------------

if(CMAKE_SYSTEM_NAME STREQUAL iOS)
  # test_big_endian needs try_compile, which doesn't work for iOS
  # http://public.kitware.com/Bug/view.php?id=12288
  set(WORDS_BIGENDIAN 0)
<b>elseif(CMAKE_SYSTEM_NAME STREQUAL Emscripten)</b>
  <b># hardcode for disabling test_big_endian and set it to little_endian</b>
  <b>set(WORDS_BIGENDIAN 0)</b>
else()
  include(TestBigEndian)
  test_big_endian(WORDS_BIGENDIAN)
endif()
</pre>

#### Configurate and Build
* **cmake** is required.

<pre>
mkdir release_asm
cd release asm
emcmake cmake -DBUILD_CUDA_STUBS=OFF -DBUILD_DOCS=OFF -DBUILD_EXAMPLES=OFF -DBUILD_JASPER=OFF -DBUILD_JPEG=OFF -DBUILD_OPENEXR=OFF -DBUILD_PERF_TESTS=OFF -DBUILD_PNG=OFF -DBUILD_TBB=OFF -DBUILD_TESTS=OFF -DBUILD_TIFF=OFF -DBUILD_WITH_DEBUG_INFO=OFF -DBUILD_ZLIB=OFF -DBUILD_opencv_apps=OFF -DBUILD_opencv_ts=OFF -DBUILD_opencv_world=OFF -DWITH_1394=OFF -DWITH_CLP=OFF -DWITH_CUBLAS=OFF -DWITH_CUDA=OFF -DWITH_CUFFT=OFF -DWITH_FFMPEG=OFF -DWITH_GDAL=OFF -DWITH_GIGEAPI=OFF -DWITH_GSTREAMER=OFF -DWITH_GSTREAMER_0_10=OFF -DWITH_GTK=OFF -DWITH_GTK_2_X=OFF -DWITH_JASPER=OFF -DWITH_JPEG=OFF -DWITH_LIBV4L=OFF -DWITH_NVCUVID=OFF -DWITH_OPENCL=OFF -DWITH_OPENCLAMDBLAS=OFF -DWITH_OPENCLAMDFFT=OFF -DWITH_OPENEXR=OFF -DWITH_OPENGL=OFF -DWITH_OPENMP=OFF -DWITH_OPENNI=OFF -DWITH_OPENNI2=OFF -DWITH_PNG=OFF -DWITH_PVAPI=OFF -DWITH_QT=OFF -DWITH_TBB=OFF -DWITH_TIFF=OFF -DWITH_UNICAP=OFF -DWITH_V4L=OFF -DWITH_VTK=OFF -DWITH_WEBP=OFF -DWITH_XIMEA=OFF -DWITH_XINE=OFF -DBUILD_SHARED_LIBS=ON -DBUILD_PACKAGE=ON -DCMAKE_COLOR_MAKEFILE=ON -DWITH_EIGEN=ON -DCMAKE_BUILD_TYPE=RELEASE  -DCMAKE_CXX_FLAGS_RELEASE="-DNDEBUG -O3 -s PRECISE_F32=1 -Wno-warn-absolute-paths" -DCMAKE_CXX_FLAGS_RELWITHDEBINFO="-O3 -s PRECISE_F32=1" -DCMAKE_C_FLAGS_RELEASE="-DNDEBUG -O3 -s PRECISE_F32=1" -DCMAKE_C_FLAGS_RELWITHDEBINFO="-O3 -s PRECISE_F32=1" -DCMAKE_EXE_LINKER_FLAGS_RELEASE="-O3 -s PRECISE_F32=1" -DCMAKE_EXE_LINKER_FLAGS_RELWITHDEBINFO="-O3 -g -s PRECISE_F32=1" -DCMAKE_MODULE_LINKER_FLAGS_RELEASE="-O3 -s PRECISE_F32=1" -DCMAKE_MODULE_LINKER_FLAGS_RELWITHDEBINFO="-O3 -g -s PRECISE_F32=1" -DCMAKE_SHARED_LINKER_FLAGS_RELEASE="-O3 -s PRECISE_F32=1" -DCMAKE_SHARED_LINKER_FLAGS_RELWITHDEBINFO="-O3 -g -s PRECISE_F32=1" ..
emmake make
emmake make install
</pre>

The long configuration command listed above disables lots of 3rd party libraries which are not available in the Emscripten build system. It also uses *-O3* and *-s PRECISE_F32=1* optimizations. You can also configurate the build by yourself and I will recommand use ccmake to do configuration visually.
<pre>
emcmake ccmake -DCMAKE_BUILD_TYPE=RELEASE ..
</pre>

## Test and Demonstration
The following repositories could be used to test your opencv.js build.
* [Segmentation Demo](https://github.com/kakukogou/opencvjs_demo_segmentation.git)
* [Face Detection Demo](https://github.com/kakukogou/opencvjs_demo_facedetection.git)
