// Copyright (c) 2020, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.connection;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import javax.ws.rs.client.Client;

import weblogic.remoteconsole.common.utils.RemoteConsoleExtension;
import weblogic.remoteconsole.common.utils.WebLogicVersion;

/** The implementation of Connection interface holding connection information */
public class ConnectionImpl implements Connection {
  // Connection State
  private String id;
  private String domainUrl;
  private String domainName;
  private String adminServerName;
  private WebLogicVersion weblogicVersion;
  private String consoleExtensionVersion;
  private Set<String> capabilities;
  private List<RemoteConsoleExtensionImpl> extensionImpls;
  private List<RemoteConsoleExtension> extensions;
  private String username;
  private Set<String> roles;
  private long connectTimeout;
  private long readTimeout;
  private Client client;

  /** Package level contructor for use by the ConnectionManager */
  ConnectionImpl(
    String id,
    String domainUrl,
    String domainName,
    String adminServerName,
    WebLogicVersion weblogicVersion,
    String consoleExtensionVersion,
    Set<String> capabilities,
    List<RemoteConsoleExtensionImpl> extensionImpls,
    String username,
    Client client,
    long connectTimeout,
    long readTimeout
  ) {
    this.id = id;
    this.domainUrl = domainUrl;
    this.domainName = domainName;
    this.adminServerName = adminServerName;
    this.weblogicVersion = weblogicVersion;
    this.consoleExtensionVersion = consoleExtensionVersion;
    this.capabilities = capabilities;
    this.extensionImpls = extensionImpls;
    this.username = username;
    this.client = client;
    this.connectTimeout = connectTimeout;
    this.readTimeout = readTimeout;
    if (extensionImpls != null) {
      extensions = new ArrayList<>();
      for (RemoteConsoleExtensionImpl extensionImpl : extensionImpls) {
        extensionImpl.setConnection(this);
        extensions.add(extensionImpl);
      }
    }
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
  public String getAdminServerName() {
    return adminServerName;
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
  public List<RemoteConsoleExtension> getExtensions() {
    return extensions;
  }

  @Override
  public String getUsername() {
    return username;
  }

  @Override
  public Set<String> getRoles() {
    return roles;
  }

  void setRoles(Set<String> roles) {
    this.roles = roles;
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
