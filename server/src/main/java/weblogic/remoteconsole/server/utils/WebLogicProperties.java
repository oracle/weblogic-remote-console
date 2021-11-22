// Copyright (c) 2020, 2021, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.utils;

/**
 * Capture the Environment and Java system properties used to connect to a WebLogic RESTful
 * Management endpoint.
 */
public class WebLogicProperties {
  public static final String WEBLOGIC_USERNAME_PROPERTY = "weblogic.username";
  // FortifyIssueSuppression Password Management: Password in Comment
  // FortifyIssueSuppression Password Management: Hardcoded Password
  // This is not an issue of a hardcoded value, but just a property name

  public static final String WEBLOGIC_PASSWORD_PROPERTY = "weblogic.password";
  public static final String WEBLOGIC_ADMIN_URL_PROPERTY = "weblogic.adminUrl";

  public static String getUsername() {
    String weblogicUsername = System.getenv("CBE_WLS_USERNAME");
    if (weblogicUsername == null) {
      weblogicUsername = System.getProperty(WEBLOGIC_USERNAME_PROPERTY);
    }
    return weblogicUsername;
  }

  public static String getPassword() {
    String weblogicPassword = System.getenv("CBE_WLS_PASSWORD");
    if (weblogicPassword == null) {
      weblogicPassword = System.getProperty(WEBLOGIC_PASSWORD_PROPERTY);
    }
    return weblogicPassword;
  }

  public static String getAdminUrl() {
    String weblogicAdminUrl = System.getenv("CBE_WLS_ADMIN_URL");
    if (weblogicAdminUrl == null) {
      weblogicAdminUrl = System.getProperty(WEBLOGIC_ADMIN_URL_PROPERTY);
    }
    return weblogicAdminUrl;
  }
}
