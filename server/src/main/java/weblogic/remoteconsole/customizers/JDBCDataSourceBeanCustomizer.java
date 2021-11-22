// Copyright (c) 2020, 2021, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.List;
import java.util.Map;

import weblogic.remoteconsole.common.utils.StringUtils;
import weblogic.remoteconsole.server.repo.Response;
import weblogic.remoteconsole.server.repo.SettableValue;
import weblogic.remoteconsole.server.repo.StringValue;

/**
 * Custom code for processing the JDBCDataSourceBean
 */
public class JDBCDataSourceBeanCustomizer {

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
    String type = datasourceType.getValue().asString().getValue();
    SettableValue.State state = datasourceType.getState();
    if (type == null) {
      type = getTypeFromDriverProperties(driverProperties);
    }
    if (type == null) {
      type =
        inferTypeFromOracleParams(
          activeGridlink.getValue().asBoolean().getValue(),
          fanEnabled.getValue().asBoolean().getValue()
        );
    }
    if (type == null) {
      type = inferTypeFromDataSourceList(dataSourceList.getValue().asString().getValue());
    }
    if (type == null) {
      type = "GENERIC";
    }
    SettableValue result = new SettableValue(new StringValue(type), state);
    return new Response<SettableValue>().setSuccess(result);
  }

  private static String getTypeFromDriverProperties(List<Map<String,SettableValue>> driverProperties) {
    for (Map<String,SettableValue> driverProperty : driverProperties) {
      String name = driverProperty.get("Name").getValue().asString().getValue();
      if ("weblogic.jdbc.type".equals(name)) {
        String type = driverProperty.get("Value").getValue().asString().getValue();
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
