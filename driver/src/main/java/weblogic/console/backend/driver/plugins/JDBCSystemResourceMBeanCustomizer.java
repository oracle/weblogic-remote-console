// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver.plugins;

import java.util.logging.Logger;
import javax.json.JsonArray;
import javax.json.JsonObject;

import weblogic.console.backend.driver.InvocationContext;
import weblogic.console.backend.driver.WeblogicConfiguration;
import weblogic.console.backend.driver.WeblogicPage;
import weblogic.console.backend.pagedesc.WeblogicPageSource;

/** Custom code for processing the JDBCSystemResourceMBean */
public class JDBCSystemResourceMBeanCustomizer {

  private static final Logger LOGGER = Logger.getLogger(JDBCSystemResourceMBeanCustomizer.class.getName());

  /**
   * Customize the JDBCSystemResourceMBean's createForm's PDJ (i.e. wizard)
   */
  public static void customizeCreateFormPageDefinition(
    WeblogicPage page,
    WeblogicPageSource pageSource
  ) throws Exception {
    JDBCSystemResourceMBeanCreateFormPDJCustomizer customizer =
      new JDBCSystemResourceMBeanCreateFormPDJCustomizer(page, pageSource);
    customizer.customize();
  }

  /**
   * Customize the JDBCSystemResourceMBean's createForm's RDJ's initial property values (i.e. wizard)
   */
  public static JsonObject customizeCreateFormProperties(
    WeblogicPageSource pageSource,
    InvocationContext invocationContext,
    WeblogicConfiguration weblogicConfiguration
  ) throws Exception {
    JDBCSystemResourceMBeanCreateFormPropertiesCustomizer customizer =
      new JDBCSystemResourceMBeanCreateFormPropertiesCustomizer(
        pageSource,
        invocationContext,
        weblogicConfiguration
      );
    return customizer.customize();
  }

  /**
   * Custom code to create a JDBCSystemResouceMBean
   */
  public static JsonArray customizeCreate(
    InvocationContext invocationContext,
    WeblogicConfiguration weblogicConfiguration,
    JsonObject requestBody
  ) throws Exception {
    JDBCSystemResourceMBeanCreateCustomizer customizer =
      new JDBCSystemResourceMBeanCreateCustomizer(
        invocationContext,
        weblogicConfiguration,
        requestBody
      );
    return customizer.customize();
  }
}
