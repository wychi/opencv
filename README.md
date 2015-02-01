# OpenCV: Open Source Computer Vision Library

## Compile

### Download source code and switch to opencvjs branch
```
git clone https://github.com/kakukogou/opencv.git
cd opencv
git branch opencvjs
```
### [optional] Modify the CMakelists.txt
If you decide not to compile from the opencvjs branch, please do the following modification to avoid running test_big_endian module which will use try_compile and this is not supported in the Emscripten tool-chain now. We temporarily hard-code it to let the building ststem knows that the Emscripten is little endian.

In CMakelists.txt, add the follwing bolded lines.
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

