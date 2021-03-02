// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver.plugins;

import java.util.Properties;
import java.util.logging.Logger;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;

import weblogic.console.backend.driver.BadRequestException;
import weblogic.console.backend.driver.ExpandedValue;
import weblogic.console.backend.driver.IdentityUtils;
import weblogic.console.backend.driver.InvocationContext;
import weblogic.console.backend.driver.WeblogicConfiguration;
import weblogic.console.backend.pagedesc.LocalizationUtils;
import weblogic.console.backend.utils.Path;
import weblogic.console.backend.utils.StringUtils;
import weblogic.jdbc.common.internal.AddressList;
import weblogic.jdbc.utils.JDBCDriverAttribute;
import weblogic.jdbc.utils.JDBCDriverInfo;
import weblogic.jdbc.utils.JDBCURLHelper;

import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.CREATE_FORM_PROPERTY_DBMS_HOST;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.CREATE_FORM_PROPERTY_DBMS_NAME;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.CREATE_FORM_PROPERTY_DBMS_PASSWORD;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.CREATE_FORM_PROPERTY_DBMS_PORT;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.CREATE_FORM_PROPERTY_DBMS_USER_NAME;
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
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.DATASOURCE_TYPE;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.DATASOURCE_TYPE_GENERIC;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.DATASOURCE_TYPE_GRIDLINK;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.DATASOURCE_TYPE_MDS;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.DATASOURCE_TYPE_UCP;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.GLOBAL_TRANSACTIONS_PROTOCOL_ONE_PHASE_COMMIT;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.GLOBAL_TRANSACTIONS_PROTOCOL_TWO_PHASE_COMMIT;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.createDriverInfo;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.createJDBCURLHelper;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.driverScopedName;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.genericDatabaseDriverProperty;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.getDBMSVendorNames;
import static weblogic.console.backend.utils.LocalizedConstants.ERROR_MSG_INTEGER_REQUIRED_FOR_PORT;
import static weblogic.console.backend.utils.LocalizedConstants.ERROR_MSG_INVALID_HOSTPORT;

/**
 * Customize creating a JDBCSystemResourceMBean
 */
public class JDBCSystemResourceMBeanCreateCustomizer {

  private static final Logger LOGGER =
    Logger.getLogger(JDBCSystemResourceMBeanCreateCustomizer.class.getName());

  private InvocationContext invocationContext;

  // The invocation context for this request
  private InvocationContext getInvocationContext() {
    return this.invocationContext;
  }

  // The weblogic configuration (i.e. the object that reads from and writes to WLS)
  private WeblogicConfiguration weblogicConfiguration;

  private WeblogicConfiguration getWeblogicConfiguration() {
    return this.weblogicConfiguration;
  }

  // The request body containing the properties the client set
  // That is, in folded mbean terms and JDBC driver terms.
  private JsonObject requestBody;

  private JsonObject getRequestBody() {
    return this.requestBody;
  }

  // The messages to return to the client, in RDJ terms.
  private JsonArrayBuilder messagesBuilder = Json.createArrayBuilder();

  private JsonArrayBuilder getMessagesBuilder() {
    return this.messagesBuilder;
  }

  // Collects the properties to set on the new JDBCSystemResourceMBean
  private JsonObjectBuilder jdbcSystemResourceProperties = Json.createObjectBuilder();

  private JsonObjectBuilder getJDBCSystemResourceProperties() {
    return this.jdbcSystemResourceProperties;
  }

  // Collects the properties to set on the new JDBCSystemResourceMBeans' JDBCResource
  private JsonObjectBuilder jdbcResourceProperties = Json.createObjectBuilder();

  private JsonObjectBuilder getJDBCResourceProperties() {
    return this.jdbcResourceProperties;
  }

  // Collects the properties to set on the new JDBCSystemResourceMBean's JDBCResource's JDBCDriverParams
  private JsonObjectBuilder jdbcDriverParamsProperties = Json.createObjectBuilder();

  private JsonObjectBuilder getJDBCDriverParamsProperties() {
    return this.jdbcDriverParamsProperties;
  }

  // Collects the properties to set on the new JDBCSystemResourceMBean's JDBCResource's JDBCConnectionPool
  private JsonObjectBuilder jdbcConnectionPoolParamsProperties = Json.createObjectBuilder();

