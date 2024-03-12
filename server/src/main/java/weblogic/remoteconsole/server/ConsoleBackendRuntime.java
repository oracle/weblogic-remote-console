// Copyright (c) 2020, 2023, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server;


import weblogic.remoteconsole.server.connection.ConnectionManager;
import weblogic.remoteconsole.server.token.SsoTokenManager;

/** A singleton that provides runtime information for the WebLogic Console Backend. */
public class ConsoleBackendRuntime {

  public static final ConsoleBackendRuntime INSTANCE = new ConsoleBackendRuntime();

  // Console Backend Runtime Singleton State
  private final ConnectionManager connectionManager;
  private final SsoTokenManager ssoTokenManager;

  // Singleton State Initialization
  private ConsoleBackendRuntime() {
    this.connectionManager = new ConnectionManager();
    this.ssoTokenManager = new SsoTokenManager();
  }

  /**
   * Obtain the ConnectionManager which creates and manages Console Backend connections to WebLogic
   * Domains
   */
  public ConnectionManager getConnectionManager() {
    return connectionManager;
  }

  /**
   * Obtain the SSO Token Manager which manages the SSO tokens used with the Console Backend
   * connections to WebLogic Domains
   */
  public SsoTokenManager getSsoTokenManager() {
    return ssoTokenManager;
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
}
