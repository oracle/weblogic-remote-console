// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.connection;

import javax.ws.rs.client.Client;

/** The Connection interface holding connection information */
public interface Connection {

  /** Obtain the Connection ID */
  public String getId();

  /** Obtain the WebLogic Domain URL */
  public String getDomainUrl();

  /** Obtain the WebLogic Domain Name */
  public String getDomainName();

  /** Obtain the WebLogic Domain Version */
  public String getDomainVersion();

  /** Obtain the Connection Username */
  public String getUsername();

  /** Obtain the JAX-RS Client for the Connection */
  public Client getClient();
}
