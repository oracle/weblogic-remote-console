// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver;

import java.lang.annotation.Annotation;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

import weblogic.console.backend.driver.plugins.Source;

/** Utilities used to help parse plugin @Source annotations */
public class PluginSourceUtils {

  private static final Logger LOGGER = Logger.getLogger(PluginSourceUtils.class.getName());

  public static class Parameter {
    private Class<?> javaClass;

    public Class<?> getJavaClass() {
      return this.javaClass;
    }

    private Source source;

    public Source getSource() {
      return this.source;
    }

    @Override
    public String toString() {
      return "Parameter(javaClass=" + getJavaClass() + ",source=" + getSource() + ")";
    }

    private Parameter(Class<?> javaClass, Source source) {
      this.javaClass = javaClass;
      this.source = source;
    }
  }

  public static List<Parameter> getParameters(Method method) throws Exception {
    List<Parameter> rtn = new ArrayList<>();
    Class<?>[] types = method.getParameterTypes();
    Annotation[][] annotations = method.getParameterAnnotations();
    for (int i = 0; i < types.length; i++) {
      rtn.add(new Parameter(types[i], getSourceAnnotation(annotations[i])));
    }
    return rtn;
  }

  private static Source getSourceAnnotation(Annotation[] annotations) throws Exception {
    Source rtn = null;
    for (Annotation annotation : annotations) {
      if (annotation instanceof Source) {
        if (rtn != null) {
          throw new Exception("Multiple Source annotations");
        }
        rtn = (Source) annotation;
      }
    }
    return rtn;
  }
}
