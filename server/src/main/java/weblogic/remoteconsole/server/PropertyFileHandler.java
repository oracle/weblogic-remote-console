// Copyright (c) 2023, 2025, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server;

import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.nio.file.FileSystems;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.WatchEvent;
import java.nio.file.WatchKey;
import java.nio.file.WatchService;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonReader;

import static java.nio.file.StandardWatchEventKinds.ENTRY_CREATE;
import static java.nio.file.StandardWatchEventKinds.ENTRY_DELETE;
import static java.nio.file.StandardWatchEventKinds.ENTRY_MODIFY;

public final class PropertyFileHandler implements Runnable {
  private File propertyFile;
  private Set<String> setSystemPropertyKeys = new HashSet<String>();
  private Map<String, String> cbeProperties = new HashMap<>();
  private Set<Logger> configuredLoggers = new HashSet<>();

  // This is the case where the "property file" is actually
  // just the standard input.
  public PropertyFileHandler() {
    initCBEProperties();
  }

  public PropertyFileHandler(String file) throws IOException {
    // FortifyIssueSuppression Path Manipulation
    // The property file location is determined by our own software
    propertyFile = new File(file);
    readPropertyFile();
    initCBEProperties();
    Thread thread = new Thread(this);
    thread.setDaemon(true);
    thread.start();
  }

  public void setProperty(String key, String value) {
    if (key.equals("weblogic.remote-console-logging")) {
      initializeLoggers(value);
    } else if (ConsoleBackendRuntimeConfig.isCBEProperty(key)) {
      cbeProperties.put(key, value);
    } else {
      setSystemPropertyKeys.add(key);
      // FortifyIssueSuppression Setting Manipulation
      // This is intentionally changing settings
      System.setProperty(key, value);
    }
  }

  private void initializeLoggers(String loggingRules) {
    for (String rule : loggingRules.split(";")) {
      String loggerName = rule.substring(0, rule.indexOf('='));
      String levelString = rule.substring(rule.indexOf('=') + 1);
      try {
        Level level = Level.parse(levelString);
        Logger logger = Logger.getLogger(loggerName);
        logger.setLevel(level);
        configuredLoggers.add(logger);
      } catch (Exception e) {
        Logger thisLogger = Logger.getLogger(PropertyFileHandler.class.getName());
        thisLogger.warning(
          "Bad logger level specified in weblogic.remote-console-logging - " + levelString);
      }
    }
  }

  public void clearProperties() {
    cbeProperties.clear();
    for (String key : setSystemPropertyKeys) {
      System.getProperties().remove(key);
    }
    resetLoggers();
  }

  public void initCBEProperties() {
    ConsoleBackendRuntimeConfig.init(cbeProperties);
  }

  private void resetLoggers() {
    for (Logger logger : configuredLoggers) {
      logger.setLevel(null);
    }
    configuredLoggers.clear();
  }

  private void readPropertyFile() throws IOException {
    clearProperties();
    if (!propertyFile.exists()) {
      return;
    }
    FileReader reader = new FileReader(propertyFile);
    JsonReader jsReader = Json.createReader(reader);
    try {
      JsonObject obj = jsReader.readObject();
      for (String prop : obj.keySet()) {
        try {
          setProperty(prop, obj.getString(prop));
        } catch (Exception e) {
          setProperty(prop, obj.get(prop).toString());
        }
      }
    } finally {
      jsReader.close();
      reader.close();
    }
    // FortifyIssueSuppression Log Forging
    // This source comes from a trusted configuration file
    Logger.getLogger(PropertyFileHandler.class.getName()).log(Level.FINEST,
      "System properties are now: " + java.util.Arrays.asList(System.getProperties()));
  }

  @Override
  public void run() {
    try {
      WatchService watchService = FileSystems.getDefault().newWatchService();
      // FortifyIssueSuppression Path Manipulation
      // The property file location is determined by our own software
      Path path = Paths.get(propertyFile.getParent());
      // FortifyIssueSuppression Log Forging
      // The path is our own location
      Logger.getLogger(PropertyFileHandler.class.getName()).log(Level.FINEST,
        "Setting up watch on: " + path);
      path.register(watchService, ENTRY_MODIFY, ENTRY_CREATE, ENTRY_DELETE);
      while (true) {
        WatchKey key = watchService.take();
        for (WatchEvent<?> event : key.pollEvents()) {
          if (event.context().toString().equals(propertyFile.getName())) {
            Logger.getLogger(PropertyFileHandler.class.getName()).log(Level.FINEST,
              "File changed: " + event.context().toString());
            int i = 0;
            try {
              readPropertyFile();
              initCBEProperties();
            } catch (Exception e) {
              if (++i == 3) {
                throw e;
              }
              Thread.sleep(100);
            }
            break;
          }
        }
        key.reset();
      }
    } catch (Exception e) {
      Logger.getLogger(PropertyFileHandler.class.getName()).log(Level.WARNING, "Error reading config file", e);
    }
  }
}
