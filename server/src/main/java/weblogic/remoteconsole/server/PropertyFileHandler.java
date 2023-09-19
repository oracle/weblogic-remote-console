// Copyright (c) 2023, Oracle Corporation and/or its affiliates.
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
import java.util.HashSet;
import java.util.Set;
import java.util.logging.Logger;
import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonReader;

import static java.nio.file.StandardWatchEventKinds.ENTRY_CREATE;
import static java.nio.file.StandardWatchEventKinds.ENTRY_DELETE;
import static java.nio.file.StandardWatchEventKinds.ENTRY_MODIFY;
import static java.util.logging.Level.FINEST;
import static java.util.logging.Level.WARNING;

public final class PropertyFileHandler implements Runnable {
  private File propertyFile;
  private Set<String> setKeys = new HashSet<String>();

  public PropertyFileHandler(String file) throws IOException {
    // FortifyIssueSuppression Path Manipulation
    // The property file location is determined by our own software
    propertyFile = new File(file);
    readPropertyFile();
    Thread thread = new Thread(this);
    thread.setDaemon(true);
    thread.start();
  }

  private void setProperty(String key, String value) {
    setKeys.add(key);
    System.setProperty(key, value);
  }

  private void clearProperties() {
    for (String key : setKeys) {
      System.getProperties().remove(key);
    }
  }

  private void parseAndSetProxy(String string) throws IOException {
    if (string.equalsIgnoreCase("direct")) {
      return;
    }
    // Would love to use URL parsing, but "socks" is not recognized
    if (!string.contains("://") || (string.lastIndexOf(":") == string.indexOf(":"))) {
      System.err.println("The proxy entry, \"" + string + "\" is not valid");
      System.err.println("It should be something like http://my-proxy.example.com:80");
      return;
    }
    String protocol = string.substring(0, string.indexOf("://"));
    String host = string.substring(
      string.indexOf("://") + 3,
      string.lastIndexOf(":"));
    String port = string.substring(string.lastIndexOf(":") + 1);
    if (protocol.equals("http")) {
      setProperty("http.proxyHost", host);
      setProperty("http.proxyPort", port);
      return;
    }
    if (protocol.equals("https")) {
      setProperty("https.proxyHost", host);
      setProperty("https.proxyPort", port);
      return;
    }
    if (protocol.equals("socks5")) {
      setProperty("socksProxyHost", host);
      setProperty("socksProxyPort", port);
      setProperty("socksProxyVersion", "5");
      return;
    }
    if (protocol.equals("socks4")) {
      setProperty("socksProxyHost", host);
      setProperty("socksProxyPort", port);
      setProperty("socksProxyVersion", "4");
      return;
    }
    System.err.println("Bad format for 'proxy' variable: " + string);
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
      boolean ignoreOtherProxySettings = obj.keySet().contains("proxy");
      for (String prop : obj.keySet()) {
        if (ignoreOtherProxySettings
          && (prop.equals("http.proxyPort")
          || prop.equals("http.proxyHost")
          || prop.equals("https.proxyPort")
          || prop.equals("https.proxyHost")
          || prop.equals("socksProxyHost")
          || prop.equals("socksProxyPort"))) {
          continue;
        }
        if (prop.equals("proxy")) {
          parseAndSetProxy(obj.getString(prop));
        } else {
          try {
            setProperty(prop, obj.getString(prop));
          } catch (Exception e) {
            setProperty(prop, obj.get(prop).toString());
          }
        }
      }
    } finally {
      jsReader.close();
      reader.close();
    }
    // FortifyIssueSuppression Log Forging
    // This source comes from a trusted configuration file
    Logger.getLogger(PropertyFileHandler.class.getName()).log(FINEST,
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
      Logger.getLogger(PropertyFileHandler.class.getName()).log(FINEST,
        "Setting up watch on: " + path);
      path.register(watchService, ENTRY_MODIFY, ENTRY_CREATE, ENTRY_DELETE);
      while (true) {
        WatchKey key = watchService.take();
        for (WatchEvent<?> event : key.pollEvents()) {
          if (event.context().toString().equals(propertyFile.getName())) {
            Logger.getLogger(PropertyFileHandler.class.getName()).log(FINEST,
              "File changed: " + event.context().toString());
            int i = 0;
            try {
              readPropertyFile();
              ConsoleBackendRuntime.INSTANCE.reloadConfig();
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
      Logger.getLogger(PropertyFileHandler.class.getName()).log(WARNING, "Error reading config file", e);
    }
  }
}
