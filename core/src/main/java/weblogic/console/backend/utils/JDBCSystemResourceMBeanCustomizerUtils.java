// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.utils;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import weblogic.console.backend.utils.JDBCDriversUtils;
import weblogic.jdbc.utils.JDBCDriverAttribute;
import weblogic.jdbc.utils.JDBCDriverInfo;
import weblogic.jdbc.utils.JDBCDriverInfoFactory;
import weblogic.jdbc.utils.JDBCURLHelper;
import weblogic.jdbc.utils.JDBCURLHelperFactory;

/**
 * Custom code for processing the JDBCSystemResourceMBean that is shared
 * between the build time and runtime customizers.
 */
public class JDBCSystemResourceMBeanCustomizerUtils {

  // Datasource Type constants
  public static final String DATASOURCE_TYPE = "DatasourceType";
  public static final String DATASOURCE_TYPE_GENERIC = "GENERIC";
  public static final String DATASOURCE_TYPE_GRIDLINK = "AGL";
  public static final String DATASOURCE_TYPE_UCP = "UCP";
  public static final String DATASOURCE_TYPE_MDS = "MDS";

  // PDJ section constants
  public static final String CREATE_FORM_SECTION_XA_TRANSACTIONS = "XA_Transactions";
  public static final String CREATE_FORM_SECTION_NON_XA_TRANSACTIONS = "NON_XA_Transactions";
  public static final String CREATE_FORM_SECTION_CONNECTION_PROPERTIES = "ConnectionProperties";
  public static final String CREATE_FORM_SECTION_GRIDLINK_ONS = gridLinkScopedName("ONS");

  // PDJ non-mbean properties constants
  public static final String CREATE_FORM_PROPERTY_NAME = "Name";
  public static final String CREATE_FORM_PROPERTY_JNDI_NAMES = "JNDINames";
  public static final String CREATE_FORM_PROPERTY_TARGETS = "Targets";
  public static final String CREATE_FORM_PROPERTY_DBMS_NAME = JDBCDriverInfo.DB_SERVERNAME;
  public static final String CREATE_FORM_PROPERTY_DBMS_HOST = JDBCDriverInfo.DB_HOST;
  public static final String CREATE_FORM_PROPERTY_DBMS_PORT = JDBCDriverInfo.DB_PORT;
  public static final String CREATE_FORM_PROPERTY_DBMS_USER_NAME = JDBCDriverInfo.DB_USER;
  // FortifyIssueSuppression Password Management: Password in Comment
  // FortifyIssueSuppression Password Management: Hardcoded Password
  // This is not a security leak
  public static final String CREATE_FORM_PROPERTY_DBMS_PASSWORD = JDBCDriverInfo.DB_PASS;
  public static final String CREATE_FORM_PROPERTY_SERVICE_NAME = "ServiceName";
  public static final String CREATE_FORM_PROPERTY_GENERIC_DATABASE_TYPE = genericScopedName("DatabaseType");
  public static final String CREATE_FORM_PROPERTY_DATABASE_DRIVER = "DatabaseDriver";
  public static final String CREATE_FORM_PROPERTY_NON_XA_DRIVER_GLOBAL_TRANSACTIONS_PROTOTOL =
    "NonXADriverGlobalTransactionsProtocol";

  // UCP-specific constants
  public static final String CREATE_FORM_PROPERTY_UCP_DATABASE_DRIVER =
    ucpScopedName(CREATE_FORM_PROPERTY_DATABASE_DRIVER);

