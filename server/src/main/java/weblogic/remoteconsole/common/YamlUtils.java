// Copyright (c) 2020, 2024, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.yaml.snakeyaml.Yaml;

/** Utilities for managing the yaml files that hold the CBE's configuration. */
public class YamlUtils {

  private static final Logger LOGGER = Logger.getLogger(YamlUtils.class.getName());

  /**
   * Reads a yaml file found in the class path and returns it as a typed pojo.
   * <p>
   * Returns null if mustExist is false and the file does not exist.
   * Throws an AssertionError if mustExist is true and the file does not exist.
   */
  public static <T> T readResource(String yamlPath, Class<T> type, boolean mustExist) {
    return
      read(
        Thread.currentThread().getContextClassLoader().getResourceAsStream(yamlPath),
        yamlPath,
        type,
        mustExist
      );
  }

  /**
   * Reads a yaml file found on disk and returns it as a typed pojo.
   * <p>
   * Returns null if mustExist is false and the file does not exist.
   * Throws an AssertionError if mustExist is true and the file does not exist.
   */
  public static <T> T readFile(String yamlPath, Class<T> type, boolean mustExist) {
    File file = new File(yamlPath);
    if (!file.exists()) {
      return null;
    }
    InputStream is = null;
    try {
      // FortifyIssueSuppression Path Manipulation
      // The yaml file location is determined from a secure source
      is = new FileInputStream(yamlPath);
    } catch (IOException e) {
      LOGGER.warning("Exception reading yaml file " + yamlPath + " : " + e);
      return null;
    }
    return read(is, yamlPath, type, mustExist);
  }

  public static <T> T read(InputStream is, String yamlPath, Class<T> type, boolean mustExist) {
    if ("true".equals(System.getenv("debugYaml")) && is != null) {
      // FortifyIssueSuppression Log Forging
      // yamlPath contains well known values and is not a forging risk.
      LOGGER.info("YamlUtils.read " + yamlPath);
    }
    // FortifyIssueSuppression Log Forging
    // yamlPath contains well known values and is not a forging risk.
    LOGGER.fine("YamlUtils.read " + yamlPath + " " + is);
    if (is == null) {
      if (mustExist) {
        throw new AssertionError(yamlPath + " does not exist.");
      } else {
        return null;
      }
    }
    try {
      return (new Yaml()).loadAs(is, type);
    } catch (Throwable t) {
      throw
        new AssertionError(
          "Problem reading yaml file "
          + yamlPath
          + " into "
          + type.getName(),
          t
        );
    } finally {
      try {
        is.close();
      } catch (Exception e) {
        LOGGER.log(Level.WARNING, "Problem closing stream for " + yamlPath, e);
      }
    }
  }

  /** Reports an error in a yaml file. */
  public static void configurationError(String error) {
    String msg = "Configuration Error: " + error;
    LOGGER.severe(msg);
    throw new AssertionError(msg);
  }
}
