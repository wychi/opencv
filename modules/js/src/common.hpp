#ifndef __JS_COMMON_HPP__
#define __JS_COMMON_HPP__

#ifndef __cplusplus
#  error common.hpp header must be compiled as C++
#endif

#include "opencv2/core/mat.hpp"
#include <functional>
#include <type_traits>

template <typename T>
struct ConversionTrait {
  typedef T Type;
};

// Embind doesn't support pointers to primitive types.
// https://github.com/kripken/emscripten/issues/612#issuecomment-18428394
template <typename T>
struct ConversionTrait<T *> {
  template <typename U, bool> struct Internal { typedef U *Type; };
  template <typename U> struct Internal<U, true>  { typedef uintptr_t Type; };

  typedef typename std::remove_cv<T>::type V;
  typedef typename Internal<T, std::is_fundamental<V>::value>::Type Type;
};
template <typename T>
struct ConversionTrait<T **> {
  template <typename U, bool> struct Internal { typedef U **Type; };
  template <typename U> struct Internal<U, true>  { typedef uintptr_t Type; };

  typedef typename std::remove_cv<T>::type V;
  typedef typename Internal<T, std::is_fundamental<V>::value>::Type Type;
};

// javascript does not allow overwrite arithmatic operators. Export MatExpr
// to js side is meaningless.
template <>
struct ConversionTrait<cv::MatExpr> {
  typedef cv::Mat Type;
};

template <>
struct ConversionTrait<cv::InputArray> {
  typedef cv::Mat & Type;
};

template <>
struct ConversionTrait<cv::OutputArray> {
  typedef cv::Mat & Type;
};


template <int N,               // Index.
         typename T,           // Wrapped function type.
         template <typename> class Trait = ConversionTrait>
         struct ExplicitConversion;

         // one template parameter.
         template <int N, template <typename> class Trait, typename C, typename R, typename P0>
         struct ExplicitConversion<N, R (C::*)(P0), Trait> {
           typedef R (C::*FunctionSig)(P0);

           static void bind(FunctionSig f) { mF = f; }
           static typename Trait<R>::Type
             call(C &obj,
                 typename Trait<P0>::Type p0)
             {
               return typename Trait<R>::Type((obj.*mF)(P0(p0)));
             }

           static FunctionSig mF;
         };

template <int N, template <typename> class Trait, typename C, typename R, typename P0>
typename ExplicitConversion<N, R (C::*)(P0), Trait>::FunctionSig
ExplicitConversion<N, R (C::*)(P0), Trait>::mF = nullptr;

template <int N, template <typename> class Trait, typename R, typename P0>
struct ExplicitConversion<N, R (*)(P0), Trait> {
  typedef R (*FunctionSig)(P0);

  static void bind(FunctionSig f) { mF = f; }
  static typename Trait<R>::Type
    call(typename Trait<P0>::Type p0)
    {
      return typename Trait<R>::Type(mF(P0(p0)));
    }

  static FunctionSig mF;
};

template <int N, template <typename> class Trait, typename R, typename P0>
typename ExplicitConversion<N, R (*)(P0), Trait>::FunctionSig
ExplicitConversion<N, R (*)(P0), Trait>::mF = nullptr;


// two tempalte parameters.
template <int N, template <typename> class Trait, typename C, typename R, typename P0, typename P1>
struct ExplicitConversion<N, R (C::*)(P0, P1), Trait> {
  typedef R (C::*FunctionSig)(P0, P1);

  static void bind(FunctionSig f) { mF = f; }
  static typename Trait<R>::Type
    call(C &obj,
        typename Trait<P0>::Type p0,
        typename Trait<P1>::Type p1)
    {
      return  typename Trait<R>::Type((obj.*mF)(P0(p0), P1(p1)));
    }

  static FunctionSig mF;
};

template <int N, template <typename> class Trait, typename C, typename R, typename P0, typename P1>
typename ExplicitConversion<N, R (C::*)(P0, P1), Trait>::FunctionSig
ExplicitConversion<N, R (C::*)(P0, P1), Trait>::mF = nullptr;

template <int N, template <typename> class Trait, typename R, typename P0, typename P1>
struct ExplicitConversion<N, R (*)(P0, P1), Trait> {
  typedef R (*FunctionSig)(P0, P1);

  static void bind(FunctionSig f) { mF = f; }
  static typename Trait<R>::Type
    call(typename Trait<P0>::Type p0,
        typename Trait<P1>::Type p1)
    {
      return typename Trait<R>::Type(mF(P0(p0), P1(p1)));
    }

  static FunctionSig mF;
};

template <int N, template <typename> class Trait, typename R, typename P0, typename P1>
typename ExplicitConversion<N, R (*)(P0, P1), Trait>::FunctionSig
ExplicitConversion<N, R (*)(P0, P1), Trait>::mF = nullptr;

// three template parameters.
template <int N, template <typename> class Trait, typename R, typename P0, typename P1, typename P2>
struct ExplicitConversion<N, R (*)(P0, P1, P2), Trait> {
  typedef R (*FunctionSig)(P0, P1, P2);

  static void bind(FunctionSig f) { mF = f; }
  static typename Trait<R>::Type
    call(typename Trait<P0>::Type p0,
        typename Trait<P1>::Type p1,
        typename Trait<P2>::Type p2)
    {
      return  typename Trait<R>::Type(mF(P0(p0), P1(p1), P2(p2)));
    }