  // Gridlink-specific constants
  public static final String CREATE_FORM_PROPERTY_GRIDLINK_DATABASE_DRIVER =
    gridLinkScopedName(CREATE_FORM_PROPERTY_DATABASE_DRIVER);
  public static final String CREATE_FORM_PROPERTY_GRIDLINK_LISTENERS =
    gridLinkScopedName("Listeners");
  public static final String CREATE_FORM_PROPERTY_GRIDLINK_FAN_ENABLED =
    gridLinkScopedName("FanEnabled");
  public static final String CREATE_FORM_PROPERTY_GRIDLINK_ONS_NODE_LIST =
    gridLinkScopedName("OnsNodeList");
  public static final String CREATE_FORM_PROPERTY_GRIDLINK_ONS_WALLET_FILE =
    gridLinkScopedName("OnsWalletFile");
  public static final String CREATE_FORM_PROPERTY_GRIDLINK_ONS_WALLET_PASSWORD =
    gridLinkScopedName("OnsWalletPassword");

  // MDS-specific constants
  public static final String CREATE_FORM_PROPERTY_MDS_ALGORITHM_TYPE = mdsScopedName("AlgorithmType");
  public static final String MDS_ALGORITHM_TYPE_LOAD_BALANCING = "Load-Balancing";
  public static final String MDS_ALGORITHM_TYPE_FAILOVER = "Failover";
  public static final String CREATE_FORM_PROPERTY_MDS_XA_DRIVER = mdsScopedName("XADriver");
  public static final String CREATE_FORM_PROPERTY_MDS_XA_DATASOURCE_LIST = mdsScopedName("XADataSourceList");
  public static final String CREATE_FORM_PROPERTY_MDS_NON_XA_DATASOURCE_LIST = mdsScopedName("NonXADataSourceList");

  // Well known driver attributes that we have special PDJ handling for:
  public static final Set<String> WELL_KNOWN_DRIVER_ATTRIBUTES = new HashSet<>();

  static {
    // in the order we want them on the page:
    WELL_KNOWN_DRIVER_ATTRIBUTES.add(CREATE_FORM_PROPERTY_DBMS_NAME);
    WELL_KNOWN_DRIVER_ATTRIBUTES.add(CREATE_FORM_PROPERTY_DBMS_HOST);
    WELL_KNOWN_DRIVER_ATTRIBUTES.add(CREATE_FORM_PROPERTY_DBMS_PORT);
    WELL_KNOWN_DRIVER_ATTRIBUTES.add(CREATE_FORM_PROPERTY_DBMS_USER_NAME);
    WELL_KNOWN_DRIVER_ATTRIBUTES.add(CREATE_FORM_PROPERTY_DBMS_PASSWORD);
    WELL_KNOWN_DRIVER_ATTRIBUTES.add(CREATE_FORM_PROPERTY_SERVICE_NAME);
  }

  public static final String GLOBAL_TRANSACTIONS_PROTOCOL_TWO_PHASE_COMMIT = "TwoPhaseCommit";
  public static final String GLOBAL_TRANSACTIONS_PROTOCOL_EMULATE_TWO_PHASE_COMMIT = "EmulateTwoPhaseCommit";
  public static final String GLOBAL_TRANSACTIONS_PROTOCOL_LOGGING_LAST_RESOURCE = "LoggingLastResource";
  public static final String GLOBAL_TRANSACTIONS_PROTOCOL_ONE_PHASE_COMMIT = "OnePhaseCommit";
  public static final String GLOBAL_TRANSACTIONS_PROTOCOL_NONE = "None";
  
  // Info about the available JDBC drivers
  private static JDBCDriverInfoFactory DRIVER_INFO_FACTORY = JDBCDriversUtils.getJDBCDriverInfoFactory();

  private static JDBCDriverInfoFactory getDriverInfoFactory() {
    return DRIVER_INFO_FACTORY;
  }

  // Return all the available generic database vendor names
  public static String[] getDBMSVendorNames() {
    return getDriverInfoFactory().getDBMSVendorNames();
  }

  // Return all the available database drivers for a generic database vendor
  public static JDBCDriverInfo[] getDriverInfos(String vendorName) throws Exception {
    return getDriverInfoFactory().getDriverInfos(vendorName);
  }

