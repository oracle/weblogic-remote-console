// Copyright (c) 2020, 2021, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.utils;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.lang.reflect.Type;
import java.util.Arrays;
import java.util.List;

/** Utilities used to help invoke customizers */
public class CustomizerInvocationUtils {

  private CustomizerInvocationUtils() {
  }

  public static Object invokeMethod(Method method, List<Object> args) {
    try {
      return method.invoke(null, args.toArray());
    } catch (InvocationTargetException e) {
      rethrow(e.getCause());
    } catch (IllegalAccessException e) {
      rethrow(e);
    }
    return null;
  }

  public static Method getMethod(String customizerName) {
    int idx = customizerName.lastIndexOf(".");
    if (idx < 1 || idx >= customizerName.length() - 1) {
      throw new AssertionError("Not <java class name>.<method name> : " + customizerName);
    }
    String javaClassName = customizerName.substring(0, idx);
    Class clazz = findJavaClass(javaClassName);
    String methodName = customizerName.substring(idx + 1);
    Method method = findMethod(clazz, methodName);
    checkThrows(method);
    return method;
  }

  public static void checkSignature(Method method, Type returnTypeWant, Type... argTypesWant) {
    checkReturnType(method, returnTypeWant);
    checkArgTypes(method, argTypesWant);
  }

  public static void checkReturnType(Method method, Type want) {
    if (!want.equals(method.getGenericReturnType())) {
      throw new AssertionError(method + " must return a " + want);
    }
  }

  public static void checkArgTypes(Method method, Type... want) {
    if (!Arrays.equals(want, method.getGenericParameterTypes())) {
      throw new AssertionError(method + " must have the following args " + Arrays.toString(want));
    }
  }

  private static void checkThrows(Method method) {
    Class[] exTypes = method.getExceptionTypes();
    if (exTypes.length == 0) {
      return;
    }
    throw new AssertionError(method + " must throw not throw typed exceptions");
  }

  private static Method findMethod(Class clazz, String methodName) {
    if (StringUtils.isEmpty(methodName)) {
      throw new AssertionError("method name not specified");
    }
    Method rtn = null;
    for (Method method : clazz.getMethods()) {
      if (methodName.equals(method.getName())) {
        if (rtn == null) {
          rtn = method;
        } else {
          throw new AssertionError(clazz + " has more than one public method named " + methodName);
        }
      }
    }
    if (rtn == null) {
      throw new AssertionError(clazz + " does not have a public method named " + methodName);
    }
    return rtn;
  }

  public static Class findJavaClass(String javaClassName) {
    if (StringUtils.isEmpty(javaClassName)) {
      throw new AssertionError("javaClassName not specified");
    }
    Class clazz = null;
    try {
      return Class.forName(javaClassName);
    } catch (ClassNotFoundException e) {
      throw new AssertionError("Can't find class " + javaClassName);
    }
  }

  private static void rethrow(Throwable t) {
    if (t instanceof RuntimeException) {
      throw (RuntimeException)t;
    } else if (t instanceof Error) {
      throw (Error)t;
    } else {
      throw new RuntimeException(t);
    }
  }
}