  private JsonObjectBuilder getJDBCConnectionPoolParamsProperties() {
    return this.jdbcConnectionPoolParamsProperties;
  }

  // Collects the properties to set on the new JDBCSystemResourceMBean's JDBCResource's JDBCXAParams
  private JsonObjectBuilder jdbcXAParamsProperties = Json.createObjectBuilder();

  private JsonObjectBuilder getJDBCXAParamsProperties() {
    return this.jdbcXAParamsProperties;
  }

  // Collects the properties to set on the new JDBCSystemResourceMBean's JDBCResource's JDBCOracleParams
  private JsonObjectBuilder jdbcOracleParamsProperties = Json.createObjectBuilder();

  private JsonObjectBuilder getJDBCOracleParamsProperties() {
    return this.jdbcOracleParamsProperties;
  }

  // Collects the properties to set on the new JDBCSystemResourceMBean's JDBCResource's JDBCDataSourceParams
  private JsonObjectBuilder jdbcDataSourceParamsProperties = Json.createObjectBuilder();

  private JsonObjectBuilder getJDBCDataSourceParamsProperties() {
    return this.jdbcDataSourceParamsProperties;
  }

  // Collects the JDBCSystemResourceMBean's JDBCResource's JDBCDriverParam's properties' properties
  private Properties jdbcDriverParamsPropertiesProperties = null;

  private Properties getJDBCDriverParamsPropertiesProperties() {
    return this.jdbcDriverParamsPropertiesProperties;
  }

  private void setJDBCDriverParamsPropertiesProperties(Properties jdbcDriverParamsPropertiesProperties) {
    this.jdbcDriverParamsPropertiesProperties = jdbcDriverParamsPropertiesProperties;
  }

  /*package*/ JDBCSystemResourceMBeanCreateCustomizer(
    InvocationContext invocationContext,
    WeblogicConfiguration weblogicConfiguration,
    JsonObject requestBody
  ) {
    this.invocationContext = invocationContext;
    this.weblogicConfiguration = weblogicConfiguration;
    this.requestBody = requestBody;
  }

  /**
   * Customize creating a JDBCSystemResouceMBean
   */
  /*package*/ JsonArray customize() throws Exception {
    // Compute all the WLS mbean properties to set
    computeWeblogicProperties();

    // Start an edit session.  Do it after computing the WLS mbean properties
    // so that we don't start one if there's a problem with the properties.
    getWeblogicConfiguration().startEdit(getInvocationContext());

    // Create the new JDBC system resource mbean
    createJDBCSystemResource();

    // Update each of the folded beans beneath the new JDBC system resource mbean
    updateFoldedBeans();

    // Save the changes
    getWeblogicConfiguration().saveChanges(getInvocationContext());

    // Return any messages (e.g. for property value problems)
    return getMessagesBuilder().build();
  }

  // Create the new JDBC system resource bean
  private void createJDBCSystemResource() throws Exception {
    createBean(
      getInvocationContext().getIdentity().getUnfoldedBeanPathWithIdentities(),
      getJDBCSystemResourceProperties().build()
    );
  }

  // Update the folded mbeans beneath the new JDBC system resource bean
  private void updateFoldedBeans() throws Exception {
    Path jdbcResourcePath =
      getInvocationContext()
        .getIdentity()
        .getUnfoldedBeanPathWithIdentities()
        .childPath(getRequiredStringProperty(CREATE_FORM_PROPERTY_NAME))
        .childPath("JDBCResource");
    setBeanProperties(
      jdbcResourcePath,
      getJDBCResourceProperties().build()
    );
    setBeanProperties(
      jdbcResourcePath.childPath("JDBCDriverParams"),
      getJDBCDriverParamsProperties().build()
    );
    setBeanProperties(
      jdbcResourcePath.childPath("JDBCConnectionPoolParams"),
      getJDBCDriverParamsProperties().build()
    );
    setBeanProperties(
      jdbcResourcePath.childPath("JDBCXAParams"),
      getJDBCXAParamsProperties().build()
    );
    setBeanProperties(
      jdbcResourcePath.childPath("JDBCOracleParams"),
      getJDBCOracleParamsProperties().build()
    );
    setBeanProperties(
      jdbcResourcePath.childPath("JDBCDataSourceParams"),
      getJDBCDataSourceParamsProperties().build()
    );
    createJDBCDriverParamsProperties(
      jdbcResourcePath.childPath("JDBCDriverParams").childPath("properties").childPath("properties")
    );
  }

