// Copyright (c) 2024, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.filter;

/**
 * The ClientAuthHeader holds the HTTP authorization information
 * allowing for the authorization value to change, if required,
 * for a client that has connected to the domain.
 */
public class ClientAuthHeader {
  private volatile boolean isBearerToken = false;
  private volatile String authHeader = null;

  public ClientAuthHeader(String auth) {
    setAuthHeader(auth);
  }

  public void setAuthHeader(String auth) {
    boolean isBearer = (auth != null) ? auth.startsWith("Bearer ") : false;
    authHeader = auth;
    isBearerToken = isBearer;
  }

  public String getAuthHeader() {
    return authHeader;
  }

  public boolean isBearerToken() {
    return isBearerToken;
  }
}