  static FunctionSig mF;
};

template <int N, template <typename> class Trait, typename R, typename P0, typename P1, typename P2>
typename ExplicitConversion<N, R (*)(P0, P1, P2), Trait>::FunctionSig
ExplicitConversion<N, R (*)(P0, P1, P2), Trait>::mF = nullptr;

// 3 template params.
template <int N, template <typename> class Trait, typename R, typename P0, typename P1, typename P2, typename P3>
struct ExplicitConversion<N, R (*)(P0, P1, P2, P3), Trait> {
  typedef R (*FunctionSig)(P0, P1, P2, P3);

  static void bind(FunctionSig f) { mF = f; }
  static typename Trait<R>::Type
    call(typename Trait<P0>::Type p0,
        typename Trait<P1>::Type p1,
        typename Trait<P2>::Type p2,
        typename Trait<P3>::Type p3)
    {
      return  typename Trait<R>::Type(mF(P0(p0), P1(p1), P2(p2), P3(p3)));
    }

  static FunctionSig mF;
};

template <int N, template <typename> class Trait, typename R, typename P0, typename P1, typename P2, typename P3>
typename ExplicitConversion<N, R (*)(P0, P1, P2, P3), Trait>::FunctionSig
ExplicitConversion<N, R (*)(P0, P1, P2, P3), Trait>::mF = nullptr;

template <int N, template <typename> class Trait, typename C, typename R, typename P0, typename P1, typename P2, typename P3>
struct ExplicitConversion<N, R (C::*)(P0, P1, P2, P3), Trait> {
  typedef R (C::*FunctionSig)(P0, P1, P2, P3);

  static void bind(FunctionSig f) { mF = f; }
  static typename Trait<R>::Type
    call(C &obj,
        typename Trait<P0>::Type p0,
        typename Trait<P1>::Type p1,
        typename Trait<P2>::Type p2,
        typename Trait<P3>::Type p3)
    {
      return  typename Trait<R>::Type((obj.*mF)(P0(p0), P1(p1), P2(p2), P3(p3)));
    }

  static FunctionSig mF;
};

template <int N, template <typename> class Trait, typename C, typename R, typename P0, typename P1, typename P2, typename P3>
typename ExplicitConversion<N, R (C::*)(P0, P1, P2, P3), Trait>::FunctionSig
ExplicitConversion<N, R (C::*)(P0, P1, P2, P3), Trait>::mF = nullptr;

template <int N, template <typename> class Trait, typename C, typename R, typename P0, typename P1, typename P2, typename P3>
struct ExplicitConversion<N, R (C::*)(P0, P1, P2, P3) const, Trait> {
  typedef R (C::*FunctionSig)(P0, P1, P2, P3) const;

  static void bind(FunctionSig f) { mF = f; }
  static typename Trait<R>::Type
    call(C &obj,
        typename Trait<P0>::Type p0,
        typename Trait<P1>::Type p1,
        typename Trait<P2>::Type p2,
        typename Trait<P3>::Type p3)
    {
      return  typename Trait<R>::Type((obj.*mF)(P0(p0), P1(p1), P2(p2), P3(p3)));
    }

  static FunctionSig mF;
};

template <int N, template <typename> class Trait, typename C, typename R, typename P0, typename P1, typename P2, typename P3>
typename ExplicitConversion<N, R (C::*)(P0, P1, P2, P3) const, Trait>::FunctionSig
ExplicitConversion<N, R (C::*)(P0, P1, P2, P3) const, Trait>::mF = nullptr;

// 10 params
template <int N, template <typename> class Trait, typename R, typename P0, typename P1, typename P2, typename P3, typename P4, typename P5, typename P6, typename P7, typename P8, typename P9>
struct ExplicitConversion<N, R (*)(P0, P1, P2, P3, P4, P5, P6, P7, P8, P9), Trait> {
  typedef R (*FunctionSig)(P0, P1, P2, P3, P4, P5, P6, P7, P8, P9);

  static void bind(FunctionSig f) { mF = f; }
  static typename Trait<R>::Type
    call(typename Trait<P0>::Type p0,
        typename Trait<P1>::Type p1,
        typename Trait<P2>::Type p2,
        typename Trait<P3>::Type p3,
        typename Trait<P4>::Type p4,
        typename Trait<P5>::Type p5,
        typename Trait<P6>::Type p6,
        typename Trait<P7>::Type p7,
        typename Trait<P8>::Type p8,
        typename Trait<P9>::Type p9)
    {
      return  typename Trait<R>::Type(mF(P0(p0), P1(p1), P2(p2), P3(p3), P4(p4), P5(p5), P6(p6), P7(p7), P8(p8), P9(p9)));
    }

  static FunctionSig mF;
};

template <int N, template <typename> class Trait, typename R, typename P0, typename P1, typename P2, typename P3, typename P4, typename P5, typename P6, typename P7, typename P8, typename P9>
typename ExplicitConversion<N, R (*)(P0, P1, P2, P3, P4, P5, P6, P7, P8, P9), Trait>::FunctionSig
ExplicitConversion<N, R (*)(P0, P1, P2, P3, P4, P5, P6, P7, P8, P9), Trait>::mF = nullptr;

#endif