  // Return all the available grid link database drivers
  public static JDBCDriverInfo[] getGridLinkDriverInfos() throws Exception {
    return getDriverInfoFactory().getGridLinkDriverInfos();
  }

  // Return all the available UCP database drivers
  public static JDBCDriverInfo[] getUCPDriverInfos() throws Exception {
    return getDriverInfoFactory().getUCPDriverInfos();
  }

  // Find create an unpopulated database driver
  public static JDBCDriverInfo createDriverInfo(String driverName) throws Exception {
    return getDriverInfoFactory().getDriverInfo(driverName);
  }

  // Create a helper that converts a populated database driver to its corresponding mbean properties
  public static JDBCURLHelper createJDBCURLHelper(JDBCDriverInfo driverInfo) throws Exception {
    return JDBCURLHelperFactory.newInstance().getJDBCURLHelper(driverInfo);
  }

  // Return all the attributes of a driver (Map from attribute name to driver attribute)
  public static Map<String, JDBCDriverAttribute> getDriverAttributes(JDBCDriverInfo driverInfo) {
    @SuppressWarnings("unchecked")
    Map<String, JDBCDriverAttribute> driverAttributes =
      ((Map<String, JDBCDriverAttribute>)(driverInfo.getDriverAttributes()));
    return driverAttributes;
  }

  // Returns whether a driver attribute is a custom attribute (v.s. a well known attribute)
  public static boolean isCustomDriverAttribute(JDBCDriverAttribute driverAttribute) {
    return !WELL_KNOWN_DRIVER_ATTRIBUTES.contains(driverAttribute.getName());
  }

  // Return a driver's name.
  public static String driverName(JDBCDriverInfo driverInfo) {
    return driverInfo.toString();
  }

  // Name of the property that selects the driver for a generic data source's vendor
  public static String genericDatabaseDriverProperty(String vendorName) {
    return vendorScopedName(DATASOURCE_TYPE_GENERIC, vendorName, CREATE_FORM_PROPERTY_DATABASE_DRIVER);
  }

  // Return a driver scoped name
  // It includes the datasource type, database type (vendor) and database driver name.
  public static String driverScopedName(
    String datasourceType,
    JDBCDriverInfo driverInfo,
    String name
  ) {
    return scopedName(vendorScopedDriverName(datasourceType, driverInfo), name);
  }

  // Return a vendor scoped driver name.
  // It includes the datasource type, database type (vendor) and database driver name.
  public static String vendorScopedDriverName(String datasourceType, JDBCDriverInfo driverInfo) {
    // Note: the driver name includes the vendor name:
    return datasourceTypeScopedName(datasourceType, driverName(driverInfo));
  }

  // Return a vendor scoped name.
  // It includes the datasource type and database type (vendor).
  public static String vendorScopedName(String datasourceType, String vendorName, String name) {
    return datasourceTypeScopedName(datasourceType, scopedName(vendorName, name));
  }

  // Return a generic data source scoped name
  public static String genericScopedName(String name) {
    return datasourceTypeScopedName(DATASOURCE_TYPE_GENERIC, name);
  }

  // Return a grid link data source scoped name
  public static String gridLinkScopedName(String name) {
    return datasourceTypeScopedName(DATASOURCE_TYPE_GRIDLINK, name);
  }

  // Return a UCP data source scoped name
  public static String ucpScopedName(String name) {
    return datasourceTypeScopedName(DATASOURCE_TYPE_UCP, name);
  }

  // Return an MDS data source scoped name
  public static String mdsScopedName(String name) {
    return datasourceTypeScopedName(DATASOURCE_TYPE_MDS, name);
  }

  // Return a name scoped to a datasource type
  public static String datasourceTypeScopedName(String datasourceType, String name) {
    return scopedName(datasourceType, name);
  }

  private static String scopedName(String scope, String name) {
    return scope + "_" + name;
  }
}
