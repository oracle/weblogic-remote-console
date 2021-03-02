// Copyright (c) 2020, 2021, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.utils;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.List;
import java.util.logging.Logger;

/** Utilities used to help invoke plugins */
public class PluginInvocationUtils {

  private static final Logger LOGGER = Logger.getLogger(PluginInvocationUtils.class.getName());

  public static Object invokeMethod(Method method, List<Object> args) throws Exception {
    try {
      return method.invoke(null, args.toArray());
    } catch (InvocationTargetException e) {
      Throwable t = e.getCause();
      if (t instanceof Exception) {
        throw (Exception) t;
      } else if (t instanceof Error) {
        throw (Error) t;
      } else {
        throw new RuntimeException(t);
      }
    }
  }

  public static Method getMethod(String context, String pluginName) throws Exception {
    int idx = pluginName.lastIndexOf(".");
    if (idx < 1 || idx >= pluginName.length() - 1) {
      throw new Exception(context + " not <java class name>.<method name> : " + pluginName);
    }
    String javaClassName = pluginName.substring(0, idx);
    Class clazz = findJavaClass(context, javaClassName);
    String methodName = pluginName.substring(idx + 1);
    Method method = findMethod(context, clazz, methodName);
    checkThrows(context, method);
    return method;
  }

  public static void checkSignature(
    String context,
    Method method,
    Class returnTypeWant,
    Class... argTypesWant
  ) throws Exception {
    checkReturnType(context, method, returnTypeWant);
    checkArgTypes(context, method, argTypesWant);
  }

  public static void checkReturnType(String context, Method method, Class want) throws Exception {
    if (!want.equals(method.getReturnType())) {
      throw new Exception(context + " " + method + " must return a " + want.getName());
    }
  }

  public static void checkArgTypes(String context, Method method, Class... want) throws Exception {
    if (!Arrays.equals(want, method.getParameterTypes())) {
      throw new Exception(context + " " + method + " must have the following args " + Arrays.toString(want));
    }
  }

  private static void checkThrows(String context, Method method) throws Exception {
    Class[] exTypes = method.getExceptionTypes();
    if (exTypes.length == 0 || exTypes[0].equals(Exception.class)) {
      return;
    }
    throw new Exception(context + " " + method + " must throw no exceptions or only Exception");
  }

  private static Method findMethod(
    String context,
    Class clazz,
    String methodName
  ) throws Exception {
    if (StringUtils.isEmpty(methodName)) {
      throw new Exception(context + ": method name not specified");
    }
    Method rtn = null;
    for (Method method : clazz.getMethods()) {
      if (methodName.equals(method.getName())) {
        if (rtn == null) {
          rtn = method;
        } else {
          throw
            new Exception(
              context
              + " class "
              + clazz
              + " has more than one public method named "
              + methodName
            );
        }
      }
    }
    if (rtn == null) {
      throw
        new Exception(
          context
          + " class "
          + clazz
          + " does not have a public method named "
          + methodName
        );
    }
    return rtn;
  }

  public static Class findJavaClass(String context, String javaClassName) throws Exception {
    if (StringUtils.isEmpty(javaClassName)) {
      throw new Exception(context + ": javaClassName not specified");
    }
    Class clazz = null;
    try {
      return Class.forName(javaClassName);
    } catch (ClassNotFoundException e) {
      throw new Exception(context + ": can't find class " + javaClassName);
    }
  }
}
