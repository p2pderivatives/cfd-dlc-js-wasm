cmake_minimum_required(VERSION 3.13)

cmake_policy(SET CMP0076 NEW)

####################
# options
####################
include(../cmake/EnableCcache.cmake)
include(../cmake/ConvertSrclistFunction.cmake)
include(../cmake/CfdCommonOption.cmake)
include(../cmake/CfdCommonSetting.cmake)

if("${CMAKE_BUILD_TYPE}" STREQUAL "Debug")
set(ENABLE_DEBUG  TRUE)
set_property(DIRECTORY APPEND PROPERTY COMPILE_DEFINITIONS $<$<CONFIG:Debug>:DEBUGBUILD>)
set(OPTION_BIGOBJ  "/bigobj")
else()
set(ENABLE_DEBUG  FALSE)
set(OPTION_BIGOBJ  "")
endif() # CMAKE_BUILD_TYPE

####################
# node build
####################
include(../cmake/Cpp11Setting.cmake)

# cfd-dlc-js-wasm
project(cfddlcjs_wasm CXX)
set(CMAKE_CXX_STANDARD 11)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

if(${USE_EMSCRIPTEN})
# total memory: 64MB
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -s TOTAL_MEMORY=67108864 -s ABORTING_MALLOC=0")
endif()

set(CFDDLCJS_API_LIBRARY cfddlcjs_api)
set(CFDDLC_LIBRARY cfddlc)
set(CFD_LIBRARY cfd)
set(CFDCORE_LIBRARY cfdcore)
set(UNIVALUE_LIBRARY univalue)
set(LIBWALLY_LIBRARY wally)

# node-api library
set(CFDDLCJS_WASM_LIBRARY cfddlcjs_wasm)
add_executable(${CFDDLCJS_WASM_LIBRARY} cfddlcjs_wasm_json.cpp)

target_compile_options(${CFDDLCJS_WASM_LIBRARY}
  PRIVATE
    $<IF:$<CXX_COMPILER_ID:MSVC>,
      /source-charset:utf-8 /Wall ${OPTION_BIGOBJ}
      /wd4061 /wd4244 /wd4251 /wd4365 /wd4464 /wd4514 /wd4571 /wd4574 /wd4623 /wd4625 /wd4626 /wd4710 /wd4711 /wd4774 /wd4820 /wd4946 /wd5026 /wd5027 /wd5039 /wd5045 /wd5052,
      -Wall ${EMSCRIPTEN_OPT}
    >
    
)

#     -fstack-protector
if(ENABLE_SHARED)
target_compile_definitions(${CFDDLCJS_WASM_LIBRARY}
  PRIVATE
    CFD_DLC_JS_API_SHARED=1
    CFDDLC_SHARED=1
    CFD_SHARED=1
    CFD_CORE_SHARED=1
    ${CFD_ELEMENTS_USE}
)
else()
target_compile_definitions(${CFDDLCJS_WASM_LIBRARY}
  PRIVATE
    ${CFD_ELEMENTS_USE}
)
endif()

target_include_directories(${CFDDLCJS_WASM_LIBRARY}
  PRIVATE
    .
)

target_link_directories(${CFDDLCJS_WASM_LIBRARY}
  PRIVATE
    ./
)

target_link_libraries(${CFDDLCJS_WASM_LIBRARY}
  PRIVATE $<$<BOOL:$<CXX_COMPILER_ID:MSVC>>:winmm.lib>
  PRIVATE $<$<BOOL:$<CXX_COMPILER_ID:MSVC>>:ws2_32.lib>
  PRIVATE $<$<BOOL:$<CXX_COMPILER_ID:GNU>>:-static-libgcc>
  PRIVATE $<$<BOOL:$<CXX_COMPILER_ID:GNU>>:-static-libstdc++>
  PRIVATE $<$<NOT:$<CXX_COMPILER_ID:MSVC>>:pthread>
  PRIVATE $<IF:$<OR:$<PLATFORM_ID:Darwin>,$<CXX_COMPILER_ID:MSVC>>,,rt>
  PRIVATE
    ${CFDDLCJS_API_LIBRARY}
    ${CFDDLC_LIBRARY}
    ${CFD_LIBRARY}
    ${CFDCORE_LIBRARY}
    ${UNIVALUE_LIBRARY}
    ${LIBWALLY_LIBRARY}
)
