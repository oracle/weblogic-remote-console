// Copyright (c) 2020, 2022, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.logging.LogManager;
import java.util.logging.Logger;
import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonReader;

import io.helidon.microprofile.server.Server;
import weblogic.remoteconsole.common.utils.StringUtils;
import weblogic.remoteconsole.server.webapp.WebAppUtils;

public final class Main {
  private static final String LOGGING_FILE = "logging.properties";

  public static final String WLS_CONSOLE_BACKEND = "WebLogic Console Backend";

  private static void readPropertyFile(String file) throws IOException {
    // FortifyIssueSuppression Path Manipulation
    // This is a command-line argument.  It's fine.
    File propfile = new File(file);
    if (!propfile.exists()) {
      return;
    }
    FileReader reader = new FileReader(propfile);
    JsonReader jsReader = Json.createReader(reader);
    try {
      JsonObject obj = jsReader.readObject();
      for (String prop : obj.keySet()) {
        // FortifyIssueSuppression Setting Manipulation
        // This is intentional
        System.setProperty(prop, obj.getString(prop));
      }
    } finally {
      jsReader.close();
      reader.close();
    }
  }

  private static void readStandardInput() {
    java.io.BufferedReader reader = new java.io.BufferedReader(
      new java.io.InputStreamReader(System.in));
    // java.io.PrintStream out = new java.io.PrintStream(
    // new java.io.FileOutputStream("/dev/tty"));
    while (true) {
      try {
        // FortifyIssueSuppression Denial of Service
        // This is reading stdin - not an issue
        String line = reader.readLine();
        if (line == null) {
          // FortifyIssueSuppression J2EE Bad Practices: JVM Termination
          // This isn't Java EE
          System.exit(0);
        }
      } catch (IOException eof) {
        // FortifyIssueSuppression J2EE Bad Practices: JVM Termination
        // This isn't Java EE
        System.exit(0);
      }
    }
  }

  private static void usage() {
    System.err.println(
      "Usage: console.jar"
      + " [-p port]"
      + " [--stdin]"
      + " [--useTokenNotCookie]"
      + " [--showPort]"
      + " [--properties <property-file-path>]"
      + " [--persistenceDirectory <persistence-directory-path>]"
    );
    // FortifyIssueSuppression J2EE Bad Practices: JVM Termination
    // This isn't Java EE
    System.exit(1);
  }

  public static void main(final String[] args) throws Exception {
    boolean stdin = false;
    boolean showPortOnStdout = false;
    String persistenceDirectory = System.getenv("CBE_PERSISTENCE_DIRECTORY");
    for (int i = 0; i < args.length; i++) {
      if (args[i].equals("-p")) {
        i++;
        if (args.length == i) {
          usage();
        }
        // FortifyIssueSuppression Setting Manipulation
        // This is intentional
        System.setProperty("server.port", args[1]);
      } else if (args[i].equals("--stdin")) {
        stdin = true;
      } else if (args[i].equals("--useTokenNotCookie")) {
        WebAppUtils.setUseTokenNotCookie();
      } else if (args[i].equals("--showPort")) {
        showPortOnStdout = true;
      } else if (args[i].equals("--properties")) {
        i++;
        if (args.length == i) {
          usage();
        }
        readPropertyFile(args[i]);
      } else if (args[i].equals("--persistenceDirectory")) {
        i++;
        if (args.length == i) {
          usage();
        }
        persistenceDirectory = args[i];
      }
    }
    Logger logger = configureLogging();

    PersistenceManager.initialize(persistenceDirectory);

    ConsoleBackendRuntime.INSTANCE.init(new String[0]);
    // The ConsoleBackendRuntime will attempt to connect
    // to the WebLogic Domain when WebLogic RESTful Management
    // endpoint related properties are specified at startup.
    // When unable to contact the WebLogic Domain URL, then
    // the Console Backend will be in the disconnected state.
    // Ensure that the poper credentials and URL have been
    // specified and that the Domain URL is reachable.
    String domainUrl = ConsoleBackendRuntime.INSTANCE.attemptConnection();

    // Start the server instance
    Server server = startServer();

    // Log the current WebLogic Console Backend Mode and Connection State
    ConsoleBackendRuntime.Mode mode = ConsoleBackendRuntime.INSTANCE.getMode();
    if (showPortOnStdout) {
      System.out.println("Port=" + server.port());
    }
    // logger.info(WLS_CONSOLE_BACKEND + "\n>>>> Started in " + mode + " mode <<<<");
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
    if (stdin) {
      readStandardInput();
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
