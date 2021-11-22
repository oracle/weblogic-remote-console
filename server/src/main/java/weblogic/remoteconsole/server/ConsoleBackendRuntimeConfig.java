// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server;

import io.helidon.config.Config;

public class ConsoleBackendRuntimeConfig {
  private static Config config = ConsoleBackendRuntime.INSTANCE.getConfig();
  private static final long DEFAULT_CONNECT_TIMEOUT_MILLIS = 10000L;
  private static final long DEFAULT_READ_TIMEOUT_MILLIS = 20000L;

  public static long getConnectionTimeout() {
    return
      config
        .get("connectTimeoutMillis")
        .asLong()
        .orElse(DEFAULT_CONNECT_TIMEOUT_MILLIS);
  }

  public static long getReadTimeout() {
    return
      config
        .get("readTimeoutMillis")
        .asLong()
        .orElse(DEFAULT_READ_TIMEOUT_MILLIS);
  }

  public static boolean isSameSiteCookieEnabled() {
    return
      config
        .get("enableSameSiteCookieValue")
        .asBoolean()
        .orElse(false);
  }

  public static String getSameSiteCookieValue() {
    return
      config
        .get("valueSameSiteCookie")
        .asString()
        .orElse(null);
  }

  public static boolean isHostnameVerificationDisabled() {
    return
      config
        .get("disableHostnameVerification")
        .asBoolean()
        .orElse(false);
  }
}
