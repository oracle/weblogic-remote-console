// Copyright (c) 2020, 2021, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.providers;

/**
 * The Provider interface for connections to the admin server
*/
public interface AdminServerDataProvider extends ConnectionOrientedProvider {
  public String getURL();

  public String getAuthorizationHeader();

  public long getConnectTimeout();

  public long getReadTimeout();

  public boolean isDisableHostnameVerification();
}