  // Create the child property beans beneath the JDBCDriverParams bean
  private void createJDBCDriverParamsProperties(Path propertiesPath) throws Exception {
    Properties properties = getJDBCDriverParamsPropertiesProperties();
    if (properties == null) {
      return;
    }
    for (String name : properties.stringPropertyNames()) {
      createJDBCDriverParamsProperty(propertiesPath, name, properties.getProperty(name));
    }
  }

  // Create a child property bean beneath the JDBCDriverParams bean
  private void createJDBCDriverParamsProperty(Path propertiesPath, String name, String value) throws Exception {
    JsonObjectBuilder bldr = Json.createObjectBuilder();
    bldr.add("name", ExpandedValue.fromString(name).getJson());
    bldr.add("value", ExpandedValue.fromString(value).getJson());
    createBean(propertiesPath, bldr.build());
  }

  // Compute all of the weblogic properties we need to set on the new
  // JDBCDataSourceMBean and its automatically created singleton child mbeans
  private void computeWeblogicProperties() throws Exception {
    // add the name and datasource type properties
    copyRequiredProperty(getJDBCSystemResourceProperties(), CREATE_FORM_PROPERTY_NAME);
    copyRequiredProperty(getJDBCResourceProperties(), DATASOURCE_TYPE);

    // add the JNDINames property
    copyRequiredProperty(getJDBCDataSourceParamsProperties(), CREATE_FORM_PROPERTY_JNDI_NAMES);

    // add the targets property
    addTargetsProperty();
  
    // add the mbean properties needed by the datasource type 
    addDatasourceTypeSpecificProperties();
  }

  // Add the targets property, converting from RDJ identities to Weblogic identities
  private void addTargetsProperty() throws Exception {
    JsonObject targets = getOptionalProperty(CREATE_FORM_PROPERTY_TARGETS);
    if (targets == null) {
      return;
    }
    getJDBCSystemResourceProperties().add(
      StringUtils.getRestName(CREATE_FORM_PROPERTY_TARGETS),
      IdentityUtils.rdjIdentitiesToWeblogicIdentities(
        getInvocationContext().getIdentity().getBeanType().getTypes(),
        targets
      )
    );
  }

  // Add the mbean properties needed by the datasource type the client specified
  private void addDatasourceTypeSpecificProperties() throws Exception {
    String datasourceType = getRequiredStringProperty(DATASOURCE_TYPE);
    switch (datasourceType) {
      case DATASOURCE_TYPE_GENERIC:
        addGenericProperties();
        break;
      case DATASOURCE_TYPE_GRIDLINK:
        addGridLinkProperties();
        break;
      case DATASOURCE_TYPE_UCP:
        addUCPProperties();
        break;
      case DATASOURCE_TYPE_MDS:
        addMDSProperties();
        break;
      default:
        throw badRequest("Illegal " + DATASOURCE_TYPE + " : " + datasourceType);
    }
  }

  // Add the weblogic mbean properties needed to create a generic data source
  private void addGenericProperties() throws Exception {
    JDBCDriverInfo driverInfo = getDriverInfo(genericDatabaseDriverProperty(getVendorName()));
    addTransactionProperties(DATASOURCE_TYPE_GENERIC, driverInfo);
    addConnectionProperties(DATASOURCE_TYPE_GENERIC, driverInfo);
  }

