// Copyright (c) 2020, 2021, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.jdbc.utils;

import java.util.Properties;

import weblogic.jdbc.common.internal.JDBCUtil;

public class OrientDBJDBC4DriverURLHelper extends JDBCURLHelper {
  public String getURL() throws JDBCDriverInfoException {
    JDBCDriverInfo info = getJDBCInfo();
    if (!(isValid(info.getDbmsHost()))) {
      throw new JDBCDriverInfoException(JDBCUtil.getTextFormatter()
        .dbHostReqd());
    }

    if (!(isValid(info.getDbmsName()))) {
      throw new JDBCDriverInfoException(JDBCUtil.getTextFormatter()
        .dbNameReqd());
    }
    return "jdbc:orient:remote:" + info.getDbmsHost() + "/" + info.getDbmsName();
  }

  public Properties getProperties() throws JDBCDriverInfoException {
    Properties props = new Properties();

    JDBCDriverInfo info = getJDBCInfo();

    if ((isValid(info.getUserName()))) {
      props.put("user", info.getUserName());
    }
    return props;
  }
} 
