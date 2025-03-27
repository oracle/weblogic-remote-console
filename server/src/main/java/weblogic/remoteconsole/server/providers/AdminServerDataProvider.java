// Copyright (c) 2020, 2025, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.providers;

import java.util.Map;
import javax.json.JsonObject;

import weblogic.remoteconsole.server.repo.InvocationContext;

/**
 * The Provider interface for connections to the admin server
*/
public interface AdminServerDataProvider extends ConnectionOrientedProvider {
  public String getURL();

  public String getURLOrigin();

  public boolean isSsoTokenAvailable();

  public long getSsoTokenExpires();

  public void setSsoTokenId(String value);

  public String getSsoTokenId();

  public boolean setSsoToken(String token, String domainUrl, long expires);

  public String getSsoDomainLoginUri();

  public long getConnectTimeout();

  public long getReadTimeout();

  public boolean isDisabledHostnameVerification();

  public void setInsecureConnection(boolean value);

  public boolean isInsecureConnection();

  public void setProxyOverride(String value);

  public String getProxyOverride();

  public JsonObject getStatus(InvocationContext ic);

  public boolean isLocal();

  // Used to record information specific to this provider, for example the user and group filters
  public Map<String,Object> getCache();
}
