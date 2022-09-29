// Copyright (c) 2020, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import weblogic.jdbc.utils.JDBCDriverAttribute;
import weblogic.jdbc.utils.JDBCDriverInfo;
import weblogic.remoteconsole.common.repodef.PagePath;
import weblogic.remoteconsole.common.repodef.schema.BeanPropertyDefCustomizerSource;
import weblogic.remoteconsole.common.repodef.schema.FormSectionDefSource;
import weblogic.remoteconsole.common.repodef.schema.LegalValueDefCustomizerSource;
import weblogic.remoteconsole.common.repodef.schema.PageDefSource;
import weblogic.remoteconsole.common.repodef.weblogic.WebLogicRestEditPageRepoDef;
import weblogic.remoteconsole.common.utils.StringUtils;

import static weblogic.remoteconsole.customizers.JDBCSystemResourceMBeanCustomizerUtils.DATASOURCE_TYPE_GENERIC;
import static weblogic.remoteconsole.customizers.JDBCSystemResourceMBeanCustomizerUtils.DATASOURCE_TYPE_GRIDLINK;
import static weblogic.remoteconsole.customizers.JDBCSystemResourceMBeanCustomizerUtils.DATASOURCE_TYPE_UCP;
import static weblogic.remoteconsole.customizers.JDBCSystemResourceMBeanCustomizerUtils.DEFAULT_TEST_CONFIGURATION;
import static weblogic.remoteconsole.customizers.JDBCSystemResourceMBeanCustomizerUtils.PROPERTY_DATASOURCE_TYPE;
import static weblogic.remoteconsole.customizers.JDBCSystemResourceMBeanCustomizerUtils.PROPERTY_DBMS_HOST;
import static weblogic.remoteconsole.customizers.JDBCSystemResourceMBeanCustomizerUtils.PROPERTY_DBMS_NAME;
import static weblogic.remoteconsole.customizers.JDBCSystemResourceMBeanCustomizerUtils.PROPERTY_DBMS_PASSWORD;
import static weblogic.remoteconsole.customizers.JDBCSystemResourceMBeanCustomizerUtils.PROPERTY_DBMS_PORT;
import static weblogic.remoteconsole.customizers.JDBCSystemResourceMBeanCustomizerUtils.PROPERTY_DBMS_USER_NAME;
import static weblogic.remoteconsole.customizers.JDBCSystemResourceMBeanCustomizerUtils.PROPERTY_GENERIC_DATABASE_TYPE;
import static weblogic.remoteconsole.customizers.JDBCSystemResourceMBeanCustomizerUtils.PROPERTY_GLOBAL_TRANSACTIONS_PROTOTOL;
import static weblogic.remoteconsole.customizers.JDBCSystemResourceMBeanCustomizerUtils.PROPERTY_GRIDLINK_DATABASE_DRIVER;
import static weblogic.remoteconsole.customizers.JDBCSystemResourceMBeanCustomizerUtils.PROPERTY_GRIDLINK_FAN_ENABLED;
import static weblogic.remoteconsole.customizers.JDBCSystemResourceMBeanCustomizerUtils.PROPERTY_GRIDLINK_LISTENERS;
import static weblogic.remoteconsole.customizers.JDBCSystemResourceMBeanCustomizerUtils.PROPERTY_GRIDLINK_ONS_NODE_LIST;
import static weblogic.remoteconsole.customizers.JDBCSystemResourceMBeanCustomizerUtils.PROPERTY_GRIDLINK_ONS_WALLET_FILE;
import static weblogic.remoteconsole.customizers.JDBCSystemResourceMBeanCustomizerUtils.PROPERTY_GRIDLINK_ONS_WALLET_PASSWORD;
import static weblogic.remoteconsole.customizers.JDBCSystemResourceMBeanCustomizerUtils.PROPERTY_TEST_CONFIGURATION;
import static weblogic.remoteconsole.customizers.JDBCSystemResourceMBeanCustomizerUtils.PROPERTY_UCP_DATABASE_DRIVER;
import static weblogic.remoteconsole.customizers.JDBCSystemResourceMBeanCustomizerUtils.PROPERTY_URL;
import static weblogic.remoteconsole.customizers.JDBCSystemResourceMBeanCustomizerUtils.driverName;
import static weblogic.remoteconsole.customizers.JDBCSystemResourceMBeanCustomizerUtils.driverNameToFormPropertyName;
import static weblogic.remoteconsole.customizers.JDBCSystemResourceMBeanCustomizerUtils.driverScopedName;
import static weblogic.remoteconsole.customizers.JDBCSystemResourceMBeanCustomizerUtils.genericDatabaseDriverProperty;
import static weblogic.remoteconsole.customizers.JDBCSystemResourceMBeanCustomizerUtils.getDBMSVendorNames;
import static weblogic.remoteconsole.customizers.JDBCSystemResourceMBeanCustomizerUtils.getDriverAttributes;
import static weblogic.remoteconsole.customizers.JDBCSystemResourceMBeanCustomizerUtils.getDriverInfoFactory;

