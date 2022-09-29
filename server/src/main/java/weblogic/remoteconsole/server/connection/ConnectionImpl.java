// Copyright (c) 2020, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.connection;

import java.util.Set;
import javax.ws.rs.client.Client;

import weblogic.remoteconsole.common.utils.WebLogicPSU;
import weblogic.remoteconsole.common.utils.WebLogicVersion;

/** The implementation of Connection interface holding connection information */
public class ConnectionImpl implements Connection {
  // Connection State
  private String id;
  private String domainUrl;
  private String domainName;
  private WebLogicVersion weblogicVersion;
  private WebLogicPSU psu;
  private String consoleExtensionVersion;
  private Set<String> consoleExtensionCapabilities;
  private String username;
  private Client client;

  /** Package level contructor for use by the ConnectionManager */
  ConnectionImpl(
    String id,
    String domainUrl,
    String domainName,
    WebLogicVersion weblogicVersion,
    WebLogicPSU psu,
    String consoleExtensionVersion,
    Set<String> consoleExtensionCapabilities,
    String username,
    Client client
  ) {
    this.id = id;
    this.domainUrl = domainUrl;
    this.domainName = domainName;
    this.weblogicVersion = weblogicVersion;
    this.psu = psu;
    this.consoleExtensionVersion = consoleExtensionVersion;
    this.consoleExtensionCapabilities = consoleExtensionCapabilities;
    this.username = username;
    this.client = client;
  }

  @Override
  public String getId() {
    return id;
  }

  @Override
  public String getDomainUrl() {
    return domainUrl;
  }

  @Override
  public String getDomainName() {
    return domainName;
  }

  @Override
  public WebLogicVersion getWebLogicVersion() {
    return weblogicVersion;
  }

  @Override
  public WebLogicPSU getPSU() {
    return psu;
  }

  @Override
  public String getConsoleExtensionVersion() {
    return consoleExtensionVersion;
  }

  @Override
  public Set<String> getConsoleExtensionCapabilities() {
    return consoleExtensionCapabilities;
  }

  @Override
  public String getUsername() {
    return username;
  }

  @Override
  public Client getClient() {
    return client;
  }

  @Override
  public void close() {
    if (client != null) {
      client.close();
      client = null;
    }
  }
}
