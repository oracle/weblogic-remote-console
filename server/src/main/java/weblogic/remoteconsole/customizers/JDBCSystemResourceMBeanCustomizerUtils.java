// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.Map;

import weblogic.jdbc.utils.JDBCDriverAttribute;
import weblogic.jdbc.utils.JDBCDriverInfo;
import weblogic.jdbc.utils.JDBCDriverInfoFactory;
import weblogic.remoteconsole.common.utils.JDBCDriversUtils;

/**
 * Custom code for processing the JDBCSystemResourceMBean that is shared between its customizers.
 */
public class JDBCSystemResourceMBeanCustomizerUtils {
  // Datasource Types constants
  public static final String DATASOURCE_TYPE_GENERIC = "GENERIC";
  public static final String DATASOURCE_TYPE_GRIDLINK = "AGL";
  public static final String DATASOURCE_TYPE_UCP = "UCP";
  public static final String DATASOURCE_TYPE_MDS = "MDS";

  // form property constants
  private static final String PROPERTY_DATABASE_DRIVER = "DatabaseDriver";
  public static final String PROPERTY_DATASOURCE_TYPE = "JDBCResource.DatasourceType";
  public static final String PROPERTY_DBMS_NAME = JDBCDriverInfo.DB_SERVERNAME;
  public static final String PROPERTY_DBMS_HOST = JDBCDriverInfo.DB_HOST;
  public static final String PROPERTY_DBMS_PORT = JDBCDriverInfo.DB_PORT;
  public static final String PROPERTY_DBMS_USER_NAME = JDBCDriverInfo.DB_USER;
  // FortifyIssueSuppression Password Management: Password in Comment
  // FortifyIssueSuppression Password Management: Hardcoded Password
  // This is not a security leak
  public static final String PROPERTY_DBMS_PASSWORD = JDBCDriverInfo.DB_PASS;
  public static final String PROPERTY_GENERIC_DATABASE_TYPE = genericScopedName("DatabaseType");
  public static final String PROPERTY_GLOBAL_TRANSACTIONS_PROTOTOL =
    "JDBCResource.JDBCDataSourceParams.GlobalTransactionsProtocol";
  public static final String PROPERTY_URL = "JDBCResource.JDBCDriverParams.Url";
  public static final String PROPERTY_TEST_CONFIGURATION = "TestConfiguration";

  // UCP-specific constants
  public static final String PROPERTY_UCP_DATABASE_DRIVER = ucpScopedName(PROPERTY_DATABASE_DRIVER);

  // Gridlink-specific constants
  public static final String PROPERTY_GRIDLINK_DATABASE_DRIVER =
    gridLinkScopedName(PROPERTY_DATABASE_DRIVER);
  public static final String PROPERTY_GRIDLINK_LISTENERS =
    "Listeners";
  public static final String PROPERTY_GRIDLINK_FAN_ENABLED =
    "JDBCResource.JDBCOracleParams.FanEnabled";
  public static final String PROPERTY_GRIDLINK_ONS_NODE_LIST =
    "JDBCResource.JDBCOracleParams.OnsNodeList";
  public static final String PROPERTY_GRIDLINK_ONS_WALLET_FILE =
    "JDBCResource.JDBCOracleParams.OnsWalletFile";
  // FortifyIssueSuppression(B410878776EACDA7209414FF3FB2B9BE) Password Management: Password in Comment
  // FortifyIssueSuppression(B410878776EACDA7209414FF3FB2B9BE) Password Management: Hardcoded Password
  // Just a variable name
  public static final String PROPERTY_GRIDLINK_ONS_WALLET_PASSWORD =
    "JDBCResource.JDBCOracleParams.OnsWalletPassword";

  // By default, don't test the connection before creating the data source.
  public static boolean DEFAULT_TEST_CONFIGURATION = false;

  // Info about the available JDBC drivers
  private static JDBCDriverInfoFactory DRIVER_INFO_FACTORY = JDBCDriversUtils.getJDBCDriverInfoFactory();

  private JDBCSystemResourceMBeanCustomizerUtils() {
  }

  public static JDBCDriverInfoFactory getDriverInfoFactory() {
    return DRIVER_INFO_FACTORY;
  }

