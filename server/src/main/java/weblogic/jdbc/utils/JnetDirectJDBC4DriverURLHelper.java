// Copyright (c) 2020, 2021, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.jdbc.utils;

import java.util.Properties;

import weblogic.jdbc.common.internal.JDBCUtil;



public class JnetDirectJDBC4DriverURLHelper extends JDBCURLHelper {
  // See http://www.j-netdirect.com/GenOptionalAPI.htm
  public String getURL() throws JDBCDriverInfoException {
    //jdbc:JSQLConnect://hostname:port
    JDBCDriverInfo info = getJDBCInfo();
    if (!isValid(info.getDbmsPort())) {
      throw new JDBCDriverInfoException(JDBCUtil.getTextFormatter().dbPortReqd());
    }
    if (!isValid(info.getDbmsHost())) {
      throw new JDBCDriverInfoException(JDBCUtil.getTextFormatter().dbHostReqd());
    }
    return "jdbc:JSQLConnect://" + info.getDbmsHost() + ":" + info.getDbmsPort();
  }

  public Properties getProperties() throws JDBCDriverInfoException {
    JDBCDriverInfo info = getJDBCInfo();
    Properties props = new Properties();
    if (isValid(info.getUserName())) {
      props.put("user", info.getUserName());
    }
    if (isValid(info.getDbmsName())) {
      props.put("databaseName", info.getDbmsName());
    }
    // Other properties - database, serverName
    return props;
  }
}
