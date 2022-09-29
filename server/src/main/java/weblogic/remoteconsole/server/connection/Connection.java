// Copyright (c) 2020, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.connection;

import java.util.Set;
import javax.ws.rs.client.Client;

import weblogic.remoteconsole.common.utils.WebLogicPSU;
import weblogic.remoteconsole.common.utils.WebLogicVersion;

/** The Connection interface holding connection information */
public interface Connection {

  /** Obtain the Connection ID */
  public String getId();

  /** Obtain the WebLogic Domain URL */
  public String getDomainUrl();

  /** Obtain the WebLogic Domain Name */
  public String getDomainName();

  /** Obtain the WebLogic Version */
  public WebLogicVersion getWebLogicVersion();

  /** Obtain the PSU. Returns null if using GA. */
  public WebLogicPSU getPSU();

  /**
   * Obtain the version of the console REST extension installed in the domain
   * (returns null if the extension is not installed)
   */
  public String getConsoleExtensionVersion();

  /**
   * Obtain the capabilities of the console REST extension installed in the domain
   * (returns an empty set if the extension is not installed)
   */
  public Set<String> getConsoleExtensionCapabilities();

  /** Obtain the Connection Username */
  public String getUsername();

  /** Obtain the JAX-RS Client for the Connection */
  public Client getClient();

  /** Close the client, object will be useless after this, but closing is
   * required by JaxRS.  Without closing the client, there there are leaks
   */
  public void close();
}
