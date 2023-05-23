// Copyright (c) 2023, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.token;

import java.math.BigInteger;
import java.security.SecureRandom;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.logging.Logger;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ResourceContext;

import io.helidon.config.Config;
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

  private SecureRandom nonceGenerator = null;
  private volatile Map<String, AdminServerDataProvider> ssoTokenIdMap;

  /**
   * Set the Console Backend instance of the SsoTokenManager in the JAX-RS request context...
   */
  public static void setInRequestContext(ContainerRequestContext requestContext) {
    ConsoleBackendRuntime.INSTANCE.getSsoTokenManager().storeInRequestContext(requestContext);
  }

  /**
   * Obtain the SsoTokenManager reference from the JAX-RS request context...
   */
  public static SsoTokenManager getFromResourceContext(ResourceContext resourceContext) {
    ContainerRequestContext requestContext = resourceContext.getResource(ContainerRequestContext.class);
    return (SsoTokenManager) requestContext.getProperty(SsoTokenManager.class.getName());
  }

  /**
   * Create the SsoTokenManager instance but lazy initialize the nonce generator...
   */
  public SsoTokenManager(Config config) {
    // Config settings to handle timeouts for map entries plus defaults
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
    AdminServerDataProvider provider = ssoTokenIdMap.get(ssoid);
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
    ssoTokenIdMap.put(ssoid, provider);
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
    }
    return ssoid;
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
}
