// Copyright (c) 2020, 2021, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.jdbc.utils;

import java.util.Properties;

import weblogic.jdbc.common.internal.JDBCUtil;



public class EmbeddedDerbyJDBCDriverURLHelper extends JDBCURLHelper {

  public String getURL() throws JDBCDriverInfoException {
    //jdbc:derby:memory:databasename
    JDBCDriverInfo info = getJDBCInfo();
    if (!isValid(info.getDbmsName())) {
      throw new JDBCDriverInfoException(JDBCUtil.getTextFormatter().dbNameReqd());
    }
    return "jdbc:derby:memory:" + info.getDbmsName();
  }

  public Properties getProperties() throws JDBCDriverInfoException {
    JDBCDriverInfo info = getJDBCInfo();
    Properties props = new Properties();
    if (isValid(info.getUserName())) {
      props.put("user", info.getUserName());
    }
    props.put("databaseName", info.getDbmsName());
    props.put("create", "true");
    return props;
  }
}
