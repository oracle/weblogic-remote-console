// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver.plugins;

import java.util.logging.Logger;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;

import weblogic.console.backend.driver.ExpandedValue;
import weblogic.console.backend.driver.IdentityUtils;
import weblogic.console.backend.driver.InvocationContext;
import weblogic.console.backend.driver.WeblogicConfiguration;
import weblogic.console.backend.driver.WeblogicObjectQueryBuilder;
import weblogic.console.backend.pagedesc.WeblogicPageSource;
import weblogic.jdbc.utils.JDBCDriverAttribute;
import weblogic.jdbc.utils.JDBCDriverInfo;

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
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.DATASOURCE_TYPE_UCP;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.GLOBAL_TRANSACTIONS_PROTOCOL_ONE_PHASE_COMMIT;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.GLOBAL_TRANSACTIONS_PROTOCOL_TWO_PHASE_COMMIT;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.MDS_ALGORITHM_TYPE_FAILOVER;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.driverName;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.driverScopedName;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.genericDatabaseDriverProperty;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.getDBMSVendorNames;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.getDriverAttributes;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.getDriverInfos;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.getGridLinkDriverInfos;
import static weblogic.console.backend.utils.JDBCSystemResourceMBeanCustomizerUtils.getUCPDriverInfos;

/**
 * Customize the initial property values in the JDBCSystemResourceMBean create form RDJ
 */
public class JDBCSystemResourceMBeanCreateFormPropertiesCustomizer extends BaseCreateFormPropertiesCustomizer {

  private static final String WEBLOGIC_PROPERTY_SERVERS = "servers";
  private static final String WEBLOGIC_PROPERTY_CLUSTERS = "clusters";
  private static final String WEBLOGIC_PROPERTY_JDBC_SYSTEM_RESOURCES = "JDBCSystemResources";

  private static final Logger LOGGER =
    Logger.getLogger(JDBCSystemResourceMBeanCreateFormPropertiesCustomizer.class.getName());

  /*package*/ JDBCSystemResourceMBeanCreateFormPropertiesCustomizer(
    WeblogicPageSource pageSource,
    InvocationContext invocationContext,
    WeblogicConfiguration weblogicConfiguration
  ) {
    super(pageSource, invocationContext, weblogicConfiguration);
  }

  // Create the WLS REST query for finding all of the WLS references
  // we need to compute the reference properties' options
  @Override
  protected JsonObject createGetReferencesQuery() {
    // Start at the domain
    WeblogicObjectQueryBuilder domainBldr = new WeblogicObjectQueryBuilder();

    // Get all the servers and clusters identities
    // so we can compute the Targets property's options
    domainBldr.getOrCreateChild(WEBLOGIC_PROPERTY_SERVERS).addField("identity");
    domainBldr.getOrCreateChild(WEBLOGIC_PROPERTY_CLUSTERS).addField("identity");

    // Get all the JDBCSystemResources so we can compute the MDS DatasourceList property's options.
    // For each one, also its datasource list and global transactions protocol so that when we compute
    // the available datasources, we can weed out the MDS ones and can separate the XA and non-XA ones.
    domainBldr.getOrCreateChild(WEBLOGIC_PROPERTY_JDBC_SYSTEM_RESOURCES)
      .addField("identity")
      .getOrCreateChild("JDBCResource")
      .getOrCreateChild("JDBCDataSourceParams")
      .addField("dataSourceList")
      .addField("globalTransactionsProtocol");

    JsonObject query = domainBldr.getBuilder().build();
    return query;
  }

  // Compute all of the initial property values to return in the RDJ
  @Override
  protected void computeInitialPropertyValues() throws Exception {
    // add the Name property
    getInitialPropertyValues().add(
      CREATE_FORM_PROPERTY_NAME,
      ExpandedValue.fromString(null).set(false).getJson()
    );

    // add the JNDINames property
    getInitialPropertyValues().add(
      CREATE_FORM_PROPERTY_JNDI_NAMES,
      ExpandedValue.fromValue(Json.createArrayBuilder().build()).set(false).getJson()
    );

    // add the Targets property
    getInitialPropertyValues().add(
      CREATE_FORM_PROPERTY_TARGETS,
      addOptions(
        ExpandedValue
          .fromReferences(Json.createArrayBuilder().build())
          .set(false)
          .getJson(),
        getTargetsOptions()
      )
    );

    // add the DatasourceType property
    getInitialPropertyValues().add(
      DATASOURCE_TYPE,
      ExpandedValue.fromString(DATASOURCE_TYPE_GENERIC).getJson()
    );

    // add the properties needed to configure each data source type
    addDatasourceTypeSpecificProperties();
  }

