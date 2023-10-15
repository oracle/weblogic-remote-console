// Copyright (c) 2021, 2023, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server;


public class ConsoleBackendRuntimeConfig {
  private static final long DEFAULT_CONNECT_TIMEOUT_MILLIS = 10000L;
  private static final long DEFAULT_READ_TIMEOUT_MILLIS = 20000L;

  public static long getConnectionTimeout() {
    return
      ConsoleBackendRuntime.INSTANCE.getConfig()
        .get("connectTimeoutMillis")
        .asLong()
        .orElse(DEFAULT_CONNECT_TIMEOUT_MILLIS);
  }

  public static long getReadTimeout() {
    return
      ConsoleBackendRuntime.INSTANCE.getConfig()
        .get("readTimeoutMillis")
        .asLong()
        .orElse(DEFAULT_READ_TIMEOUT_MILLIS);
  }

  public static boolean isSameSiteCookieEnabled() {
    return
      ConsoleBackendRuntime.INSTANCE.getConfig()
        .get("enableSameSiteCookieValue")
        .asBoolean()
        .orElse(false);
  }

  public static String getSameSiteCookieValue() {
    return
      ConsoleBackendRuntime.INSTANCE.getConfig()
        .get("valueSameSiteCookie")
        .asString()
        .orElse(null);
  }

  public static boolean isHostnameVerificationDisabled() {
    return
      ConsoleBackendRuntime.INSTANCE.getConfig()
        .get("disableHostnameVerification")
        .asBoolean()
        .orElse(false);
  }
}