/**
  * Customizes the JDBCSystemResourceMBean's createForm's PDY (i.e. wizard)
  */
class JDBCSystemResourceMBeanCreateFormSourceCustomizer extends BasePageDefSourceCustomizer {

  private static final String PROPERTY_SERVICE_NAME = "ServiceName";

  // Well known driver attributes that we have special PDJ handling for:
  private static final Set<String> WELL_KNOWN_DRIVER_ATTRIBUTES = new HashSet<>();

  static {
    // in the order we want them on the page:
    WELL_KNOWN_DRIVER_ATTRIBUTES.add(PROPERTY_DBMS_NAME);
    WELL_KNOWN_DRIVER_ATTRIBUTES.add(PROPERTY_DBMS_HOST);
    WELL_KNOWN_DRIVER_ATTRIBUTES.add(PROPERTY_DBMS_PORT);
    WELL_KNOWN_DRIVER_ATTRIBUTES.add(PROPERTY_DBMS_USER_NAME);
    WELL_KNOWN_DRIVER_ATTRIBUTES.add(PROPERTY_DBMS_PASSWORD);
    WELL_KNOWN_DRIVER_ATTRIBUTES.add(PROPERTY_SERVICE_NAME);
  }

  JDBCSystemResourceMBeanCreateFormSourceCustomizer(PagePath pagePath, PageDefSource pageDefSource) {
    super(pagePath, pageDefSource);
  }

  // Customize the JDBC system resource create form's PDY
  void customize() {
    // create-form.yaml already added the main and MDS sections
    addGenericSection();
    addGridLinkSection();
    addUCPSection();
  }

  // Add the top level generic datasource section
  private void addGenericSection() {
    FormSectionDefSource section = addSectionToForm();
    section.setUsedIf(createUsedIf(PROPERTY_DATASOURCE_TYPE, DATASOURCE_TYPE_GENERIC));
    addGenericDatabaseTypeSection(section);
    // Add a section for each database vendor
    for (String vendorName : getDBMSVendorNames()) {
      addGenericVendorSection(section, vendorName);
    }
  }

  // Add the generic section for choosing the database type (vendor)
  private void addGenericDatabaseTypeSection(FormSectionDefSource parent) {
    FormSectionDefSource section = addSectionToSection(parent);
    // Add a property to select the vendor
    BeanPropertyDefCustomizerSource property =
      addNonMBeanStringPropertyToSection(
        section,
        PROPERTY_GENERIC_DATABASE_TYPE,
        "Database Type",
        "Select the database type"
      );
    setDefaultValue(property, "Oracle");
    for (String vendorName : getDBMSVendorNames()) {
      addLegalValue(property, vendorName);
    }
  }

  // Add the generic datasource section for a specific vendor
  private void addGenericVendorSection(FormSectionDefSource parent, String vendorName) {
    // Create a section for this vendor
    FormSectionDefSource vendorSection = addSectionToSection(parent);
    vendorSection.setUsedIf(createUsedIf(PROPERTY_GENERIC_DATABASE_TYPE, vendorName));

    // Get this vendor's driver infos
    JDBCDriverInfo[] driverInfos = getDriverInfos(vendorName);

    // Compute the name of the property that selects the driver for this vendor
    String driverPropertyName = driverNameToFormPropertyName(genericDatabaseDriverProperty(vendorName));

    // Add a section for selecting this vendor's driver
    FormSectionDefSource section = addSectionToSection(vendorSection);
    createSelectDriverProperty(
      section,
      driverPropertyName,
      driverInfos
    );

    // Add transactions and connection properties sections for each of this vendor's drivers
    for (JDBCDriverInfo driverInfo : driverInfos) {
      addDriverTransactionsSection(vendorSection, DATASOURCE_TYPE_GENERIC, driverPropertyName, driverInfo);
      addDriverConnectionPropertiesSection(vendorSection, DATASOURCE_TYPE_GENERIC, driverPropertyName, driverInfo);
      addTestConfigurationSection(vendorSection, DATASOURCE_TYPE_GENERIC, driverPropertyName, driverInfo);
    }
  }