  private JsonArray getTargetsOptions() throws Exception {
    JsonArrayBuilder bldr = Json.createArrayBuilder();
    getRDJIdentities(bldr, WEBLOGIC_PROPERTY_SERVERS);
    getRDJIdentities(bldr, WEBLOGIC_PROPERTY_CLUSTERS);
    return bldr.build();
  }

  // Add the properties needed to configure each data source type
  private void addDatasourceTypeSpecificProperties() throws Exception {
    addGenericProperties();
    addGridLinkProperties();
    addUCPProperties();
    addMDSProperties();
  }

  // Add the properties to configure a generic data source
  private void addGenericProperties() throws Exception {
    // add the DatasbaseType property
    getInitialPropertyValues().add(
      CREATE_FORM_PROPERTY_GENERIC_DATABASE_TYPE,
      ExpandedValue.fromString("Oracle").getJson()
    );
    // add the properties for each database type (vendor)
    for (String vendorName : getDBMSVendorNames()) {
      addGenericVendorProperties(vendorName);
    }
  }

  // Add the generic data source properties for a specific database type (vendor)
  private void addGenericVendorProperties(String vendorName) throws Exception {
    // Get the list of drivers this vendor supports
    JDBCDriverInfo[] driverInfos = getDriverInfos(vendorName);

    // Add a property for selecting this vendor's driver
    addSelectDriverProperty(genericDatabaseDriverProperty(vendorName), driverInfos);

    // Add properties for configuring each driver's transactions and connection properties
    for (JDBCDriverInfo driverInfo : driverInfos) {
      addDriverTransactionsProperties(DATASOURCE_TYPE_GENERIC, driverInfo);
      addDriverConnectionProperties(DATASOURCE_TYPE_GENERIC, driverInfo);
    }
  }

  // Add the properties needed to configure a grid link data source
  private void addGridLinkProperties() throws Exception {
    // Get the list of supported grid link drivers
    JDBCDriverInfo[] driverInfos = getGridLinkDriverInfos();

    // Add a property for selecting the driver
    addSelectDriverProperty(CREATE_FORM_PROPERTY_GRIDLINK_DATABASE_DRIVER, driverInfos);

    // Add properties for configuring each driver's transactions and connection properties
    for (JDBCDriverInfo driverInfo : driverInfos) {
      addDriverTransactionsProperties(DATASOURCE_TYPE_GRIDLINK, driverInfo);
      addDriverConnectionProperties(DATASOURCE_TYPE_GRIDLINK, driverInfo);
    }

    // Add a property for configuring the listeners (host/port pairs)
    addGridLinkHostListenersProperty();

    // Add properties for configuring ONS
    addGridLinkONSProperties();
  }

  private void addGridLinkHostListenersProperty() throws Exception {
    getInitialPropertyValues().add(
      CREATE_FORM_PROPERTY_GRIDLINK_LISTENERS,
      ExpandedValue.fromValue(Json.createArrayBuilder().build()).set(false).getJson()
    );
  }

  // Add add properties for configuring ONS
  private void addGridLinkONSProperties() throws Exception {
    getInitialPropertyValues().add(
      CREATE_FORM_PROPERTY_GRIDLINK_FAN_ENABLED,
      ExpandedValue.fromBoolean(false).set(false).getJson()
    );
    getInitialPropertyValues().add(
      CREATE_FORM_PROPERTY_GRIDLINK_ONS_NODE_LIST,
      ExpandedValue.fromString(null).set(false).getJson()
    );
    getInitialPropertyValues().add(
      CREATE_FORM_PROPERTY_GRIDLINK_ONS_WALLET_FILE,
      ExpandedValue.fromString(null).set(false).getJson()
    );
    getInitialPropertyValues().add(
      CREATE_FORM_PROPERTY_GRIDLINK_ONS_WALLET_PASSWORD,
      ExpandedValue.fromString(null).set(false).getJson()
    );
  }

  // Add the properties needed to configure a UCP data source
  private void addUCPProperties() throws Exception {
    // Get the list of supported UCP drivers
    JDBCDriverInfo[] driverInfos = getUCPDriverInfos();

    // Add a property for selecting the driver
    addSelectDriverProperty(CREATE_FORM_PROPERTY_UCP_DATABASE_DRIVER, driverInfos);

    // Add properties for configuring each driver's connection properties
    // Note: don't add properties for configuring transactions since the old console doesn't (don't know why it didn't)
    for (JDBCDriverInfo driverInfo : driverInfos) {
      addDriverConnectionProperties(DATASOURCE_TYPE_UCP, driverInfo);
    }
  }