  // Add the XA weblogic bean properties needed for a database driver
  private void addTransactionProperties(String datasourceType, JDBCDriverInfo driverInfo) throws Exception {
    String globalTransactionsProtocol = null;
    
    if (driverInfo.isForXA()) {
      // Since this is an XA driver, force the protocol to 2 phase commit
      globalTransactionsProtocol = GLOBAL_TRANSACTIONS_PROTOCOL_TWO_PHASE_COMMIT;
    } else {
      // Since this isn't an XA driver, use the protocol that the client configured
      // (i.e. none, one phase commit or emulate 2 phase commit)
      globalTransactionsProtocol =
        getRequiredStringProperty(
          driverScopedName(
            datasourceType,
            driverInfo,
            CREATE_FORM_PROPERTY_NON_XA_DRIVER_GLOBAL_TRANSACTIONS_PROTOTOL
          )
        ); 
    }
    if (!GLOBAL_TRANSACTIONS_PROTOCOL_ONE_PHASE_COMMIT.equals(globalTransactionsProtocol)) {
      // We're not using the default protocol.  Write it out.
      getJDBCDataSourceParamsProperties().add(
        "globalTransactionsProtocol",
        ExpandedValue.fromString(globalTransactionsProtocol).getJson()
      );
    } else {
      // We're using the default protocol.  Don't write it out.
    }
  }

  // Add the connection related weblogic mbean properties for a database driver
  private void addConnectionProperties(String datasourceType, JDBCDriverInfo driverInfo) throws Exception {
    // copy the connection related driver properties the client specified into the database driver
    populateDriverInfo(datasourceType, driverInfo);
    // convert the populated database driver into the corresponding weblogic bean properties
    convertDriverInfoToMBeanProperties(datasourceType, driverInfo);
  }

  // Convert the populated database driver into the corresponding weblogic bean properties
  private void convertDriverInfoToMBeanProperties(String datasourceType, JDBCDriverInfo driverInfo) throws Exception {
    // copy the driver class name to the weblogic bean properties
    getJDBCDriverParamsProperties().add(
      "driverName",
      ExpandedValue.fromString(driverInfo.getDriverClassName()).getJson()
    );

    // Create a JDBCURLHelper, which maps from driver properties to weblogic properties
    JDBCURLHelper helper = createJDBCURLHelper(driverInfo);
    if (datasourceType != DATASOURCE_TYPE_UCP) {
      // Add the weblogic property for the database url
      getJDBCDriverParamsProperties().add(
        "url",
        ExpandedValue.fromString(helper.getURL()).getJson()
      );
    } else {
      // UCP data sources don't support connection urls
    }

    // FortifyIssueSuppression Password Management: Password in Comment
    // Comment below does not reveal a secret
    // Add the weblogic property for the database password (if specified)
    String password = driverInfo.getPassword();
    if (!StringUtils.isEmpty(password)) {
      getJDBCDriverParamsProperties().add(
        "password",
        ExpandedValue.fromString(password).getJson()
      );
    }

    // Since each property gets converted to a child per-property mbean that can't be created
    // until we've created the new datasource, record them now so we can create them at the end.
    setJDBCDriverParamsPropertiesProperties(helper.getProperties());
  }

  // Copy the connection related driver properties the client specified into the database driver
  private void populateDriverInfo(String datasourceType, JDBCDriverInfo driverInfo) throws Exception {
    // createDriverInfo returned a new unpopulated JDBCDriverInfo instance.
    // Fill in its properties so we can use it later to convert them to their corresponding mbean properties
    driverInfo.setFillRequired(false); // TBD - allow default values?
    collectWellKnownConnectionProperties(datasourceType, driverInfo);
    collectCustomConnectionProperties(datasourceType, driverInfo);
  }