  // Add the top level grid link datasource section
  private void addGridLinkSection() {
    FormSectionDefSource section = addSectionToForm();
    section.setUsedIf(createUsedIf(PROPERTY_DATASOURCE_TYPE, DATASOURCE_TYPE_GRIDLINK));
    addGridLinkDatabaseDriverSection(section);
    // Compute the name of the property that selects the GridLink driver
    String driverPropertyName = PROPERTY_GRIDLINK_DATABASE_DRIVER;
    // Add transactions and connection properties sections for each of grid link driver
    for (JDBCDriverInfo driverInfo : getGridLinkDriverInfos()) {
      addDriverTransactionsSection(section, DATASOURCE_TYPE_GRIDLINK, driverPropertyName, driverInfo);
      addGridLinkConnectionPropertiesSection(section, DATASOURCE_TYPE_GRIDLINK, driverPropertyName, driverInfo);
      addGridLinkONSSection(section, driverPropertyName, driverInfo);
      addTestConfigurationSection(section, DATASOURCE_TYPE_GRIDLINK, PROPERTY_GRIDLINK_DATABASE_DRIVER, driverInfo);
    }
  }

  // Add the section for selecting the grid link datasource's database driver
  private void addGridLinkDatabaseDriverSection(FormSectionDefSource parent) {
    FormSectionDefSource section = addSectionToSection(parent);
    // Add a property for selecting the driver
    BeanPropertyDefCustomizerSource property =
      createSelectDriverProperty(
        section,
        PROPERTY_GRIDLINK_DATABASE_DRIVER,
        getGridLinkDriverInfos()
      );
    // Instead of picking the first driver as the default, use this one (to match the WebLogic console):
    setDefaultValue(property, "*Oracle's Driver (Thin) for GridLink Connections; Versions:Any");
  }

  private void addGridLinkConnectionPropertiesSection(
      FormSectionDefSource parent,
      String datasourceType,
      String driverPropertyName,
      JDBCDriverInfo driverInfo
  ) {
    FormSectionDefSource section =
      createEmptyDriverConnectionPropertiesSection(parent, driverPropertyName, driverInfo);
    BeanPropertyDefCustomizerSource property =
      addNonMBeanStringPropertyToSection(
        section,
        driverNameToFormPropertyName(
          driverScopedName(DATASOURCE_TYPE_GRIDLINK, driverInfo, PROPERTY_GRIDLINK_LISTENERS)
        ),
        "Listeners",
        "Specify the host and port of each listener (separated by colon)."
        + " In the case of a RAC DB listener, specify the SCAN address."
      );
    setDefaultValue(property, null);
    property.getDefinition().setArray(true);
    // Even though the listeners get converted to an mbean property,
    // we can't support model tokens for them because the underlying
    // JDBC utilities we use require a certain format.
    setInlineFieldHelp(property, "host:portNumber\nhost2:portNumber2");
    createDriverConnectionProperties(section, datasourceType, driverInfo);
  }

  // Add the grid link datasource section for configuring ONS
  private void addGridLinkONSSection(
    FormSectionDefSource parent,
    String driverPropertyName,
    JDBCDriverInfo driverInfo
  ) {
    FormSectionDefSource section = addSectionToSection(parent);
    section.setTitle("ONS Client Configuration");
    section.setIntroductionHTML("Specify the ONS client configuration.");
    section.setUsedIf(createUsedIf(driverPropertyName, driverName(driverInfo)));
    addMBeanPropertyToSection(section, PROPERTY_GRIDLINK_FAN_ENABLED).setFormName(
      driverNameToFormPropertyName(
        driverScopedName(DATASOURCE_TYPE_GRIDLINK, driverInfo, "FanEnabled")
      )
    );
    addMBeanPropertyToSection(section, PROPERTY_GRIDLINK_ONS_NODE_LIST).setFormName(
      driverNameToFormPropertyName(
        driverScopedName(DATASOURCE_TYPE_GRIDLINK, driverInfo, "OnsNodeList")
      )
    );
    addMBeanPropertyToSection(section, PROPERTY_GRIDLINK_ONS_WALLET_FILE).setFormName(
      driverNameToFormPropertyName(
        driverScopedName(DATASOURCE_TYPE_GRIDLINK, driverInfo, "OnsWalletFile")
      )
    );
    addMBeanPropertyToSection(section, PROPERTY_GRIDLINK_ONS_WALLET_PASSWORD).setFormName(
      driverNameToFormPropertyName(
        driverScopedName(DATASOURCE_TYPE_GRIDLINK, driverInfo, "OnsWalletPassword")
      )
    );
  }

