// Copyright (c) 2021, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
import java.util.logging.Logger;

/*
 * Global configuration comes from various sources, in increasing order of
 * precedence:
 *   - Default values right here in the code below
 *   - The "config file" which is an optional configuration file which could
 *     be in a resource or on the file system
 *   - System properties
 *
 * A quick note about System properties:  in the world where the CBE is running
 * in its own process, liberal use of System properties as a form of global
 * variables is acceptable.  However, we are now in a world where these
 * properties are in a shared space used by other applications and the
 * server itself and setting them is not acceptable.  Using these values if
 * set by the user is not only acceptable, but a requirement, but values that
 * come through other means must not be put in System properties.
 *
 * A good example of this is proxy configuration.  The Java libraries allow
 * the use of System properties to manipulate the use of proxies when operating
 * as a client.  The CBE also allows a "global" setting for proxies and in
 * previous implementations used the convenient Java library system properties
 * to implement these settings.  However, this is now inappropriate.
 *
 * This should not be confused with per-session configuration or per-provider
 * configuration.
 *
 * To keep the precedence clean, this will all be implmented as a set of
 * property lists.  There is:
 *   the default property list below,
 *   the one included in the config file,
 *   the one that comes from deployment (if it exists),
 *   the system properties
*/
public class ConsoleBackendRuntimeConfig {
  private static final Logger LOGGER = Logger.getLogger(ConsoleBackendRuntimeConfig.class.getName());
  public static final String CONFIG_FILE_PROPERTY = "weblogic.remote.console.config.file";
  public static final String CONFIG_RESOURCE_PROPERTY = "weblogic.remote.console.config.resource";
  private static final Map<String, String> defaultProperties = new HashMap<>();
  private static final Properties configFileProperties = new Properties();
  private static final Map<String, String> deploymentProperties = new HashMap<>();
  private static String name;
  private static long connectTimeoutMillis;
  private static long readTimeoutMillis;
  private static boolean disableHostnameVerification;
  private static boolean enableSameSiteCookieValue;
  private static String valueSameSiteCookie;
  private static long ssoTimerSeconds;
  private static long ssoTimeoutSeconds;
  private static String documentationSite;
  private static String ssoDomainLoginUri;
  private static String proxy;
  private static boolean restrictContentBasedOnRoles = true;

  static {
    // Put all of the keys in here even if null
    defaultProperties.put("name", "Oracle WebLogic Server Remote Console");
    defaultProperties.put("connectTimeoutMillis", "10000");
    defaultProperties.put("readTimeoutMillis", "20000");
    defaultProperties.put("disableHostnameVerification", "false");
    defaultProperties.put("enableSameSiteCookieValue", "false");
    defaultProperties.put("valueSameSiteCookie", "Lax");
    defaultProperties.put("ssoTimerSeconds", "30");
    defaultProperties.put("ssoTimeoutSeconds", "300");
    defaultProperties.put("ssoDomainLoginUri", null);
    defaultProperties.put("proxy", null);
    defaultProperties.put("restrictContentBasedOnRoles", "true");
  }

  private static void loadConfigFile() {
    configFileProperties.clear();
    InputStream is = null;
    String configFile = System.getProperty(CONFIG_RESOURCE_PROPERTY);
    if (configFile != null) {
      // FortifyIssueSuppression Path Manipulation
      // The config file location is determined from a secure source
      if (!new File(configFile).exists()) {
        return;
      }
      try {
        // FortifyIssueSuppression Path Manipulation
        // The config file location is determined from a secure source
        is = new FileInputStream(configFile);
      } catch (IOException ioe) {
        // FortifyIssueSuppression Log Forging
        // The config file location is determined from a secure source
        LOGGER.warning(
          "Exception reading user-specified remote console config file "
            + configFile + ": " + ioe);
        return;
      }
    } else {
      String configResource =
        System.getProperty(CONFIG_RESOURCE_PROPERTY, "weblogic-remote-console-config.properties");
      is =
        ConsoleBackendRuntimeConfig.class.getClassLoader().getResourceAsStream(configResource);
      if (is == null) {
        return;
      }
    }
    try {
      configFileProperties.load(is);
    } catch (IOException ioe) {
      LOGGER.warning("Exception reading remote console config " + ": " + ioe);
    }
    try {
      is.close();
    } catch (IOException ignore) {
      // Nothing to do here
      ;
    }
  }

  public static boolean isCBEProperty(String propertyName) {
    return defaultProperties.containsKey(propertyName);
  }

  private static String propGet(String key) {
    String ret = defaultProperties.get(key);
    if (configFileProperties.containsKey(key)) {
      ret = (String) configFileProperties.get(key);
    }
    if (deploymentProperties.containsKey(key)) {
      ret = deploymentProperties.get(key);
    }
    if (System.getProperty("console." + key) != null) {
      ret = System.getProperty("console." + key);
    }
    return ret;
  }

  public static void init(Map<String, String> deploymentPropertiesInit) {
    loadConfigFile();
    deploymentProperties.clear();
    if (deploymentPropertiesInit != null) {
      deploymentProperties.putAll(deploymentPropertiesInit);
    }
    name = propGet("name");
    connectTimeoutMillis = Integer.parseInt(propGet("connectTimeoutMillis"));
    readTimeoutMillis = Integer.parseInt(propGet("readTimeoutMillis"));
    disableHostnameVerification = Boolean.parseBoolean(propGet("disableHostnameVerification"));
    enableSameSiteCookieValue = Boolean.parseBoolean(propGet("enableSameSiteCookieValue"));
    valueSameSiteCookie = propGet("valueSameSiteCookie");
    ssoTimerSeconds = Integer.parseInt(propGet("ssoTimerSeconds"));
    ssoTimeoutSeconds = Integer.parseInt(propGet("ssoTimeoutSeconds"));
    documentationSite = propGet("documentationSite");
    ssoDomainLoginUri = propGet("ssoDomainLoginUri");
    proxy = propGet("proxy");
    restrictContentBasedOnRoles = Boolean.parseBoolean(propGet("restrictContentBasedOnRoles"));
  }

  public static String getName() {
    return name;
  }

  public static long getConnectTimeout() {
    return connectTimeoutMillis;
  }

  public static long getReadTimeout() {
    return readTimeoutMillis;
  }

  public static boolean isSameSiteCookieEnabled() {
    return enableSameSiteCookieValue;
  }

  public static String getSameSiteCookieValue() {
    return valueSameSiteCookie;
  }

  public static boolean isHostnameVerificationDisabled() {
    return disableHostnameVerification;
  }

  public static long getSsoTimerSeconds() {
    return ssoTimerSeconds;
  }

  public static long getSsoTimeoutSeconds() {
    return ssoTimeoutSeconds;
  }

  public static String getDocumentationSite() {
    return documentationSite;
  }

  public static String getSsoDomainLoginUri() {
    return ssoDomainLoginUri;
  }

  public static String getVersion() {
    return "2.4.17";
  }

  public static String getProxy() {
    return proxy;
  }

  public static boolean isRestrictContentBasedOnRoles() {
    return restrictContentBasedOnRoles;
  }
}