  // Add the needed to configure an MDS data source
  private void addMDSProperties() throws Exception {
    getInitialPropertyValues().add(
      CREATE_FORM_PROPERTY_MDS_ALGORITHM_TYPE,
      ExpandedValue.fromString(MDS_ALGORITHM_TYPE_FAILOVER).set(false).getJson()
    );
    getInitialPropertyValues().add(
      CREATE_FORM_PROPERTY_MDS_XA_DRIVER,
      ExpandedValue.fromBoolean(true).set(true).getJson()
    );
    getInitialPropertyValues().add(
      CREATE_FORM_PROPERTY_MDS_XA_DATASOURCE_LIST,
      addOptions(
        ExpandedValue
          .fromReferences(Json.createArrayBuilder().build())
          .set(false)
          .getJson(),
        getMDSDataSourceListOptions(true)
      )
    );
    getInitialPropertyValues().add(
      CREATE_FORM_PROPERTY_MDS_NON_XA_DATASOURCE_LIST,
      addOptions(
        ExpandedValue
          .fromReferences(Json.createArrayBuilder().build())
          .set(false)
          .getJson(),
        getMDSDataSourceListOptions(false)
      )
    );
  }

  private JsonArray getMDSDataSourceListOptions(boolean wantXA) throws Exception {
    JsonArrayBuilder weblogicReferencesBldr = Json.createArrayBuilder();

    JsonArray allResources =
      getWeblogicReferences().getJsonObject(WEBLOGIC_PROPERTY_JDBC_SYSTEM_RESOURCES).getJsonArray("items");
    for (int i = 0; i < allResources.size(); i++) {
      JsonObject resource = allResources.getJsonObject(i);
      JsonObject params = resource.getJsonObject("JDBCResource").getJsonObject("JDBCDataSourceParams");
      String datasourceList = ExpandedValue.getStringValue(params.get("dataSourceList"));
      if (datasourceList == null) {
        // Not and MDS data source.
        // See if it's XA or not.
        // Note: the weblogic console determines whether the data source is XA by
        // see if its driver class extends javax.sql.XADataSource.
        // But the remote console doesn't have access to the driver class.
        // But it does have access to the configured globalTransactionsProtocol.
        // Use it to see if the data source is XA instead.
        String protocol = ExpandedValue.getStringValue(params.get("globalTransactionsProtocol"));
        boolean isXA = GLOBAL_TRANSACTIONS_PROTOCOL_TWO_PHASE_COMMIT.equals(protocol);
        if (isXA == wantXA) {
          // Keep it since it matches the xa value we want.
          weblogicReferencesBldr.add(resource);
        }
      } else {
        // This is an MDS data source - don't add it to the list of available datasources
      }
    }

    return
      IdentityUtils.getRDJIdentitiesFromWeblogicIdentities(
        weblogicReferencesBldr.build(),
        getPageSource().getPagePath().getPagesPath().getPerspectivePath(),
        getInvocationContext().getLocalizer()
      );
  }

  private void addSelectDriverProperty(String driverPropertyName, JDBCDriverInfo[] driverInfos) {
    String defaultDriverName = driverName(driverInfos[0]);
    getInitialPropertyValues().add(
      driverPropertyName,
      ExpandedValue.fromString(defaultDriverName).getJson()
    );
  }

  // Add the properties for configuring how a driver should handle transactions
  private void addDriverTransactionsProperties(String datasourceType, JDBCDriverInfo driverInfo) throws Exception {
    boolean xa = driverInfo.isForXA();
    if (xa) {
      // The user can't configure any transaction-related properties for
      // XA drivers since we lock down the global transactions protocol
      // as TwoPhaseCommit.
      return;
    }
    getInitialPropertyValues().add(
      driverScopedName(
        datasourceType,
        driverInfo,
        CREATE_FORM_PROPERTY_NON_XA_DRIVER_GLOBAL_TRANSACTIONS_PROTOTOL
      ),
      ExpandedValue.fromString(GLOBAL_TRANSACTIONS_PROTOCOL_ONE_PHASE_COMMIT).set(false).getJson()
    );
  }

  // Add properties for all of the connection properties this driver supports
  private void addDriverConnectionProperties(String datasourceType, JDBCDriverInfo driverInfo) throws Exception {
    for (JDBCDriverAttribute driverAttribute : getDriverAttributes(driverInfo).values()) {
      getInitialPropertyValues().add(
        driverScopedName(datasourceType, driverInfo, driverAttribute.getName()),
        ExpandedValue.fromString(driverAttribute.getDefaultValue()).getJson()
      );
    }
  }
}