  // Copy the well known connection related driver properties the client specified into the database driver
  private void collectWellKnownConnectionProperties(String datasourceType, JDBCDriverInfo driverInfo) throws Exception {
    if (supportsWellKnownConnectionProperty(driverInfo, CREATE_FORM_PROPERTY_DBMS_NAME)) {
      driverInfo.setDbmsName(
        getRequiredStringProperty(
          driverScopedName(datasourceType, driverInfo, CREATE_FORM_PROPERTY_DBMS_NAME)
        )
      );
    }
    if (supportsWellKnownConnectionProperty(driverInfo, CREATE_FORM_PROPERTY_DBMS_HOST)) {
      driverInfo.setDbmsHost(
        getRequiredStringProperty(
          driverScopedName(datasourceType, driverInfo, CREATE_FORM_PROPERTY_DBMS_HOST)
        )
      );
    }
    if (supportsWellKnownConnectionProperty(driverInfo, CREATE_FORM_PROPERTY_DBMS_PORT)) {
      String dbmsPort = getRequiredStringProperty(
          driverScopedName(datasourceType, driverInfo, CREATE_FORM_PROPERTY_DBMS_PORT)
      );
      if (StringUtils.isInteger(dbmsPort)) {
        driverInfo.setDbmsPort(dbmsPort);
      } else {
        String localizedError =
          invocationContext
          .getLocalizer()
          .localizeString(
            LocalizationUtils.constantLabelKey(ERROR_MSG_INTEGER_REQUIRED_FOR_PORT)
          );
        throw new BadRequestException(localizedError + " [" + dbmsPort + "]");
      }
    }
    if (supportsWellKnownConnectionProperty(driverInfo, CREATE_FORM_PROPERTY_DBMS_USER_NAME)) {
      driverInfo.setUserName(
        getRequiredStringProperty(
          driverScopedName(datasourceType, driverInfo, CREATE_FORM_PROPERTY_DBMS_USER_NAME)
        )
      );
    }
    if (supportsWellKnownConnectionProperty(driverInfo, CREATE_FORM_PROPERTY_DBMS_PASSWORD)) {
      driverInfo.setPassword(
        getRequiredStringProperty(
          driverScopedName(datasourceType, driverInfo, CREATE_FORM_PROPERTY_DBMS_PASSWORD)
        )
      );
    }
    // NOTE: ServiceName is handled by collectCustomConnectionProperties
  }

  private boolean supportsWellKnownConnectionProperty(JDBCDriverInfo driverInfo, String property) throws Exception {
    if (!driverInfo.getDriverAttributes().containsKey(property)) {
      // this driver doesn't support this well known property
      LOGGER.finest("Unsupported well known property " + driverInfo + " " + property);
      return false;
    } else {
      return true;
    }
  }
  
  // Copy the custom driver-specific connection related driver properties the client specified into the database driver
  private void collectCustomConnectionProperties(String datasourceType, JDBCDriverInfo driverInfo) throws Exception {
    for (JDBCDriverAttribute driverAttribute : driverInfo.getUnknownDriverAttributes().values()) {
      String property = getAttributePropertyName(datasourceType, driverInfo, driverAttribute);
      if (driverAttribute.isRequired() || haveProperty(property)) {
        driverInfo.setUknownAttribute(
          driverAttribute.getName(),
          getDriverAttributeValue(datasourceType, driverInfo, driverAttribute)
        );
      } else {
        // The attribute isn't required and the client didn't specify it.
        // TBD - do we need to set it to its default value?  Probably not ...
      }
    }
  }

  // Get the value of a connection related driver property that the client specified
  private String getDriverAttributeValue(
    String datasourceType,
    JDBCDriverInfo driverInfo,
    JDBCDriverAttribute driverAttribute
  ) throws Exception {
    return getRequiredStringProperty(getAttributePropertyName(datasourceType, driverInfo, driverAttribute));
  }

  // Get the name of the property in the request body for this attribute
  private String getAttributePropertyName(
    String datasourceType,
    JDBCDriverInfo driverInfo,
    JDBCDriverAttribute driverAttribute
  ) throws Exception {
    return driverScopedName(datasourceType, driverInfo, driverAttribute.getName());
  }

  // Create a new JDBCDriverInfo given the name of the property the client specified
  // that holds the name of the type of driver
  private JDBCDriverInfo getDriverInfo(String driverProperty) throws Exception {
    String driverName = getRequiredStringProperty(driverProperty);
    JDBCDriverInfo driverInfo = createDriverInfo(driverName);
    if (driverInfo == null) {
      throw badRequest("Illegal " + driverProperty + " : " + driverName);
    }
    return driverInfo;
  }

  // Get the name of the database vendor from the properties the client specified
  // and verify that it exists
  private String getVendorName() throws Exception {
    String vn =
      getRequiredStringProperty(CREATE_FORM_PROPERTY_GENERIC_DATABASE_TYPE);
    for (String vendorName : getDBMSVendorNames()) {
      if (vendorName.equals(vn)) {
        return vn;
      }
    }
    throw badRequest("Illegal " + CREATE_FORM_PROPERTY_GENERIC_DATABASE_TYPE + " : " + vn);
  }

