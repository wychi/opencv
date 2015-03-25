# Disable js module without emscripten supporting.
if(NOT DEFINED ENV{EMSCRIPTEN_TOOLS})
  ocv_module_disable(js)
endif()

set(the_description "Javascript bindings")
set(ENSCRIPTEN_INCLUDE_PATH "${OpenCV_SOURCE_DIR}/3rdparty/include/emscripten")

# c++11 is require for compiling embinding code, such as binder.h.
set(CMAKE_CXX_FLAGS  "${CMAKE_CXX_FLAGS} -std=c++11")

# dependency white list.
set(candidate_deps "")
list(APPEND candidate_deps "opencv_core")
list(APPEND candidate_deps "opencv_imgproc")
ocv_add_module(js BINDINGS ${candidate_deps})

ocv_glob_module_sources()
ocv_module_include_directories(${the_module} ${ENSCRIPTEN_INCLUDE_PATH})
ocv_create_module()

#set(JSOUTPUT ${CMAKE_CURRENT_BINARY_DIR}/opencv.cpp)
#set(BITCODES ${CMAKE_CURRENT_BINARY_DIR}/lib/libopencv_core.so)
#set(BITCODES ${BITCODES} ${CMAKE_CURRENT_BINARY_DIR}/lib/libopencv_imgproc.so)
#add_custom_command(
#   OUTPUT  ${JSOUTPUT}
#   COMMAND echo "opencv_js!!!!!!!!!!"
   #COMMAND emcc ${BITCODES} -O3 --bind --`llvm-lto 1 --closure 1 -s PRECISE_F32=1 -s FORCE_ALIGNED_MEMORY=1 -s TOTAL_MEMORY=306777216 -o ${JSOUTPUT}
#   DEPENDS ${CMAKE_CURRENT_SOURCE_DIR}/src/matrix_bind.cpp)
# ocv_add_library(${the_module} SHARED ${JSOUTPUT})