  // Return all the available generic database vendor names
  public static String[] getDBMSVendorNames() {
    return getDriverInfoFactory().getDBMSVendorNames();
  }

  // Return all the attributes of a driver (Map from attribute name to driver attribute)
  public static Map<String, JDBCDriverAttribute> getDriverAttributes(JDBCDriverInfo driverInfo) {
    @SuppressWarnings("unchecked")
    Map<String, JDBCDriverAttribute> driverAttributes =
      ((Map<String, JDBCDriverAttribute>)(driverInfo.getDriverAttributes()));
    return driverAttributes;
  }

  // Return a driver's name.
  public static String driverName(JDBCDriverInfo driverInfo) {
    return driverInfo.toString();
  }

  // Name of the property that selects the driver for a generic data source's vendor
  public static String genericDatabaseDriverProperty(String vendorName) {
    return vendorScopedName(DATASOURCE_TYPE_GENERIC, vendorName, PROPERTY_DATABASE_DRIVER);
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
  private static String vendorScopedDriverName(String datasourceType, JDBCDriverInfo driverInfo) {
    // Note: the driver name includes the vendor name:
    return datasourceTypeScopedName(datasourceType, driverName(driverInfo));
  }

  // Return a vendor scoped name.
  // It includes the datasource type and database type (vendor).
  private static String vendorScopedName(String datasourceType, String vendorName, String name) {
    return datasourceTypeScopedName(datasourceType, scopedName(vendorName, name));
  }

  // Return a generic data source scoped name
  private static String genericScopedName(String name) {
    return datasourceTypeScopedName(DATASOURCE_TYPE_GENERIC, name);
  }

  // Return a grid link data source scoped name
  private static String gridLinkScopedName(String name) {
    return datasourceTypeScopedName(DATASOURCE_TYPE_GRIDLINK, name);
  }

  // Return a UCP data source scoped name
  private static String ucpScopedName(String name) {
    return datasourceTypeScopedName(DATASOURCE_TYPE_UCP, name);
  }

  /* Will need this later when we improve DataSourceList handling:
  // Return an MDS data source scoped name
  private static String mdsScopedName(String name) {
    return datasourceTypeScopedName(DATASOURCE_TYPE_MDS, name);
  }
  */

  // Return a name scoped to a datasource type
  private static String datasourceTypeScopedName(String datasourceType, String name) {
    return scopedName(datasourceType, name);
  }

  // The CFE only allows letters, digits and underscores in form property names.
  // The driver names can contain some other characters.
  // This method converts from the driver name a user should see on the page
  // to the underlying form property name.
  public static String driverNameToFormPropertyName(String driverName) {
    String formName = driverName;
    formName = formName.replaceAll("\\(", "_LPAREN_");
    formName = formName.replaceAll("\\)", "_RPAREN_");
    formName = formName.replaceAll("'", "_APOS_");
    formName = formName.replaceAll("\\*", "_STAR_");
    formName = formName.replaceAll(" ", "_SPACE_");
    formName = formName.replaceAll("\\.", "_DOT_");
    formName = formName.replaceAll(";", "_SEMI_");
    formName = formName.replaceAll(":", "_COLON_");
    formName = formName.replaceAll("/", "_SLASH_");
    formName = formName.replaceAll("-", "_DASH_");
    return formName;
  }

  // This method converts from the name of a form property for a driver
  // to the driver name a user sees on the page.
  // This is also the name that's used to lookup info about the driver.
  public static String formPropertyNameToDriverName(String formName) {
    String driverName = formName;
    driverName = driverName.replaceAll("_LPAREN_", "(");
    driverName = driverName.replaceAll("_RPAREN_", ")");
    driverName = driverName.replaceAll("_APOS_", "'");
    driverName = driverName.replaceAll("_STAR_", "*");
    driverName = driverName.replaceAll("_SPACE_", " ");
    driverName = driverName.replaceAll("_DOT_", ".");
    driverName = driverName.replaceAll("_SEMI_", ";");
    driverName = driverName.replaceAll("_COLON_", ":");
    driverName = driverName.replaceAll("_SLASH_", "/");
    driverName = driverName.replaceAll("_DASH_", "-");
    return driverName;
  }

  private static String scopedName(String scope, String name) {
    return scope + "_" + name;
  }
}
