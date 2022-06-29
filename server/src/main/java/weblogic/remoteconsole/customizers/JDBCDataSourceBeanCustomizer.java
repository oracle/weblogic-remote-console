// Copyright (c) 2020, 2022, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.List;
import java.util.Map;
import java.util.Set;

import weblogic.remoteconsole.common.utils.StringUtils;
import weblogic.remoteconsole.server.repo.Response;
import weblogic.remoteconsole.server.repo.SettableValue;
import weblogic.remoteconsole.server.repo.StringValue;
import weblogic.remoteconsole.server.repo.Value;

/**
 * Custom code for processing the JDBCDataSourceBean
 */
public class JDBCDataSourceBeanCustomizer {

  private static final Set<String> SUPPORTED_TYPES = Set.of("GENERIC", "UCP", "AGL", "MDS", "PROXY");

  private JDBCDataSourceBeanCustomizer() {
  }

  public static Response<SettableValue> getDatasourceType(
    @Source(
      property = "DatasourceType"
    ) SettableValue datasourceType,
    @Source(
      collection = "JDBCDriverParams/Properties/Properties",
      properties = { "Name", "Value" }
    ) List<Map<String,SettableValue>> driverProperties,
    @Source(
      property = "JDBCOracleParams.ActiveGridlink"
    ) SettableValue activeGridlink,
    @Source(
      property = "JDBCOracleParams.FanEnabled"
    ) SettableValue fanEnabled,
    @Source(
      property = "JDBCDataSourceParams.DataSourceList"
    ) SettableValue dataSourceList
  ) {
    SettableValue.State state = datasourceType.getState();
    String type = null;
    if (datasourceType.getValue().isString()) {
      type = datasourceType.getValue().asString().getValue();
      if (type != null && !SUPPORTED_TYPES.contains(type)) {
        type = null;
      }
    }
    if (type == null) {
      type = getTypeFromDriverProperties(driverProperties);
    }
    if (type == null) {
      type =
        inferTypeFromOracleParams(
          activeGridlink.getValue(),
          fanEnabled.getValue()
        );
    }
    if (type == null) {
      type = inferTypeFromDataSourceList(dataSourceList.getValue());
    }
    if (type == null) {
      type = "GENERIC";
    }
    SettableValue result = new SettableValue(new StringValue(type), state);
    return new Response<SettableValue>().setSuccess(result);
  }

  private static String getTypeFromDriverProperties(List<Map<String,SettableValue>> driverProperties) {
    for (Map<String,SettableValue> driverProperty : driverProperties) {
      Value name = driverProperty.get("Name").getValue();
      Value value = driverProperty.get("Value").getValue();
      if (name.isString() && value.isString()) {
        if ("weblogic.jdbc.type".equals(name.asString().getValue())) {
          String type = value.asString().getValue();
          if (StringUtils.notEmpty(type) && SUPPORTED_TYPES.contains(type)) {
            return type;
          }
        }
      }
    }
    return null;
  }

  private static String inferTypeFromOracleParams(Value agl, Value fanEnabled) {
    if (agl.isBoolean() && agl.asBoolean().getValue()) {
      return "AGL";
    }
    // Fan enabled is only meaningful for active grid link data sources.
    // So, if the user set fan enabled to a model token, we can assume
    // that it's an active grid link data source.
    if (fanEnabled.isModelToken() || (fanEnabled.isBoolean() && fanEnabled.asBoolean().getValue())) {
      return "AGL";
    }
    return null;
  }

  private static String inferTypeFromDataSourceList(Value dsList) {
    if (dsList.isModelToken() || (dsList.isString() && StringUtils.notEmpty(dsList.asString().getValue()))) {
      // If the user put any data source names in data source list, then this is a multi-data source.
      // Similarly, if the user set it to a model token, then it's a pretty safe bet that when the token
      // is resolved, it will have at least on data source name, so we can assume this is a multi-data source.
      return "MDS";
    }
    return null;
  }
}
