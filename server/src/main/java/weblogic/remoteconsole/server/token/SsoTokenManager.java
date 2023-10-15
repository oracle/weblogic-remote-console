// Copyright (c) 2023, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.token;

import java.math.BigInteger;
import java.security.SecureRandom;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.Timer;
import java.util.TimerTask;
import java.util.concurrent.ConcurrentHashMap;
import java.util.logging.Logger;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ResourceContext;

import weblogic.remoteconsole.server.ConsoleBackendRuntime;
import weblogic.remoteconsole.server.providers.AdminServerDataProvider;

/**
 * The SsoTokenManager keeps a map of the SSO token IDs (i.e. a nonce) to
 * the AdminServerConnection provider that will consume and use the token.
*/
public class SsoTokenManager {
  private static final Logger LOGGER = Logger.getLogger(SsoTokenManager.class.getName());
  private static final int SEED_SIZE = 16;
  private static final int NONCE_SIZE = 8;

  // Default SSO timer settings that align with application.yaml
  public static final long DEFAULT_SSO_TIMER_SECONDS = 30L;
  public static final long DEFAULT_SSO_TIMEOUT_SECONDS = 300L;

  private SecureRandom nonceGenerator = null;
  private volatile Timer ssoTimer = null;
  private volatile ConcurrentHashMap<String, ProviderEntry> ssoTokenIdMap;

  /**
   * Set the Console Backend instance of the SsoTokenManager in the JAX-RS request context...
   */
  public static void setInRequestContext(ContainerRequestContext requestContext) {
    ConsoleBackendRuntime.INSTANCE.getSsoTokenManager().storeInRequestContext(requestContext);
  }

  /**
   * Get the Console Backend instance of the SsoTokenManager from the JAX-RS request context...
   */
  public static SsoTokenManager getFromRequestContext(ContainerRequestContext requestContext) {
    return (SsoTokenManager) requestContext.getProperty(SsoTokenManager.class.getName());
  }

  /**
   * Obtain the SsoTokenManager reference from the JAX-RS resource context...
   */
  public static SsoTokenManager getFromResourceContext(ResourceContext resourceContext) {
    return getFromRequestContext(resourceContext.getResource(ContainerRequestContext.class));
  }

  private long getSSOTimerMillis() {
    return ConsoleBackendRuntime.INSTANCE.getConfig()
        .get("ssoTimerSeconds").asLong()
        .orElse(DEFAULT_SSO_TIMER_SECONDS) * 1000L;
  }

  private long getSSOTimeoutMillis() {
    return ConsoleBackendRuntime.INSTANCE.getConfig()
        .get("ssoTimeoutSeconds").asLong()
        .orElse(DEFAULT_SSO_TIMEOUT_SECONDS) * 1000L;
  }

  /**
   * Create the SsoTokenManager instance but lazy initialize the nonce generator...
   */
  public SsoTokenManager() {
    ssoTokenIdMap = new ConcurrentHashMap<>();
  }

  /**
   * Store the SsoTokenManager in the JAX-RS request context...
   */
  public void storeInRequestContext(ContainerRequestContext requestContext) {
    requestContext.setProperty(SsoTokenManager.class.getName(), this);
  }

  /**
   * Get the AdminServerDataProvider that maps to the SSO token ID...
   */
  public AdminServerDataProvider get(String ssoid) {
    AdminServerDataProvider provider = getProviderFromEntry(ssoid);
    LOGGER.fine("Get provider with ssoid '" + ssoid + (provider == null ? "' NOT FOUND!" : "'"));
    return provider;
  }

  /**
   * Add the AdminServerDataProvider instance and return the SSO token ID...
   * @return nonce value used as the SSO token ID
   */
  public String add(AdminServerDataProvider provider) {
    String ssoid = getNonce();
    LOGGER.fine("Add provider '" + provider.getName() + "' ssoid: " + ssoid);
    addProviderEntry(ssoid, provider);
    checkSsoTimer();
    return ssoid;
  }