  // Add the top level UCP datasource section
  private void addUCPSection() {
    FormSectionDefSource section = addSectionToForm();
    section.setUsedIf(createUsedIf(PROPERTY_DATASOURCE_TYPE, DATASOURCE_TYPE_UCP));
    addUCPDatabaseDriverSection(section);
    // Add a connection properties section for each of UCP driver
    // Note: don't add a transactions section since the old console doesn't (don't know why it didn't)
    for (JDBCDriverInfo driverInfo : getUCPDriverInfos()) {
      addUCPUrlSection(section, driverInfo);
      addDriverConnectionPropertiesSection(
        section,
        DATASOURCE_TYPE_UCP,
        PROPERTY_UCP_DATABASE_DRIVER,
        driverInfo
      );
      addTestConfigurationSection(section, DATASOURCE_TYPE_UCP, PROPERTY_UCP_DATABASE_DRIVER, driverInfo);
    }
  }

  // Add the section for selecting the UCP datasource's database driver
  private void addUCPDatabaseDriverSection(FormSectionDefSource parent) {
    FormSectionDefSource section = addSectionToSection(parent);
    // Add a property for selecting the driver
    createSelectDriverProperty(
      section,
      PROPERTY_UCP_DATABASE_DRIVER,
      getUCPDriverInfos()
    );
  }

  // Add the section for selecting the UCP datasource's url
  private void addUCPUrlSection(FormSectionDefSource parent, JDBCDriverInfo driverInfo) {
    FormSectionDefSource section = addSectionToSection(parent);
    section.setUsedIf(createUsedIf(PROPERTY_UCP_DATABASE_DRIVER, driverName(driverInfo)));
    // Unlike the other kinds of data sources which compute the database url from
    // the connection properties, the user manually configures the database url
    // for UCP data sources.
    addMBeanPropertyToSection(section, PROPERTY_URL).setFormName(
      driverNameToFormPropertyName(
        driverScopedName(DATASOURCE_TYPE_UCP, driverInfo, "Url")
      )
    );
  }

  private BeanPropertyDefCustomizerSource createSelectDriverProperty(
    FormSectionDefSource section,
    String driverPropertyName,
    JDBCDriverInfo[] driverInfos
  ) {
    BeanPropertyDefCustomizerSource property =
      addNonMBeanStringPropertyToSection(
        section,
        driverPropertyName,
        "Database Driver",
        "Select the database driver"
      );
    setDefaultValue(property, driverName(driverInfos[0]));
    for (JDBCDriverInfo driverInfo : driverInfos) {
      addLegalValue(property, driverName(driverInfo));
    }
    return property;
  }

  // Add the section for configuring how a driver should handle transactions
  private void addDriverTransactionsSection(
    FormSectionDefSource parent,
    String datasourceType,
    String driverPropertyName,
    JDBCDriverInfo driverInfo
  ) {
    FormSectionDefSource section = addSectionToSection(parent);
    section.setTitle("Transactions");
    section.setUsedIf(createUsedIf(driverPropertyName, driverName(driverInfo)));
    if (driverInfo.isForXA()) {
      section.setName("JDBCSystemResourceMBean.Transactions.XA");
      section.setIntroductionHTML(
        "You have selected an XA JDBC driver to use to create a database connection"
        + " in your new data source."
        + " The data source will support global transactions and"
        + " use the 'Two-Phase Commit' global transaction protocol."
        + " No other transaction configuration options are available."
      );
    } else {
      section.setName("JDBCSystemResourceMBean.Transactions.nonXA");
      section.setIntroductionHTML(
        "You have selected a non-XA JDBC driver. Specify how transactions should be handled."
      );
      BeanPropertyDefCustomizerSource property =
        addMBeanPropertyToSection(section, PROPERTY_GLOBAL_TRANSACTIONS_PROTOTOL);
      property.setFormName(
        driverNameToFormPropertyName(
          driverScopedName(datasourceType, driverInfo, "GlobalTransactionsProtocol")
         )
      );
      // Remove the TwoPhaseCommit option since we only let the user configure the global
      // transactions protocol for non-XA drivers and only XA drivers support TwoPhaseCommit.
      LegalValueDefCustomizerSource twoPhase = new LegalValueDefCustomizerSource();
      twoPhase.setOmit(true);
      twoPhase.setValue("TwoPhaseCommit");
      //twoPhase.setLabel(twoPhase.getValue());
      property.setLegalValues(List.of(twoPhase));
    }
  }

