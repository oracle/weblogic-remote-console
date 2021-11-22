// Copyright (c) 2020, 2021, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.utils;

import java.lang.annotation.Annotation;
import java.lang.reflect.Method;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

import weblogic.remoteconsole.customizers.Source;

/** Utilities used to help parse customizer @Source annotations */
public class CustomizerSourceUtils {

  private CustomizerSourceUtils() {
  }

  public static class Parameter {
    private Type type;
    private Source source;

    public Type getType() {
      return type;
    }

    public Source getSource() {
      return source;
    }

    @Override
    public String toString() {
      return "Parameter(type=" + getType() + ", source=" + getSource() + ")";
    }

    private Parameter(Type type, Source source) {
      this.type = type;
      this.source = source;
    }
  }

  public static List<Parameter> getParameters(Method method) {
    List<Parameter> rtn = new ArrayList<>();
    Type[] types = method.getGenericParameterTypes();
    Annotation[][] annotations = method.getParameterAnnotations();
    for (int i = 0; i < types.length; i++) {
      rtn.add(new Parameter(types[i], getSourceAnnotation(method, annotations[i])));
    }
    return rtn;
  }

  private static Source getSourceAnnotation(Method method, Annotation[] annotations) {
    Source rtn = null;
    for (Annotation annotation : annotations) {
      if (annotation instanceof Source) {
        if (rtn != null) {
          throw new AssertionError(method + " multiple Source annotations");
        }
        rtn = (Source)annotation;
      }
    }
    return rtn;
  }
}