  /**
   * Remove the AdminServerDataProvider instance and return the SSO token ID...
   * @return The SSO token ID that was removed or null
   */
  public String remove(AdminServerDataProvider provider) {
    String ssoid = provider.getSsoTokenId();
    if (ssoid != null) {
      LOGGER.fine("Remove provider '" + provider.getName() + "' ssoid: " + ssoid);
      ssoTokenIdMap.remove(ssoid);
      checkSsoTimer();
    }
    return ssoid;
  }

  /**
   * Determine if the HTTP/S origin is allowed based on the current provider entries...
   * @return true when found, otherwise false
   */
  public boolean isAllowedOrigin(String origin) {
    boolean result = false;
    if ((origin != null) && !origin.isBlank()) {
      String allowed = ssoTokenIdMap.searchValues(1, (entry) -> {
        // Check origin against provider domain url
        String domainOrigin = entry.getProvider().getURLOrigin();
        if (origin.equalsIgnoreCase(domainOrigin)) {
          return domainOrigin;
        }
        return null;
      });
      result = (allowed != null) ? true : false;
    }
    LOGGER.fine("isAllowedOrigin('" + origin + "') returning: " + result);
    return result;
  }

  /**
   * Create and add the ProviderEntry for the AdminServerDataProvider including the timeout...
   */
  private void addProviderEntry(String ssoid, AdminServerDataProvider provider) {
    ssoTokenIdMap.put(ssoid, new ProviderEntry(provider, getSSOTimeoutMillis()));
  }

  /**
   * Get the AdminServerDataProvider from the ProviderEntry or return null...
   */
  private AdminServerDataProvider getProviderFromEntry(String ssoid) {
    AdminServerDataProvider provider = null;
    ProviderEntry entry = ssoTokenIdMap.get(ssoid);
    if (entry != null) {
      provider = entry.getProvider();
    }
    return provider;
  }

  /**
   * Check on the state of the SSO timer task to ensure running or canceled...
   */
  private synchronized void checkSsoTimer() {
    if (ssoTokenIdMap.isEmpty() && (ssoTimer != null)) {
      ssoTimer.cancel();
      ssoTimer = null;
      LOGGER.fine("Canceled SSO timer!");
    } else if (!ssoTokenIdMap.isEmpty() && (ssoTimer == null)) {
      ssoTimer = new Timer("SsoTokenManager", true);
      ssoTimer.schedule(new SsoTokenTimer(), getSSOTimerMillis(), getSSOTimerMillis());
      LOGGER.fine("Started SSO timer with interval millis: " + getSSOTimerMillis());
    }
  }

  /**
   * Generate a nonce value and return as a Hex String...
   */
  private synchronized String getNonce() {
    if (nonceGenerator == null) {
      nonceGenerator = new SecureRandom();
      initializeNonceGenerator();
    }
    byte[] bytes = new byte[NONCE_SIZE];
    nonceGenerator.nextBytes(bytes);
    return new BigInteger(1, bytes).toString(16);
  }

  /**
   * Seed the nonce random byte generator...
   */
  private void initializeNonceGenerator() {
    nonceGenerator.setSeed(nonceGenerator.generateSeed(SEED_SIZE));
  }

  private class ProviderEntry {
    private long expireTime;
    private AdminServerDataProvider provider;

    ProviderEntry(AdminServerDataProvider adminServerDataProvider, long timeout) {
      provider = adminServerDataProvider;
      expireTime = System.currentTimeMillis() + timeout;
    }

    AdminServerDataProvider getProvider() {
      return provider;
    }

    long getExpireTime() {
      return expireTime;
    }
  }

  private class SsoTokenTimer extends TimerTask {
    public void run() {
      LOGGER.fine("SsoTokenTimer executing with SSO timeout millis: " + getSSOTimeoutMillis());
      Set<String> removes = new LinkedHashSet<>();
      long now = System.currentTimeMillis();
      ssoTokenIdMap.forEach((ssoid, entry) -> {
        // Check for expired entry
        if (now > entry.getExpireTime()) {
          removes.add(ssoid);
        }
      });
      if (!removes.isEmpty()) {
        LOGGER.fine("SsoTokenTimer removing expired entries: " + removes);
        removes.forEach(ssoid -> {
          // Remove expired entry
          ssoTokenIdMap.remove(ssoid);
        });
      }
      // Check on SSO timer state...
      checkSsoTimer();
    }
  }
}
