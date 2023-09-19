// Copyright (c) 2020, 2023, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.providers;

import javax.json.JsonObject;

import weblogic.remoteconsole.server.repo.InvocationContext;

/**
 * The Provider interface for connections to the admin server
*/
public interface AdminServerDataProvider extends ConnectionOrientedProvider {
  public String getURL();

  public boolean isSsoTokenAvailable();

  public long getSsoTokenExpires();

  public void setSsoTokenId(String value);

  public String getSsoTokenId();

  public boolean setSsoToken(String token, String domainUrl, long expires);

  public long getConnectTimeout();

  public long getReadTimeout();

  public boolean isDisabledHostnameVerification();

  public void setInsecureConnection(boolean value);

  public boolean isInsecureConnection();

  public void setProxyOverride(String value);

  public String getProxyOverride();

  public JsonObject getStatus(InvocationContext ic);
}
