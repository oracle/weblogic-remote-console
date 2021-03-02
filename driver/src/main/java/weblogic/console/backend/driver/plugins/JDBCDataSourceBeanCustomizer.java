// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver.plugins;

import java.util.logging.Logger;
import javax.json.JsonArray;
import javax.json.JsonObject;

import weblogic.console.backend.driver.CollectionValue;
import weblogic.console.backend.driver.ExpandedValue;
import weblogic.console.backend.utils.StringUtils;

/** Custom code for processing the JDBCDataSourceBean */
public abstract class JDBCDataSourceBeanCustomizer {

  private static final Logger LOGGER = Logger.getLogger(JDBCDataSourceBeanCustomizer.class.getName());

  private static final String JDBC_ORACLE_PARAMS = "JDBCOracleParams";

  public static JsonObject getDatasourceType(
    /*

    Temporarily leave in these other plugin argument examples until
    more tests and documentation are written:

    // Pass in the bean's identity (i.e. WLS REST path)
    weblogic.console.backend.typedesc.WeblogicBeanIdentity identity,

    // Pass in the object that lets the plugin talk to the WLS configuration
    // e.g. to issue complex search queries that @Source can't handle.
    // Note: this should rarely if ever be done since it ends up
    // making extra RPCs from the CBE to WLS.  If we run into a case that
    // needs it, we might want to expand what @Source supports instead.
    weblogic.console.backend.driver.WeblogicConfiguration weblogicConfiguration,

    // Fetch all the required properties relative to this bean's parent
    // (i.e. the JDBCSystemResourceMBean) and pass them in a tree of json objects
    // (instead of using separate args for each property).
    @Source(
      bean = "..",
      properties = {
        "JDBCResource.datasourceType",
        "JDBCResource.JDBCOracleParams.activeGridlink",
        "JDBCResource.JDBCOracleParams.fanEnabled",
        "JDBCResource.JDBCDataSourceParams.dataSourceList"
      }
    ) JsonObject JDBCSystemResource,

    // Fetch all the required properties relative to this bean
    // (i.e. the JDBCResourceMBean) and pass them as a tree of json objects.
    // (instead of using separate args for each property).
    @Source(
      properties = {
        "datasourceType",
        "JDBCOracleParams.activeGridlink",
        "JDBCOracleParams.fanEnabled",
        "JDBCDataSourceParams.dataSourceList"
      }
    ) JsonObject JDBCResource,

    // Pass in required the properties from this bean's
    // JDBCOracleParams child bean as a json object
    // (instead of using separate args for each property).
    @Source(
      bean = "JDBCOracleParams",
      properties = {
        "activeGridlink",
        "fanEnabled"
      }
    ) JsonObject oracleParams,
    */
    @Source(
      property = "datasourceType"
    ) JsonObject datasourceType,
    @Source(
      collection = "JDBCDriverParams/properties/properties",
      properties = {"name", "value"}
    ) JsonObject driverProperties,
    @Source(
      bean = JDBC_ORACLE_PARAMS,
      property = "activeGridlink"
    ) JsonObject activeGridlink,
    @Source(
      bean = JDBC_ORACLE_PARAMS,
      property = "fanEnabled"
    ) JsonObject fanEnabled,
    @Source(
      bean = "JDBCDataSourceParams",
      property = "dataSourceList"
    ) JsonObject dataSourceList
  ) {
    String type = ExpandedValue.getStringValue(datasourceType);
    boolean set = (type != null);
    if (type == null) {
      type = getTypeFromDriverProperties(CollectionValue.getItems(driverProperties));
    }
    if (type == null) {
      type =
        inferTypeFromOracleParams(
          ExpandedValue.getBooleanValue(activeGridlink),
          ExpandedValue.getBooleanValue(fanEnabled)
        );
    }
    if (type == null) {
      type = inferTypeFromDataSourceList(ExpandedValue.getStringValue(dataSourceList));
    }
    if (type == null) {
      type = "GENERIC";
    }
    return ExpandedValue.fromString(type).set(set).getJson();
  }

  private static String getTypeFromDriverProperties(JsonArray driverProperties) {
    for (int i = 0; i < driverProperties.size(); i++) {
      JsonObject property = driverProperties.getJsonObject(i);
      String name = ExpandedValue.getStringValue(property.getJsonObject("name"));
      if ("weblogic.jdbc.type".equals(name)) {
        String type = ExpandedValue.getStringValue(property.getJsonObject("value"));
        if (StringUtils.notEmpty(type)) {
          return type;
        }
      }
    }
    return null;
  }

  private static String inferTypeFromOracleParams(boolean activeGridlink, boolean fanEnabled) {
    return (activeGridlink || fanEnabled) ? "AGL" : null;
  }

  private static String inferTypeFromDataSourceList(String dataSourceList) {
    return (StringUtils.notEmpty(dataSourceList)) ? "MDS" : null;
  }
}
