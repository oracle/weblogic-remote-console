// Copyright (c) 2020, 2021, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server;

import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;

import io.helidon.config.Config;
import io.helidon.config.ConfigSources;
import weblogic.remoteconsole.common.utils.StringUtils;
import weblogic.remoteconsole.server.connection.Connection;
import weblogic.remoteconsole.server.connection.ConnectionManager;
import weblogic.remoteconsole.server.utils.WebLogicProperties;

/** A singleton that provides runtime information for the WebLogic Console Backend. */
public class ConsoleBackendRuntime {

  public static final ConsoleBackendRuntime INSTANCE = new ConsoleBackendRuntime();

  // The "server.config.file" string constant.
  public static final String SERVER_CONFIG_FILE_PROPERTY = "server.config.file";

  // Logger for the Console Backend Runtime initialized with Singleton
  private final Logger logger;

  // Console Backend Runtime Singleton State
  private final ConnectionManager connectionManager;
  private final Map<String, String> properties = new HashMap<String, String>();
  private volatile Config config;
  private volatile Mode mode = Mode.STANDALONE;
  private volatile State state = State.DISCONNECTED;
  private volatile Connection connection = null;

  // Singleton State Initialization
  private ConsoleBackendRuntime() {
    this.logger = Logger.getLogger(ConsoleBackendRuntime.class.getName());
    this.connectionManager = new ConnectionManager(getConfig());
  }

  /**
   * Obtain the ConnectionManager which creates and manages Console Backend connections to WebLogic
   * Domains
   */
  public ConnectionManager getConnectionManager() {
    return connectionManager;
  }

  /**
   * Attempt to create a connection to the WebLogic Domain when Console Backend is started with
   * credentials
   *
   * @return The WebLogic Domain URL specified when Console Backend was started or <code>null</code>
   *     when the URL was not specified.
   */
  public String attemptConnection() {
    // Obtain the properties used when the Console Backend was started
    String url = getProperty(WebLogicProperties.WEBLOGIC_ADMIN_URL_PROPERTY);
    String user = getProperty(WebLogicProperties.WEBLOGIC_USERNAME_PROPERTY);
    String pass = getProperty(WebLogicProperties.WEBLOGIC_PASSWORD_PROPERTY);

    // Establish a connection when the Console Backed credentials have been supplied
    if (!StringUtils.isEmpty(user) && !StringUtils.isEmpty(pass) && !StringUtils.isEmpty(url)) {
      ConsoleBackendRuntime.INSTANCE.setMode(Mode.CREDENTIALS);

      // Make the connection with the specified WebLogic Domain
      Connection connection = getConnectionManager().makeConnection(url, user, pass);

      // Establish the singleton connection for the Console Backend
      ConsoleBackendRuntime.INSTANCE.setConnection(connection);
    }

    // Return the WebLogic Domain URL
    return url;
  }

  /** Console Backend Connection States */
  public enum State {
    DISCONNECTED("disconnected"),
    CONNECTED("connected");

    public final String value;

    State(String value) {
      this.value = value;
    }
  }

  /** Console Backend Startup Modes */
  public enum Mode {
    CREDENTIALS("credentials"),
    STANDALONE("standalone");

    public final String value;

    Mode(String value) {
      this.value = value;
    }
  }

  /**
   * Get the value for a runtime property.
   *
   * @param name the name of the runtime property
   * @return the value of the runtime property, or {@code null} if no runtime property called {@code
   *     name} exists yet.
   */
  public String getProperty(String name) {
    String result = null;
    synchronized (this.properties) {
      result = this.properties.get(name);
    }
    return result;
  }

  /**
   * A thread-safe way to set the value for a runtime property.
   * <p>
   * This method allows for the creation of properties other than those for the public static
   * final String variables. The only stipulation is that the name cannot be null or an empty
   * string. The property will not be set (or added) if either of those is true.
   *
   * @param name the name of the runtime property
   * @param value the value to assign to the runtime property
   */
  public void setProperty(String name, String value) {
    synchronized (this.properties) {
      if (name != null && name.length() > 0 && value != null) {
        this.properties.put(name, value);
      }
    }
  }

  /**
   * Provide runtime with {@link io.helidon.config.Config} object for {@code console} tree.
   *
   * @param config Helidon MPConfig object
   */
  public synchronized void setConfig(Config config) {
    this.config = config;
  }

  /**
   * Get runtime {@link io.helidon.config.Config} object for {@code console} tree.
   *
   * @return Helidon MPConfig object
   */
  public synchronized Config getConfig() {
    if (this.config == null) {
      this.config = loadConfig();
    }
    return this.config;
  }

  /** Current mode of how the CBE was started. */
  public Mode getMode() {
    return mode;
  }

  public void setMode(Mode mode) {
    this.mode = mode;
  }

  /** Current state of the CBE connection. */
  public State getState() {
    return state;
  }

  /** Current CBE connection. */
  public synchronized Connection getConnection() {
    return connection;
  }

  public synchronized void setConnection(Connection connection) {
    if (connection != null) {
      this.connection = connection;
      this.state = State.CONNECTED;
    } else {
      this.connection = null;
      this.state = State.DISCONNECTED;
    }
  }

  public void init(String[] args) {
    // Use setProperty(Property, Object) to assign the properties related to
    // WebLogic RESTful Management endpoint. setProperty(Property, Object)
    // ignores attempts to assign null values to properties, so we don't need
    // to check, here.
    if (args.length > 0) {
      setProperty(WebLogicProperties.WEBLOGIC_USERNAME_PROPERTY, args[0]);
      if (args.length > 1) {
        setProperty(WebLogicProperties.WEBLOGIC_PASSWORD_PROPERTY, args[1]);
        if (args.length > 2) {
          setProperty(WebLogicProperties.WEBLOGIC_ADMIN_URL_PROPERTY, args[2]);
        }
      }
    }
    setProperty(WebLogicProperties.WEBLOGIC_USERNAME_PROPERTY, WebLogicProperties.getUsername());
    setProperty(WebLogicProperties.WEBLOGIC_PASSWORD_PROPERTY, WebLogicProperties.getPassword());
    setProperty(WebLogicProperties.WEBLOGIC_ADMIN_URL_PROPERTY, WebLogicProperties.getAdminUrl());
  }

  private Config loadConfig() {
    String serverConfigFile = System.getProperty(SERVER_CONFIG_FILE_PROPERTY);
    Config config = null;
    String message = null;
    if (serverConfigFile != null) {
      config = Config.builder(ConfigSources.file(serverConfigFile)).build();
      message = "Server configured using file system: " + serverConfigFile;
    } else {
      serverConfigFile = "/application.yaml";
      config = Config.builder(ConfigSources.classpath(serverConfigFile).optional()).build();
      message = "Server configured using classpath: " + serverConfigFile;
    }

    // FortifyIssueSuppression Log Forging
    // The log file is controlled by the same administrator and is, therefore,
    // not forgeable by a third-party
    logger.info(message);

    // Do a get("console") on the Helidon MPConfig
    // object, so we only expose the "console" tree.
    // When code calls INSTANCE.getConfig(), the Config they
    // get back will not contain the root "console"
    // node, just child nodes (e.g. "name" etc.) of it.
    return config.get("console");
  }
}
