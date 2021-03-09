// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver.plugins;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

import weblogic.console.backend.driver.FormSection;
import weblogic.console.backend.driver.LegalValue;
import weblogic.console.backend.driver.WeblogicPage;
import weblogic.console.backend.driver.WeblogicProperty;
import weblogic.console.backend.pagedesc.WeblogicPageSource;
import weblogic.jdbc.utils.JDBCDriverAttribute;
import weblogic.jdbc.utils.JDBCDriverInfo;

import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.CREATE_FORM_PROPERTY_DATABASE_DRIVER;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.CREATE_FORM_PROPERTY_DBMS_PASSWORD;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.CREATE_FORM_PROPERTY_GENERIC_DATABASE_TYPE;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.CREATE_FORM_PROPERTY_GRIDLINK_DATABASE_DRIVER;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.CREATE_FORM_PROPERTY_GRIDLINK_FAN_ENABLED;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.CREATE_FORM_PROPERTY_GRIDLINK_LISTENERS;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.CREATE_FORM_PROPERTY_GRIDLINK_ONS_NODE_LIST;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.CREATE_FORM_PROPERTY_GRIDLINK_ONS_WALLET_FILE;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.CREATE_FORM_PROPERTY_GRIDLINK_ONS_WALLET_PASSWORD;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.CREATE_FORM_PROPERTY_JNDI_NAMES;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.CREATE_FORM_PROPERTY_MDS_ALGORITHM_TYPE;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.CREATE_FORM_PROPERTY_MDS_NON_XA_DATASOURCE_LIST;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.CREATE_FORM_PROPERTY_MDS_XA_DATASOURCE_LIST;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.CREATE_FORM_PROPERTY_MDS_XA_DRIVER;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.CREATE_FORM_PROPERTY_NAME;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.CREATE_FORM_PROPERTY_NON_XA_DRIVER_GLOBAL_TRANSACTIONS_PROTOTOL;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.CREATE_FORM_PROPERTY_TARGETS;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.CREATE_FORM_PROPERTY_UCP_DATABASE_DRIVER;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.CREATE_FORM_SECTION_CONNECTION_PROPERTIES;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.CREATE_FORM_SECTION_GRIDLINK_ONS;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.CREATE_FORM_SECTION_NON_XA_TRANSACTIONS;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.CREATE_FORM_SECTION_XA_TRANSACTIONS;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.DATASOURCE_TYPE;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.DATASOURCE_TYPE_GENERIC;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.DATASOURCE_TYPE_GRIDLINK;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.DATASOURCE_TYPE_MDS;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.DATASOURCE_TYPE_UCP;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.GLOBAL_TRANSACTIONS_PROTOCOL_EMULATE_TWO_PHASE_COMMIT;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.GLOBAL_TRANSACTIONS_PROTOCOL_LOGGING_LAST_RESOURCE;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.GLOBAL_TRANSACTIONS_PROTOCOL_NONE;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.GLOBAL_TRANSACTIONS_PROTOCOL_ONE_PHASE_COMMIT;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.MDS_ALGORITHM_TYPE_FAILOVER;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.MDS_ALGORITHM_TYPE_LOAD_BALANCING;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.WELL_KNOWN_DRIVER_ATTRIBUTES;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.driverName;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.driverScopedName;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.genericDatabaseDriverProperty;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.getDBMSVendorNames;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.getDriverAttributes;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.getDriverInfos;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.getGridLinkDriverInfos;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.getUCPDriverInfos;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.isCustomDriverAttribute;

/**
  * Customizes the JDBCSystemResourceMBean's createForm's PDJ (i.e. wizard)
  */