  // Add the section for configuring a driver's connection properties
  private void addDriverConnectionPropertiesSection(
    FormSectionDefSource parent,
    String datasourceType,
    String driverPropertyName,
    JDBCDriverInfo driverInfo
  ) {
    FormSectionDefSource section =
      createEmptyDriverConnectionPropertiesSection(parent, driverPropertyName, driverInfo);
    createDriverConnectionProperties(section, datasourceType, driverInfo);
  }

  private FormSectionDefSource createEmptyDriverConnectionPropertiesSection(
    FormSectionDefSource parent,
    String driverPropertyName,
    JDBCDriverInfo driverInfo
  ) {
    FormSectionDefSource section = addSectionToSection(parent);
    section.setTitle("Connection Properties");
    section.setIntroductionHTML("Specify the connection properties.");
    section.setUsedIf(createUsedIf(driverPropertyName, driverName(driverInfo)));
    return section;
  }

  private void createDriverConnectionProperties(
    FormSectionDefSource section,
    String datasourceType,
    JDBCDriverInfo driverInfo
  ) {
    createWellKnownDriverConnectionProperties(section, datasourceType, driverInfo);
    createCustomDriverConnectionProperties(section, datasourceType, driverInfo);
  }

  // Add a section with a boolean 'TestConfiguration' property
  // if the repo supports testing the datasource configuration
  // before creating the datasource.
  private void addTestConfigurationSection(
    FormSectionDefSource parent,
    String datasourceType,
    String driverPropertyName,
    JDBCDriverInfo driverInfo
  ) {
    if (!(getPagePath().getPagesPath().getPageRepoDef() instanceof WebLogicRestEditPageRepoDef)) {
      // Only the edit tree on an admin server connection can test the configuration
      // since we need to invoke a legacy REST operation to do it.
      return;
    }
    // Add a section that usedIf's the driver
    FormSectionDefSource section = addSectionToSection(parent);
    section.setUsedIf(createUsedIf(driverPropertyName, driverName(driverInfo)));
    // Add the TestConfiguration property to it.
    BeanPropertyDefCustomizerSource property =
      addNonMBeanBooleanPropertyToSection(
        section,
        driverNameToFormPropertyName(
          driverScopedName(datasourceType, driverInfo, PROPERTY_TEST_CONFIGURATION)
        ),
        "Test Configuration",
        "<p>Determines whether the configuration will be tested before the datasource is created.</p>"
        + "<p>If enabled, the creation of the datasource will only be attempted if the test passes."
        + " Note: the test will be performed on the WebLogic Administration Server"
        + " (instead of the servers to which the datasource is targeted).</p>"
      );
    setDefaultValue(property, DEFAULT_TEST_CONFIGURATION);
    property.setRequired(false);
  }

  // Add properties for all of the well known connection properties this driver supports (ordered).
  private void createWellKnownDriverConnectionProperties(
    FormSectionDefSource section,
    String datasourceType,
    JDBCDriverInfo driverInfo
  ) {
    for (String name : WELL_KNOWN_DRIVER_ATTRIBUTES) {
      JDBCDriverAttribute driverAttribute = getDriverAttributes(driverInfo).get(name);
      if (driverAttribute != null) {
        // This driver supports this well known attribute.  Add a property for it to the PDY.
        createDriverConnectionProperty(section, datasourceType, driverInfo, driverAttribute);
      }
    }
  }