  // Add the weblogic mbean properties needed to create a grid link data source
  private void addGridLinkProperties() throws Exception {
    JDBCDriverInfo driverInfo = getDriverInfo(CREATE_FORM_PROPERTY_GRIDLINK_DATABASE_DRIVER);
    addGridLinkListenersToDriverInfo(driverInfo);
    addTransactionProperties(DATASOURCE_TYPE_GRIDLINK, driverInfo);
    addConnectionProperties(DATASOURCE_TYPE_GRIDLINK, driverInfo);
    addGridLinkONSProperties();
  }

  private void addGridLinkListenersToDriverInfo(JDBCDriverInfo driverInfo) throws Exception {
    JsonArray listeners =
      ExpandedValue.getValue(getRequiredProperty(CREATE_FORM_PROPERTY_GRIDLINK_LISTENERS)).asJsonArray();
    StringBuffer result = new StringBuffer("");
    for (int i = 0; i < listeners.size(); i++) {
      String tmp = (listeners.getJsonString(i)).getString();
      String[] hp = tmp.split(":");
      //it should never be null since this is a required field. CFE will enforce it.
      if ((hp == null || hp.length != 2) || (!StringUtils.isInteger(hp[1]))) {
        String localizedError =
          invocationContext
          .getLocalizer()
          .localizeString(
              LocalizationUtils.constantLabelKey(ERROR_MSG_INVALID_HOSTPORT)
          );
        throw new BadRequestException(localizedError + " [" + tmp + "]");
      }
      result.append(",").append(tmp);
    }
    AddressList addressList = driverInfo.getHostPorts();
    addressList.setList(result.substring(1));
  }

  private void addGridLinkONSProperties() throws Exception {
    {
      JsonObject property = getOptionalProperty(CREATE_FORM_PROPERTY_GRIDLINK_FAN_ENABLED);
      if (property != null) {
        getJDBCOracleParamsProperties().add("fanEnabled", property);
      }
    }
    {
      JsonObject property = getOptionalProperty(CREATE_FORM_PROPERTY_GRIDLINK_ONS_NODE_LIST);
      if (property != null) {
        getJDBCOracleParamsProperties().add("onsNodeList", property);
      }
    }
    {
      JsonObject property = getOptionalProperty(CREATE_FORM_PROPERTY_GRIDLINK_ONS_WALLET_FILE);
      if (property != null) {
        getJDBCOracleParamsProperties().add("onsWalletFile", property);
      }
    }
    {
      JsonObject property = getOptionalProperty(CREATE_FORM_PROPERTY_GRIDLINK_ONS_WALLET_PASSWORD);
      if (property != null) {
        getJDBCOracleParamsProperties().add("onsWalletPassword", property);
      }
    }
  }

  // Add the weblogic mbean properties needed to create a UCP data source
  private void addUCPProperties() throws Exception {
    JDBCDriverInfo driverInfo = getDriverInfo(CREATE_FORM_PROPERTY_UCP_DATABASE_DRIVER);
    addConnectionProperties(DATASOURCE_TYPE_UCP, driverInfo);
  }

  // Add the weblogic mbean properties needed to create an MDS data source
  private void addMDSProperties() throws Exception {
    // Copy over the algorithm type
    {
      JsonObject property = getOptionalProperty(CREATE_FORM_PROPERTY_MDS_ALGORITHM_TYPE);
      if (property != null) {
        getJDBCDataSourceParamsProperties().add("algorithmType", property);
      }
    }
    // Copy over the datasources this datasource delegates to
    {
      String propertyName =
        getRequiredBooleanProperty(CREATE_FORM_PROPERTY_MDS_XA_DRIVER)
          ?
            CREATE_FORM_PROPERTY_MDS_XA_DATASOURCE_LIST
          :
            CREATE_FORM_PROPERTY_MDS_NON_XA_DATASOURCE_LIST;

      // TBD - should have utilities to convert between the data source list in the RDJ,
      // which is an array of identities, and the data source list in the WLS mbeans,
      // which is a string containing a comma separated list of data source names.
      // i.e. this is a case where a string property really contains a list of references.
      JsonArray rdjIdentities =
        ExpandedValue.getReferencesValue(getRequiredProperty(propertyName));
      StringBuilder sb = new StringBuilder();
      for (int i = 0; i < rdjIdentities.size(); i++) {
        // The data source's name is that key of the last segment in the RDJ identity's path
        JsonObject rdjIdentity = rdjIdentities.getJsonObject(i);
        JsonArray path = rdjIdentity.getJsonArray("path");
        JsonObject lastSegment = path.getJsonObject(path.size() - 1);
        String datasourceName = lastSegment.getString("key");
        if (i > 0) {
          sb.append(",");
        }
        sb.append(datasourceName);
      }
      JsonObject dataSourceList = ExpandedValue.fromString(sb.toString()).set(true).getJson();
      getJDBCDataSourceParamsProperties().add("dataSourceList", dataSourceList);
    }
  }