/*package*/ class JDBCSystemResourceMBeanCreateFormPDJCustomizer extends BasePageDefinitionCustomizer {

  private static final Logger LOGGER = Logger.getLogger(JDBCSystemResourceMBeanCreateFormPDJCustomizer.class.getName());
  private static final String JDBC_SYSTEM_RESOURCE_MBEAN = "JDBCSystemResourceMBean";
  private static final String JDBC_DATA_SOURCE_PARAMS_BEAN = "JDBCDataSourceParamsBean";
  private static final String JDBC_DATA_SOURCE_PARAMS_BEAN_UNFOLDED_PATH = "JDBCResource.JDBCDataSourceParams";

  /*package*/ JDBCSystemResourceMBeanCreateFormPDJCustomizer(WeblogicPage page, WeblogicPageSource pageSource) {
    super(page, pageSource);
  }

  /**
    * Customize the JDBC system resource create form PDJ (wizard)
    */
  /*package*/ void customize() throws Exception {
    addMainSection();
    addGenericSection();
    addGridLinkSection();
    addUCPSection();
    addMDSSection();
  }

  // Add the top level datasource type section
  private void addMainSection() throws Exception {
    FormSection section = createSection();
    addNameProperty(section);
    addJNDINamesProperty(section);
    addTargetsProperty(section);
    addDatasourceTypeProperty(section);
  }

  // Add the name property to the main section
  private void addNameProperty(FormSection section) throws Exception {
    WeblogicProperty property =
      createMBeanProperty(
        section,
        CREATE_FORM_PROPERTY_NAME,
        JDBC_SYSTEM_RESOURCE_MBEAN,
        NOT_FOLDED_PATH,
        TYPE_STRING
      );
    property.setRestartNeeded(true);
  }

  // Add the JNDI names property to the main section
  private void addJNDINamesProperty(FormSection section) throws Exception {
    WeblogicProperty property =
      createMBeanProperty(
        section,
        CREATE_FORM_PROPERTY_JNDI_NAMES,
        JDBC_DATA_SOURCE_PARAMS_BEAN,
        JDBC_DATA_SOURCE_PARAMS_BEAN_UNFOLDED_PATH,
        TYPE_STRING
      );
    property.setArray(true);
    property.setRedeployNeeded(true);
    property.setRestartNeeded(true);
    addInlineFieldHelp(
      property,
      mbeanPropertyKey(
        CREATE_FORM_PROPERTY_JNDI_NAMES,
        JDBC_DATA_SOURCE_PARAMS_BEAN_UNFOLDED_PATH
      )
    );
  }

  // Add the targets property JNDI to the main section
  private void addTargetsProperty(FormSection section) throws Exception {
    WeblogicProperty property =
      createMBeanProperty(
        section,
        CREATE_FORM_PROPERTY_TARGETS,
        JDBC_SYSTEM_RESOURCE_MBEAN,
        NOT_FOLDED_PATH,
        TYPE_REFERENCE_DYNAMIC_ENUM
      );
    property.setArray(true);
    property.setRequired(false);
  }

  // Add the datasource type property to the main section
  private void addDatasourceTypeProperty(FormSection section) throws Exception {
    String propertyName = DATASOURCE_TYPE;
    String unfoldedPath = "JDBCResource";
    WeblogicProperty property =
      createMBeanProperty(
        section,
        propertyName,
        "JDBCDataSourceBean",
        unfoldedPath,
        TYPE_STRING
      );
    property.setLegalValues(
      createLegalValues(
        createMBeanPropertyLegalValue(propertyName, unfoldedPath, DATASOURCE_TYPE_GENERIC),
        createMBeanPropertyLegalValue(propertyName, unfoldedPath, DATASOURCE_TYPE_GRIDLINK),
        createMBeanPropertyLegalValue(propertyName, unfoldedPath, DATASOURCE_TYPE_UCP),
        createMBeanPropertyLegalValue(propertyName, unfoldedPath, DATASOURCE_TYPE_MDS)
      )
    );
  }

  // Add the top level generic datasource section
  private void addGenericSection() throws Exception {
    FormSection section = createSection();
    section.setUsedIf(createUsedIf(DATASOURCE_TYPE, DATASOURCE_TYPE_GENERIC));
    addGenericDatabaseTypeSection(section);
    // Add a section for each database vendor
    for (String vendorName : getDBMSVendorNames()) {
      addGenericVendorSection(section, vendorName);
    }
  }

  // Add the generic section for choosing the database type (vendor)
  private void addGenericDatabaseTypeSection(FormSection parent) throws Exception {
    FormSection section = createSection(parent);
    // Add a property to select the vendor
    String name = CREATE_FORM_PROPERTY_GENERIC_DATABASE_TYPE;
    WeblogicProperty property = createProperty(section, name, TYPE_STRING);
    List<LegalValue> legalValues = new ArrayList<>();
    for (String vendorName : getDBMSVendorNames()) {
      legalValues.add(createLegalValue(vendorName, unlocalizedTextKey(vendorName)));
    }
    property.setLegalValues(legalValues);
  }

  // Add the generic datasource section for a specific vendor
  private void addGenericVendorSection(FormSection parent, String vendorName) throws Exception {
    // Create a section for this vendor
    FormSection vendorSection = createSection(parent);
    vendorSection.setUsedIf(createUsedIf(CREATE_FORM_PROPERTY_GENERIC_DATABASE_TYPE, vendorName));

    // Get this vendor's driver infos
    JDBCDriverInfo[] driverInfos = getDriverInfos(vendorName);

    // Compute the name of the property that selects the driver for this vendor
    String driverPropertyName = genericDatabaseDriverProperty(vendorName);

    // Add a section for selecting this vendor's driver
    FormSection section = createSection(vendorSection);
    createSelectDriverProperty(section, DATASOURCE_TYPE_GENERIC, driverPropertyName, driverInfos);

    // Add transactions and connection properties sections for each of this vendor's drivers
    for (JDBCDriverInfo driverInfo : driverInfos) {
      addDriverTransactionsSection(vendorSection, DATASOURCE_TYPE_GENERIC, driverPropertyName, driverInfo);
      addDriverConnectionPropertiesSection(vendorSection, DATASOURCE_TYPE_GENERIC, driverPropertyName, driverInfo);
    }
  }

  // Add the top level grid link datasource section
  private void addGridLinkSection() throws Exception {
    FormSection section = createSection();
    section.setUsedIf(createUsedIf(DATASOURCE_TYPE, DATASOURCE_TYPE_GRIDLINK));
    addGridLinkDatabaseDriverSection(section);
    // Compute the name of the property that selects the GridLink driver
    String driverPropertyName = CREATE_FORM_PROPERTY_GRIDLINK_DATABASE_DRIVER;
    // Add transactions and connection properties sections for each of grid link driver
    for (JDBCDriverInfo driverInfo : getGridLinkDriverInfos()) {
      addDriverTransactionsSection(section, DATASOURCE_TYPE_GRIDLINK, driverPropertyName, driverInfo);
      addGridLinkConnectionPropertiesSection(section, DATASOURCE_TYPE_GRIDLINK, driverPropertyName, driverInfo);
    }
    addGridLinkONSSection(section);
  }

  // Add the section for selecting the grid link datasource's database driver
  private void addGridLinkDatabaseDriverSection(FormSection parent) throws Exception {
    FormSection section = createSection(parent);
    // Add a property for selecting the driver
    createSelectDriverProperty(
      section,
      DATASOURCE_TYPE_GRIDLINK,
      CREATE_FORM_PROPERTY_GRIDLINK_DATABASE_DRIVER,
      getGridLinkDriverInfos()
    );
  }

  private void addGridLinkConnectionPropertiesSection(
      FormSection parent,
      String datasourceType,
      String driverPropertyName,
      JDBCDriverInfo driverInfo
  ) throws Exception {
    FormSection section = createSection(parent, CREATE_FORM_SECTION_CONNECTION_PROPERTIES);
    section.setUsedIf(createUsedIf(driverPropertyName, driverName(driverInfo)));
    addGridLinkListenersSection(section);
    createDriverConnectionProperties(section, datasourceType, driverInfo);
  }

  // Add the grid link datasource section for configuring the listener host/port pairs
  private void addGridLinkListenersSection(FormSection section) throws Exception {
    WeblogicProperty property =
      createProperty(section, CREATE_FORM_PROPERTY_GRIDLINK_LISTENERS, TYPE_STRING);
    property.setArray(true);
    addInlineFieldHelp(property, CREATE_FORM_PROPERTY_GRIDLINK_LISTENERS);
  }

  // Add the grid link datasource section for configuring ONS
  private void addGridLinkONSSection(FormSection parent) throws Exception {
    FormSection section = createSection(parent, CREATE_FORM_SECTION_GRIDLINK_ONS);
    String mbeanTypeName = "JDBCOracleParamsBean";
    String unfoldedPath = "JDBCResource.JDBCOracleParams";
    {
      WeblogicProperty property =
        createMBeanProperty(
          section,
          "FanEnabled",
          mbeanTypeName,
          unfoldedPath,
          TYPE_BOOLEAN
        );
      property.setName(CREATE_FORM_PROPERTY_GRIDLINK_FAN_ENABLED);
      property.setRequired(false);
    }
    {
      WeblogicProperty property =
        createMBeanProperty(
          section,
          "OnsNodeList",
          mbeanTypeName,
          unfoldedPath,
          TYPE_STRING
        );
      property.setName(CREATE_FORM_PROPERTY_GRIDLINK_ONS_NODE_LIST);
      property.setRedeployNeeded(true);
      property.setRestartNeeded(true);
      property.setRequired(false);
    }
    {
      WeblogicProperty property =
        createMBeanProperty(
          section,
          "OnsWalletFile",
          mbeanTypeName,
          unfoldedPath,
          TYPE_STRING
        );
      property.setName(CREATE_FORM_PROPERTY_GRIDLINK_ONS_WALLET_FILE);
      property.setRedeployNeeded(true);
      property.setRestartNeeded(true);
      property.setRequired(false);
    }
    {
      WeblogicProperty property =
        createMBeanProperty(
          section,
          "OnsWalletPassword",
          mbeanTypeName,
          unfoldedPath,
          TYPE_SECRET
        );
      property.setName(CREATE_FORM_PROPERTY_GRIDLINK_ONS_WALLET_PASSWORD);
      property.setRedeployNeeded(true);
      property.setRestartNeeded(true);
      property.setRequired(false);
    }
  }

  // Add the top level UCP datasource section
  private void addUCPSection() throws Exception {
    FormSection section = createSection();
    section.setUsedIf(createUsedIf(DATASOURCE_TYPE, DATASOURCE_TYPE_UCP));
    addUCPDatabaseDriverSection(section);
    // Add a connection properties section for each of UCP driver
    // Note: don't add a transactions section since the old console doesn't (don't know why it didn't)
    for (JDBCDriverInfo driverInfo : getUCPDriverInfos()) {
      addDriverConnectionPropertiesSection(
        section,
        DATASOURCE_TYPE_UCP,
        CREATE_FORM_PROPERTY_UCP_DATABASE_DRIVER,
        driverInfo
      );
    }
  }

  // Add the section for selecting the UCP datasource's database driver
  private void addUCPDatabaseDriverSection(FormSection parent) throws Exception {
    FormSection section = createSection(parent);
    // Add a property for selecting the driver
    createSelectDriverProperty(
      section,
      DATASOURCE_TYPE_UCP,
      CREATE_FORM_PROPERTY_UCP_DATABASE_DRIVER,
      getUCPDriverInfos()
    );
  }

  // Add the top level MDS datasource section
  private void addMDSSection() throws Exception {
    FormSection section = createSection();
    section.setUsedIf(createUsedIf(DATASOURCE_TYPE, DATASOURCE_TYPE_MDS));
    addMDSMainSection(section);
    addMDSDatasourcesSection(section, true);
    addMDSDatasourcesSection(section, false);
  }

  // Add the MDS datasource main section
  private void addMDSMainSection(FormSection parent) throws Exception {
    FormSection section = createSection(parent);
    addMDSAlgorithmTypeProperty(section);
    createProperty(section, CREATE_FORM_PROPERTY_MDS_XA_DRIVER, TYPE_BOOLEAN);
  }

  // Add the MDS algorithm type property to the main MDS section
  private void addMDSAlgorithmTypeProperty(FormSection section) throws Exception {
    String unfoldedPath = JDBC_DATA_SOURCE_PARAMS_BEAN_UNFOLDED_PATH;
    String propertyName = "AlgorithmType";
    WeblogicProperty property =
      createMBeanProperty(
        section,
        propertyName,
        JDBC_DATA_SOURCE_PARAMS_BEAN,
        unfoldedPath,
        TYPE_STRING
      );
    property.setName(CREATE_FORM_PROPERTY_MDS_ALGORITHM_TYPE);
    property.setLegalValues(
      createLegalValues(
        createMBeanPropertyLegalValue(propertyName, unfoldedPath, MDS_ALGORITHM_TYPE_LOAD_BALANCING),
        createMBeanPropertyLegalValue(propertyName, unfoldedPath, MDS_ALGORITHM_TYPE_FAILOVER)
      )
    );
    property.setRedeployNeeded(true);
    property.setRestartNeeded(true);
  }

  // Add the MDS section for selecting its datasources
  private void addMDSDatasourcesSection(FormSection parentSection, boolean xa) throws Exception {
    FormSection section = createSection(parentSection);
    section.setUsedIf(createUsedIf(CREATE_FORM_PROPERTY_MDS_XA_DRIVER, xa));
    WeblogicProperty property =
      createMBeanProperty(
        section,
        "DataSourceList",
        JDBC_DATA_SOURCE_PARAMS_BEAN,
        JDBC_DATA_SOURCE_PARAMS_BEAN_UNFOLDED_PATH,
        TYPE_REFERENCE_DYNAMIC_ENUM
      );
    property.setArray(true);
    String propertyName =
      (xa) ? CREATE_FORM_PROPERTY_MDS_XA_DATASOURCE_LIST : CREATE_FORM_PROPERTY_MDS_NON_XA_DATASOURCE_LIST;
    property.setName(propertyName);
  }

  // Add a property for selecting the driver for a non-generic datasource type,
  // i.e. one that bakes in the database vendor as Oracle.
  private WeblogicProperty createSelectDriverProperty(
    FormSection section,
    String datasourceType,
    JDBCDriverInfo[] driverInfos
  ) {
    return createSelectDriverProperty(section, datasourceType, null, driverInfos);
  }

  private WeblogicProperty createSelectDriverProperty(
    FormSection section,
    String datasourceType,
    String driverPropertyName,
    JDBCDriverInfo[] driverInfos
  ) {
    WeblogicProperty property =
      createProperty(
        section,
        driverPropertyName,
        CREATE_FORM_PROPERTY_DATABASE_DRIVER,
        TYPE_STRING
      );
    List<LegalValue> legalValues = new ArrayList<>();
    for (JDBCDriverInfo driverInfo : driverInfos) {
      String driverName = driverName(driverInfo);
      legalValues.add(createLegalValue(driverName, unlocalizedTextKey(driverName)));
    }
    property.setLegalValues(legalValues);
    return property;
  }

  // Add the section for configuring how a driver should handle transactions
  private void addDriverTransactionsSection(
    FormSection parent,
    String datasourceType,
    String driverPropertyName,
    JDBCDriverInfo driverInfo
  ) throws Exception {
    boolean xa = driverInfo.isForXA();
    String sectionKey = (xa) ? CREATE_FORM_SECTION_XA_TRANSACTIONS : CREATE_FORM_SECTION_NON_XA_TRANSACTIONS;
    FormSection section = createSection(parent, sectionKey);
    section.setUsedIf(createUsedIf(driverPropertyName, driverName(driverInfo)));
    if (!xa) {
      addNonXADriverProperties(section, datasourceType, driverInfo);
    }
  }

  // Add the non-XA driver transaction properties to a section
  private void addNonXADriverProperties(
    FormSection section,
    String datasourceType,
    JDBCDriverInfo driverInfo
  ) throws Exception {
    // Add the global transactions protocol property.

    // Note: the old console presents it as a checkbox to
    // enable global transactions (i.e. if unchecked, then we want the None option)
    // and radio buttons for the protocol
    // (i.e. LoggingLastResource, EnableTwoPhaseCommit, OnePhaseCommit)
    // that are only enabled if enable global transactions is true.

    // For now, just present it as a multi-select with
    // None, EmulateTwoPhaseCommit, OnePhaseCommit and None options.

    String name = CREATE_FORM_PROPERTY_NON_XA_DRIVER_GLOBAL_TRANSACTIONS_PROTOTOL;
    WeblogicProperty property =
      createProperty(
        section,
        driverScopedName(datasourceType, driverInfo, name),
        name,
        TYPE_STRING
      );

    property.setLegalValues(
      createLegalValues(
        createNonXADriverGlobalTransactionsProtocolLegalValue(GLOBAL_TRANSACTIONS_PROTOCOL_LOGGING_LAST_RESOURCE),
        createNonXADriverGlobalTransactionsProtocolLegalValue(GLOBAL_TRANSACTIONS_PROTOCOL_EMULATE_TWO_PHASE_COMMIT),
        createNonXADriverGlobalTransactionsProtocolLegalValue(GLOBAL_TRANSACTIONS_PROTOCOL_ONE_PHASE_COMMIT),
        createNonXADriverGlobalTransactionsProtocolLegalValue(GLOBAL_TRANSACTIONS_PROTOCOL_NONE)
      )
    );
  }

  private LegalValue createNonXADriverGlobalTransactionsProtocolLegalValue(String value) {
    return
      createLegalValue(
        value,
        legalValueLabelKey(CREATE_FORM_PROPERTY_NON_XA_DRIVER_GLOBAL_TRANSACTIONS_PROTOTOL, value)
      );
  }

  // Add the section for configuring a driver's connection properties
  private void addDriverConnectionPropertiesSection(
    FormSection parent,
    String datasourceType,
    String driverPropertyName,
    JDBCDriverInfo driverInfo
  ) throws Exception {
    FormSection section = createSection(parent, CREATE_FORM_SECTION_CONNECTION_PROPERTIES);
    section.setUsedIf(createUsedIf(driverPropertyName, driverName(driverInfo)));
    createDriverConnectionProperties(section, datasourceType, driverInfo);
  }

  private void createDriverConnectionProperties(
    FormSection section,
    String datasourceType,
    JDBCDriverInfo driverInfo
  ) throws Exception {
    createWellKnownDriverConnectionProperties(section, datasourceType, driverInfo);
    createCustomDriverConnectionProperties(section, datasourceType, driverInfo);
  }

  // Add properties for all of the well known connection properties this driver supports (ordered).
  private void createWellKnownDriverConnectionProperties(
    FormSection section,
    String datasourceType,
    JDBCDriverInfo driverInfo
  ) throws Exception {
    for (String name : WELL_KNOWN_DRIVER_ATTRIBUTES) {
      JDBCDriverAttribute driverAttribute = getDriverAttributes(driverInfo).get(name);
      if (driverAttribute != null) {
        // This driver supports this well known attribute.  Add a property for it to the PDJ.
        createDriverConnectionProperty(section, datasourceType, driverInfo, driverAttribute);
      }
    }
  }

  // Add properties for all of the custom connection properties this driver supports (unordered).
  private void createCustomDriverConnectionProperties(
    FormSection section,
    String datasourceType,
    JDBCDriverInfo driverInfo
  ) throws Exception {
    for (JDBCDriverAttribute driverAttribute : getDriverAttributes(driverInfo).values()) {
      if (isCustomDriverAttribute(driverAttribute)) {
        // This is a custom attribute. Add a property for it to the PDJ.
        createDriverConnectionProperty(section, datasourceType, driverInfo, driverAttribute);
      }
    }
  }

  // Adds a property for a connection property for a driver.
  private void createDriverConnectionProperty(
    FormSection section,
    String datasourceType,
    JDBCDriverInfo driverInfo,
    JDBCDriverAttribute driverAttribute
  ) throws Exception {
    String name = driverAttribute.getName();
    String scopedName = driverScopedName(datasourceType, driverInfo, name);

    // If it's a well known property, then share the labels, etc.  Otherwise, don't.
    String propertyKey = isCustomDriverAttribute(driverAttribute) ? scopedName : name;

    // FortifyIssueSuppression Password Management: Password in Comment
    // Comment below does not reveal a secret
    // If this is the dbms password property, set the type to secret, otherwise string.
    String type = (CREATE_FORM_PROPERTY_DBMS_PASSWORD.equals(name)) ? TYPE_SECRET : TYPE_STRING;

    WeblogicProperty property = createProperty(section, scopedName, propertyKey, type);

    // The driver attribute determines whether this is a required property.
    property.setRequired(driverAttribute.isRequired());
  }
}
