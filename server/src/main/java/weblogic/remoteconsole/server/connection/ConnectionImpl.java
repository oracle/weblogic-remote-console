// Copyright (c) 2020, 2023, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.connection;

import java.util.Set;
import javax.ws.rs.client.Client;

import weblogic.remoteconsole.common.utils.WebLogicVersion;

/** The implementation of Connection interface holding connection information */
public class ConnectionImpl implements Connection {
  // Connection State
  private String id;
  private String domainUrl;
  private String domainName;
  private WebLogicVersion weblogicVersion;
  private String consoleExtensionVersion;
  private Set<String> capabilities;
  private String username;
  private long connectTimeout;
  private long readTimeout;
  private Client client;

  /** Package level contructor for use by the ConnectionManager */
  ConnectionImpl(
    String id,
    String domainUrl,
    String domainName,
    WebLogicVersion weblogicVersion,
    String consoleExtensionVersion,
    Set<String> capabilities,
    String username,
    Client client,
    long connectTimeout,
    long readTimeout
  ) {
    this.id = id;
    this.domainUrl = domainUrl;
    this.domainName = domainName;
    this.weblogicVersion = weblogicVersion;
    this.consoleExtensionVersion = consoleExtensionVersion;
    this.capabilities = capabilities;
    this.username = username;
    this.client = client;
    this.connectTimeout = connectTimeout;
    this.readTimeout = readTimeout;
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
  public String getConsoleExtensionVersion() {
    return consoleExtensionVersion;
  }

  @Override
  public Set<String> getCapabilities() {
    return capabilities;
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
  public long getConnectTimeout() {
    return connectTimeout;
  }

  @Override
  public long getReadTimeout() {
    return readTimeout;
  }

  @Override
  public void close() {
    if (client != null) {
      client.close();
      client = null;
    }
  }
}
