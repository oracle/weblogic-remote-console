// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.util.Date;
import java.util.UUID;
import javax.ws.rs.container.ContainerRequestContext;

import weblogic.remoteconsole.common.utils.StringUtils;
import weblogic.remoteconsole.server.ConsoleBackendRuntime;
import weblogic.remoteconsole.server.providers.ProviderManager;

/**
 * The Frontend class corresponds to one session.  It holds
 * the cookie and keeps a link to the Provider Manager for this particular
 * session.
*/
public class Frontend {
  private String id = UUID.randomUUID().toString();
  private long lastRequestTime;
  private ProviderManager pm = new ProviderManager();
  private static boolean isSameSiteCookieEnabled =
    ConsoleBackendRuntime.INSTANCE.getConfig()
    .get("enableSameSiteCookieValue")
    .asBoolean()
    .orElse(false);
  private static String valueSameSiteCookie =
    ConsoleBackendRuntime.INSTANCE.getConfig()
      .get("valueSameSiteCookie")
      .asString()
      .orElse(null);

  public String getID() {
    return id;
  }

  public void setLastRequestTime() {
    lastRequestTime = new Date().getTime();
  }

  public long getLastRequestTime() {
    return lastRequestTime;
  }

  public void terminate() {
    pm.terminate();
  }

  public void storeInRequestContext(ContainerRequestContext context) {
    context.setProperty(Frontend.class.getName(), this);
  }

  public static Frontend getFromContext(ContainerRequestContext context) {
    return (Frontend) context.getProperty(Frontend.class.getName());
  }

  public ProviderManager getProviderManager() {
    return pm;
  }

  public boolean isSameSiteCookieEnabled() {
    return isSameSiteCookieEnabled && !StringUtils.isEmpty(valueSameSiteCookie);
  }

  public String getValueSameSiteCookie() {
    return valueSameSiteCookie;
  }
}
