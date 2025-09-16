// Copyright (c) 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.utils;

import java.util.List;
import java.util.Set;
import java.util.logging.Logger;

import weblogic.remoteconsole.server.connection.Connection;

/**
 * Contains overall information a version of the WebLogic MBeans for an online connection to a domain.
 */
public class OnlineWebLogicMBeansVersion extends WebLogicMBeansVersion {

  private static final Logger LOGGER = Logger.getLogger(OnlineWebLogicMBeansVersion.class.getName());

  // The connection to the domain's admin server
  private Connection connection;

  @Override
  public WebLogicVersion getWebLogicVersion() {
    return connection.getWebLogicVersion();
  }

  @Override
  public Set<String> getRoles() {
    return connection.getRoles();
  }

  @Override
  public Set<String> getCapabilities() {
    return connection.getCapabilities();
  }

  @Override
  public List<RemoteConsoleExtension> getExtensions() {
    return connection.getExtensions();
  }

  public Connection getConnection() {
    return connection;
  }

  OnlineWebLogicMBeansVersion(Connection connection) {
    LOGGER.finest(
      "new OnlineeWebLogicMBeansVersion"
      + " " + connection.getWebLogicVersion()
      + " " + connection.getCapabilities()
      + " " + connection.getRoles()
    );
    this.connection = connection;
  }
}
