// Copyright (c) 2020, 2021, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package com.oracle.weblogic.console.backend.server;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.logging.LogManager;
import java.util.logging.Logger;

import io.helidon.microprofile.server.Server;
import weblogic.console.backend.ConsoleBackendRuntime;
import weblogic.console.backend.utils.StringUtils;

public final class Main {
  private static final String LOGGING_FILE = "logging.properties";

  public static final String WLS_CONSOLE_BACKEND = "WebLogic Console Backend";

  public static void main(final String[] args) throws Exception {
    Logger logger = configureLogging();
    ConsoleBackendRuntime.INSTANCE.init(args);

    // The ConsoleBackendRuntime will attempt to connect
    // to the WebLogic Domain when WebLogic RESTful Management
    // endpoint related properties are specified at startup.
    // When unable to contact the WebLogic Domain URL, then
    // the Console Backend will be in the disconnected state.
    // Ensure that the poper credentials and URL have been
    // specified and that the Domain URL is reachable.
    String domainUrl = ConsoleBackendRuntime.INSTANCE.attemptConnection();

    // Start the server instance
    startServer();

    // Log the current WebLogic Console Backend Mode and Connection State
    ConsoleBackendRuntime.Mode mode = ConsoleBackendRuntime.INSTANCE.getMode();
    logger.info(WLS_CONSOLE_BACKEND + "\n>>>> Started in " + mode + " mode <<<<");
    if (mode == ConsoleBackendRuntime.Mode.CREDENTIALS) {
      ConsoleBackendRuntime.State state = ConsoleBackendRuntime.INSTANCE.getState();
      // FortifyIssueSuppression Log Forging
      // The URL is scrubbed by cleanStringForLogging
      // The state is not user input but fortify thinks it is
      logger.info(
        WLS_CONSOLE_BACKEND
          + "\n>>>> WebLogic Domain URL '"
          + StringUtils.cleanStringForLogging(domainUrl)
          + "' is "
          + state
          + " <<<<");
    }
  }

  private Main() {
  }

  private static Server startServer() {
    // Server will automatically pick up configuration from
    // resources/microprofile-config.properties
    return Server.create().start();
  }

  /**
   * Configure logging with logging.properties file stored in executable jar, or a path specified
   * with {@code -Djava.util.logging.config.file} Java system property.
   */
  private static Logger configureLogging() throws IOException {
    String configClass = System.getProperty("java.util.logging.config.class");
    String configPath = System.getProperty("java.util.logging.config.file");
    String source;

    if (configClass != null) {
      source = "class: " + configClass;
    } else if (configPath != null) {
      // FortifyIssueSuppression Path Manipulation
      // Users do not have access to the configuration file and people that do are
      // trusted.
      Path path = Paths.get(configPath);
      // FortifyIssueSuppression Path Manipulation
      // Users do not have access to the configuration file and people that do are
      // trusted.
      File f = new File(configPath);
      if (f.exists()) {
        source = path.toAbsolutePath().toString();
      } else {
        System.getProperties().remove("java.util.logging.config.file");
        source = LOGGING_FILE;
      }
    } else {
      // we want to configure logging ourselves
      source = findAndConfigureLogging();
    }

    Logger logger = Logger.getLogger(Main.class.getName());
    // FortifyIssueSuppression Log Forging
    // This source comes from a trusted configuration file
    logger.info("Logging configured using " + source);
    return logger;
  }

  private static String findAndConfigureLogging() throws IOException {
    String source = "defaults";

    // Let's try to find a logging.properties
    // first as a file in the current working directory
    InputStream logConfigStream;

    Path path = Paths.get("").resolve(LOGGING_FILE);

    if (Files.exists(path)) {
      logConfigStream = new BufferedInputStream(Files.newInputStream(path));
      source = "file: " + path.toAbsolutePath();
    } else {
      // second look for classpath (only the first one)
      InputStream resourceStream = Main.class.getResourceAsStream("/" + LOGGING_FILE);
      if (null != resourceStream) {
        logConfigStream = new BufferedInputStream(resourceStream);
        source = "classpath: /" + LOGGING_FILE;
      } else {
        logConfigStream = null;
      }
    }

    if (null != logConfigStream) {
      try {
        LogManager.getLogManager().readConfiguration(logConfigStream);
      } finally {
        logConfigStream.close();
      }
    }

    return source;
  }
}
