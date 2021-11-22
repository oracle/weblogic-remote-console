// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.connection;

import javax.ws.rs.client.Client;

/** The implementation of Connection interface holding connection information */
public class ConnectionImpl implements Connection {
  // Connection State
  private String id;
  private String domainUrl;
  private String domainName;
  private String domainVersion;
  private String username;
  private Client client;

  /** Package level contructor for use by the ConnectionManager */
  ConnectionImpl(
    String id,
    String domainUrl,
    String domainName,
    String domainVersion,
    String username,
    Client client
  ) {
    this.id = id;
    this.domainUrl = domainUrl;
    this.domainName = domainName;
    this.domainVersion = domainVersion;
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
  public String getDomainVersion() {
    return domainVersion;
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