  // Add properties for all of the custom connection properties this driver supports (unordered).
  private void createCustomDriverConnectionProperties(
    FormSectionDefSource section,
    String datasourceType,
    JDBCDriverInfo driverInfo
  ) {
    for (JDBCDriverAttribute driverAttribute : getDriverAttributes(driverInfo).values()) {
      if (isCustomDriverAttribute(driverAttribute)) {
        // This is a custom attribute. Add a property for it to the PDY.
        createDriverConnectionProperty(section, datasourceType, driverInfo, driverAttribute);
      }
    }
  }

  // Adds a property for a connection property for a driver.
  private void createDriverConnectionProperty(
    FormSectionDefSource section,
    String datasourceType,
    JDBCDriverInfo driverInfo,
    JDBCDriverAttribute driverAttribute
  ) {
    String name = driverAttribute.getName();
    BeanPropertyDefCustomizerSource property =
      addNonMBeanStringPropertyToSection(
        section,
        driverNameToFormPropertyName(
          driverScopedName(datasourceType, driverInfo, name)
        ),
        getDriverConnectionPropertyLabel(name),
        getDriverConnectionPropertyDescriptionHTML(name)
      );
    setDefaultValue(property, driverAttribute.getDefaultValue());
    // FortifyIssueSuppression Password Management: Password in Comment
    // Comment below does not reveal a secret
    // If this is the dbms password property, then set it to encrypted to that it maps to a secret
    if (PROPERTY_DBMS_PASSWORD.equals(name)) {
      property.getDefinition().setEncrypted(true);
    }
    // The driver attribute determines whether this is a required property.
    property.setRequired(driverAttribute.isRequired());
    // Normally non-mbean properties can't be set to model tokens.
    // Allow it here since this value gets transformed into an mbean property eventually.
    property.setSupportsModelTokens(true);
  }

  private String getDriverConnectionPropertyLabel(String attributeName) {
    if (PROPERTY_DBMS_NAME.equals(attributeName)) {
      return "Database Name";
    }
    if (PROPERTY_DBMS_HOST.equals(attributeName)) {
      return "Host Name";
    }
    if (PROPERTY_DBMS_PORT.equals(attributeName)) {
      return "Port";
    }
    if (PROPERTY_DBMS_USER_NAME.equals(attributeName)) {
      return "Database User Name";
    }
    if (PROPERTY_DBMS_PASSWORD.equals(attributeName)) {
      return "Password";
    }
    if (PROPERTY_SERVICE_NAME.equals(attributeName)) {
      return "Service Name";
    }
    // e.g. convert 'DataSource' to 'Data Source':
    return StringUtils.camelCaseToUpperCaseWords(attributeName);
  }

  private String getDriverConnectionPropertyDescriptionHTML(String attributeName) {
    if (PROPERTY_DBMS_NAME.equals(attributeName)) {
      return "The name of the database to connect to.";
    }
    if (PROPERTY_DBMS_HOST.equals(attributeName)) {
      return "The name or IP address of the database server.";
    }
    if (PROPERTY_DBMS_PORT.equals(attributeName)) {
      return "The port on the database server used to connect to the database.";
    }
    if (PROPERTY_DBMS_USER_NAME.equals(attributeName)) {
      return "The database account user name to use to create database connections.";
    }
    if (PROPERTY_DBMS_PASSWORD.equals(attributeName)) {
      return "The database account password to use to create database connections.";
    }
    if (PROPERTY_SERVICE_NAME.equals(attributeName)) {
      return "The service name of the database to connect to.";
    }
    return null; // Custom properties don't get descriptions.
  }

  // Return all the available database drivers for a generic database vendor
  private JDBCDriverInfo[] getDriverInfos(String vendorName) {
    return getDriverInfoFactory().getDriverInfos(vendorName);
  }

  // Return all the available grid link database drivers
  private JDBCDriverInfo[] getGridLinkDriverInfos() {
    return getDriverInfoFactory().getGridLinkDriverInfos();
  }

  // Return all the available UCP database drivers
  private JDBCDriverInfo[] getUCPDriverInfos() {
    return getDriverInfoFactory().getUCPDriverInfos();
  }

  // Returns whether a driver attribute is a custom attribute (v.s. a well known attribute)
  private boolean isCustomDriverAttribute(JDBCDriverAttribute driverAttribute) {
    return !WELL_KNOWN_DRIVER_ATTRIBUTES.contains(driverAttribute.getName());
  }
}
