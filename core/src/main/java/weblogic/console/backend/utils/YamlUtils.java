// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.utils;

import java.io.InputStream;
import java.util.logging.Logger;

import org.yaml.snakeyaml.Yaml;

/** Utilities for managing the yaml files that hold the CBE's configuration. */
public class YamlUtils {

  private static final Logger LOGGER = Logger.getLogger(YamlUtils.class.getName());

  /**
   * Reads a yaml file found in the classpath and returns it as a typed pojo.
   * <p>
   * Returns null if the file does not exist.
   */
  public static <T> T read(String resourceName, Class<T> type) throws Exception {
    return read(resourceName, type, false);
  }

  /**
   * Reads a yaml file found in the class path and returns it as a typed pojo.
   * <p>
   * Returns null if mustExist is false and the file does not exist.
   * Throws an AssertionError if mustExist is true and the file does not exist.
   */
  public static <T> T read(String resourceName, Class<T> type, boolean mustExist) throws Exception {
    InputStream is =
      Thread.currentThread().getContextClassLoader().getResourceAsStream(resourceName);
    // System.out.println("DEBUG YamlUtils.read " + resourceName + is);
    LOGGER.fine("YamlUtils.read " + resourceName + " " + is);
    if (is == null) {
      if (mustExist) {
        throw new AssertionError(resourceName + " does not exist.");
      } else {
        return null;
      }
    }
    try {
      return (new Yaml()).loadAs(is, type);
    } catch (Throwable t) {
      throw
        new Exception(
          "Problem reading yaml file "
          + resourceName
          + " into "
          + type.getName(),
          t
        );
    } finally {
      is.close();
    }
  }

  /** Reports an error in a yaml file. */
  public static void configurationError(String error) throws Exception {
    String msg = "Configuration Error: " + error;
    LOGGER.severe(msg);
    throw new Exception(msg);
  }
}
