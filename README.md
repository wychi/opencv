### OpenCV: Open Source Computer Vision Library

[![Gittip](http://img.shields.io/gittip/OpenCV.png)](https://www.gittip.com/OpenCV/)

### Compile

# Download source code and switch to opencvjs branch
```
git clone https://github.com/kakukogou/opencv.git
cd opencv
git branch opencvjs
```
# [optional] Modify the CMakelists.txt
If you decide not to compile from the opencvjs branch, please do the following modification to avoid running test_big_endian module which will use try_compile and this is not supported in the Emscripten tool-chain now. We temporarily hard-code it to let the building ststem knows that the Emscripten is little endian.

In CMakelists.txt, add the follwing bolded lines.
```
# ----------------------------------------------------------------------------
#  Detect endianness of build platform
# ----------------------------------------------------------------------------

if(CMAKE_SYSTEM_NAME STREQUAL iOS)
  # test_big_endian needs try_compile, which doesn't work for iOS
  # http://public.kitware.com/Bug/view.php?id=12288
  set(WORDS_BIGENDIAN 0)
**elseif(CMAKE_SYSTEM_NAME STREQUAL Emscripten)**
  **# hardcode for disabling test_big_endian and set it to little_endian**
  **set(WORDS_BIGENDIAN 0)**
else()
  include(TestBigEndian)
  test_big_endian(WORDS_BIGENDIAN)
endif()
```

#### Resources

* Homepage: <http://opencv.org>
* Docs: <http://docs.opencv.org>
* Q&A forum: <http://answers.opencv.org>
* Issue tracking: <http://code.opencv.org>

#### Contributing

Please read before starting work on a pull request: <http://code.opencv.org/projects/opencv/wiki/How_to_contribute>

Summary of guidelines:

* One pull request per issue;
* Choose the right base branch;
* Include tests and documentation;
* Clean up "oops" commits before submitting;
* Follow the coding style guide.
