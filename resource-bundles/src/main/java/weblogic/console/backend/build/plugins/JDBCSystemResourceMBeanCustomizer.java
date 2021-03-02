// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.build.plugins;

import java.util.Properties;
import java.util.logging.Logger;

import weblogic.console.backend.pagedesc.WeblogicPageSource;
import weblogic.console.backend.utils.StringUtils;
import weblogic.jdbc.utils.JDBCDriverAttribute;
import weblogic.jdbc.utils.JDBCDriverInfo;

import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.CREATE_FORM_PROPERTY_DATABASE_DRIVER;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.CREATE_FORM_PROPERTY_DBMS_HOST;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.CREATE_FORM_PROPERTY_DBMS_NAME;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.CREATE_FORM_PROPERTY_DBMS_PASSWORD;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.CREATE_FORM_PROPERTY_DBMS_PORT;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.CREATE_FORM_PROPERTY_DBMS_USER_NAME;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.CREATE_FORM_PROPERTY_GENERIC_DATABASE_TYPE;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.CREATE_FORM_PROPERTY_GRIDLINK_LISTENERS;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.CREATE_FORM_PROPERTY_MDS_XA_DRIVER;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.CREATE_FORM_PROPERTY_NON_XA_DRIVER_GLOBAL_TRANSACTIONS_PROTOTOL;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.CREATE_FORM_PROPERTY_SERVICE_NAME;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.CREATE_FORM_SECTION_CONNECTION_PROPERTIES;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.CREATE_FORM_SECTION_GRIDLINK_ONS;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.CREATE_FORM_SECTION_NON_XA_TRANSACTIONS;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.CREATE_FORM_SECTION_XA_TRANSACTIONS;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.DATASOURCE_TYPE_GENERIC;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.DATASOURCE_TYPE_GRIDLINK;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.DATASOURCE_TYPE_UCP;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.GLOBAL_TRANSACTIONS_PROTOCOL_EMULATE_TWO_PHASE_COMMIT;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.GLOBAL_TRANSACTIONS_PROTOCOL_LOGGING_LAST_RESOURCE;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.GLOBAL_TRANSACTIONS_PROTOCOL_NONE;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.GLOBAL_TRANSACTIONS_PROTOCOL_ONE_PHASE_COMMIT;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.driverScopedName;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.getDBMSVendorNames;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.getDriverInfos;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.getGridLinkDriverInfos;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.getUCPDriverInfos;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.isCustomDriverAttribute;

/** Custom code for adding JDBCSystemResourceMBean info to the english resource bundle during the build */
public class JDBCSystemResourceMBeanCustomizer extends BaseEnglishResourceDefinitionsCustomizer {

  private static final Logger LOGGER = Logger.getLogger(JDBCSystemResourceMBeanCustomizer.class.getName());

  public static void customizeCreateFormEnglishResourceDefinitions(
    Properties englishResourceDefinitions,
    WeblogicPageSource pageSource
  ) throws Exception {
    (new JDBCSystemResourceMBeanCustomizer(englishResourceDefinitions, pageSource)).customize();
  }

  private JDBCSystemResourceMBeanCustomizer(
    Properties englishResourceDefinitions,
    WeblogicPageSource pageSource
  ) {
    super(englishResourceDefinitions, pageSource);
  }

  private void customize() throws Exception {
    addSections();
    addProperties();
  }

  private void addSections() {
    addSection(
      CREATE_FORM_SECTION_GRIDLINK_ONS,
      "ONS Client Configuration",
      "Specify the ONS client configuration."
    );
    addSection(
      CREATE_FORM_SECTION_NON_XA_TRANSACTIONS,
      "Transactions",
      "You have selected a non-XA JDBC driver. Specify how transactions should be handled."
    );
    addSection(
      CREATE_FORM_SECTION_XA_TRANSACTIONS,
      "Transactions",
      "You have selected an XA JDBC driver to use to create database connection in your new data source."
      + " The data source will support global transactions and"
      + " use the 'Two-Phase Commit' global transaction protocol."
      + " No other transaction configuration options are available."
    );
    addSection(
      CREATE_FORM_SECTION_CONNECTION_PROPERTIES,
      "Connection Properties",
      "Specify the connection properties."
    );
  }