  // Utility methods that aren't specific to this customizer that we
  // might want to make generally available:

  // Create a new weblogic mbean and set some properties on it.
  // Record any messages that WLS returned.
  private void createBean(Path parentBean, JsonObject properties) throws Exception {
    recordMessages(
      getWeblogicConfiguration().createBean(
        getInvocationContext(),
        parentBean,
        properties
      )
    );
  }

  // Set some properties on an mbean and record any messages that WLS returned
  private void setBeanProperties(Path bean, JsonObject properties) throws Exception {
    if (!requestBody.isEmpty()) {
      recordMessages(
        getWeblogicConfiguration().setBeanProperties(getInvocationContext(), bean, properties)
      );
    }
  }

  // Record a list of messages that WLS returned
  private void recordMessages(JsonArray weblogicMessages) {
    for (int i = 0; weblogicMessages != null && i < weblogicMessages.size(); i++) {
      recordMessage(weblogicMessages.getJsonObject(i));
    }
  }

  // Record a message that WLS returned
  private void recordMessage(JsonObject weblogicMessage) {
    String propertyRDJName = null;
    String propertyWeblogicName = weblogicMessage.getString("field");
    if (propertyWeblogicName != null) {
      // TBD - convert propertyWeblogicName to propertyRDJName
      propertyRDJName = propertyWeblogicName;
    }
    if (propertyRDJName == null) {
      // This is a global message.  Record it as is.
      messagesBuilder.add(weblogicMessage);
    } else {
      // This is a property-scoped message.  Change the weblogic property rest
      // name to its corresponding RDJ property name then record it.
      getMessagesBuilder().add(
        Json.createObjectBuilder()
          .add("property", propertyRDJName)
          .add("severity", weblogicMessage.getString("severity"))
          .add("message", weblogicMessage.getString("message"))
      );
    }
  }

  // Copy a required property that the client specified into the set of properties to
  // set on a weblogic mbean
  private void copyRequiredProperty(JsonObjectBuilder weblogicProperties, String property) throws Exception {
    copyRequiredProperty(weblogicProperties, property, StringUtils.getRestName(property));
  }

  private void copyRequiredProperty(
    JsonObjectBuilder weblogicProperties,
    String rdjProperty,
    String weblogicProperty
  ) throws Exception {
    weblogicProperties.add(weblogicProperty, getRequiredProperty(rdjProperty));
  }

  // Get a required string property that the client should have specified.
  // It should be in expanded values format.
  private String getRequiredStringProperty(String property) throws Exception {
    return ExpandedValue.getStringValue(getRequiredProperty(property));
  }

  // Get a required boolean property that the client should have specified.
  // It should be in expanded values format.
  private boolean getRequiredBooleanProperty(String property) throws Exception {
    return ExpandedValue.getBooleanValue(getRequiredProperty(property));
  }

  // Get a required property that the client should have specified.
  // It should be in expanded values format.
  private JsonObject getRequiredProperty(String property) throws Exception {
    if (!haveProperty(property)) {
      throw badRequest(property + " not specified.");
    }
    return getOptionalProperty(property);
  }

  private JsonObject getOptionalProperty(String property) throws Exception {
    return getRequestBody().getJsonObject(property);
  }

  private boolean haveProperty(String property) throws Exception {
    return getRequestBody().containsKey(property);
  }

  // Throw a bad request exception (which will turn into a 400 HTTP response)
  private BadRequestException badRequest(String message) {
    return new BadRequestException(message);
  }
}