  private void addProperties() throws Exception {
    addProperty(
      CREATE_FORM_PROPERTY_DBMS_NAME,
      "Database Name",
      "The name of the database to connect to."
    );
    addProperty(
      CREATE_FORM_PROPERTY_DBMS_HOST,
      "Host Name",
      "The name or IP address of the database server."
    );
    addProperty(
      CREATE_FORM_PROPERTY_DBMS_PORT,
      "Port",
      "The port on the database server used to connect to the database."
    );
    addProperty(
      CREATE_FORM_PROPERTY_DBMS_USER_NAME,
      "Database User Name",
      "The database account user name to use to create database connections."
    );
    addProperty(
      CREATE_FORM_PROPERTY_DBMS_PASSWORD,
      "Password",
      "The database account password to use to create database connections."
    );
    addProperty(
      CREATE_FORM_PROPERTY_SERVICE_NAME,
      "Service Name",
      "The service name of the database to connect to."
    );
    addProperty(
      CREATE_FORM_PROPERTY_GENERIC_DATABASE_TYPE,
      "Database Type",
      "Select the database type"
    );
    addProperty(
      CREATE_FORM_PROPERTY_DATABASE_DRIVER,
      "Database Driver",
      "Select the database driver"
    );
    addProperty(
      CREATE_FORM_PROPERTY_NON_XA_DRIVER_GLOBAL_TRANSACTIONS_PROTOTOL,
      "Global Transactions Protocol",
      "Select the global transactions protocol.",
      " Select 'None' if you do not want to allow non-XA JDBC connections"
      + " from the data source to participate in global transactions."
      + "<p>Select 'Logging Last Resource' if you want to enable non-XA JDBC connections"
      + " from the data source to participate in global transactions using the"
      + " Logging Last Resource (LLR) transaction optimization."
      + " Recommended in place of Emulate Two-Phase Commit."
      + "<p>Select 'Emulate Two Phase Commit' if you want to enable non-XA JDBC connections"
      + " from the data source to participate in global transactions using JTA."
      + " Select this option only if your application can tolerate heuristic conditions."
      + "<p>Select 'One Phase Commit' if you want to enable non-XA JDBC connections"
      + " from the data source to participate in global transactions using"
      + " the one-phase commit transaction processing."
      + " With this option, no other resources can participate in the global transaction."
    );
    addLegalValue(
      CREATE_FORM_PROPERTY_NON_XA_DRIVER_GLOBAL_TRANSACTIONS_PROTOTOL,
      GLOBAL_TRANSACTIONS_PROTOCOL_LOGGING_LAST_RESOURCE,
      "Logging Last Resource"
    );
    addLegalValue(
      CREATE_FORM_PROPERTY_NON_XA_DRIVER_GLOBAL_TRANSACTIONS_PROTOTOL,
      GLOBAL_TRANSACTIONS_PROTOCOL_EMULATE_TWO_PHASE_COMMIT,
      "Emulate Two Phase Commit"
    );
    addLegalValue(
      CREATE_FORM_PROPERTY_NON_XA_DRIVER_GLOBAL_TRANSACTIONS_PROTOTOL,
      GLOBAL_TRANSACTIONS_PROTOCOL_ONE_PHASE_COMMIT,
      "One Phase Commit"
    );
    addLegalValue(
      CREATE_FORM_PROPERTY_NON_XA_DRIVER_GLOBAL_TRANSACTIONS_PROTOTOL,
      GLOBAL_TRANSACTIONS_PROTOCOL_NONE,
      "None"
    );
    addProperty(
      CREATE_FORM_PROPERTY_MDS_XA_DRIVER,
      "XA Driver",
      "Specify whether this is an XA or non-XA JDBC Multi Data Source."
    );
    addProperty(
      CREATE_FORM_PROPERTY_GRIDLINK_LISTENERS,
      "Listeners",
      "Specifiy the host and port of each listener (separated by colon).",
      " In the case of a RAC DB listener, specify the SCAN address."
    );
    addInlineFieldHelp(
      CREATE_FORM_PROPERTY_GRIDLINK_LISTENERS,
      "host:portNumber\nhost2:portNumber2"
    );
    // Need to repeat the JNDINames inline field help for the create form
    // and every slice because it is can only specified at the page level,
    // we can't inherit it from the type.
    addInlineFieldHelp(
      getPageSource()
        .getType()
        .getProperty("JDBCSystemResourceMBeanCustomizer.addProperties", "JNDINames")
        .getPropertyKey(),
      "e.g. jdbc/myDS"
    );
    addCustomDriverAttributeProperties();
  }

  private void addCustomDriverAttributeProperties() throws Exception {
    for (String vendorName : getDBMSVendorNames()) {
      addCustomDriverAttributeProperties(DATASOURCE_TYPE_GENERIC, getDriverInfos(vendorName));
    }
    addCustomDriverAttributeProperties(DATASOURCE_TYPE_GRIDLINK, getGridLinkDriverInfos());
    addCustomDriverAttributeProperties(DATASOURCE_TYPE_UCP, getUCPDriverInfos());
  }

  private void addCustomDriverAttributeProperties(String datasourceType, JDBCDriverInfo[] driverInfos) {
    for (JDBCDriverInfo driverInfo : driverInfos) {
      for (JDBCDriverAttribute driverAttribute : driverInfo.getDriverAttributes().values()) {
        addCustomDriverAttributeProperties(datasourceType, driverInfo, driverAttribute);
      }
    }
  }

  private void addCustomDriverAttributeProperties(
    String datasourceType,
    JDBCDriverInfo driverInfo,
    JDBCDriverAttribute driverAttribute
  ) {
    if (!isCustomDriverAttribute(driverAttribute)) {
      return;
    }
    String name = driverAttribute.getName();
    addProperty(
      driverScopedName(datasourceType, driverInfo, name),
      StringUtils.camelCaseToUpperCaseWords(name), // e.g. convert 'DataSource' to 'Data Source'
      "" // No help summary is available
    );
  }
}
