// Copyright (c) 2020, 2021, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.jdbc.utils;

import java.util.Properties;

import weblogic.jdbc.common.internal.JDBCUtil;



public class DDDB2JDBC4DriverURLHelper extends JDBCURLHelper {

  public String getURL() throws JDBCDriverInfoException {
    JDBCDriverInfo info = getJDBCInfo();
    if (!isValid(info.getDbmsHost())) {
      throw new JDBCDriverInfoException(JDBCUtil.getTextFormatter().dbHostReqd());
    }
    if (!isValid(info.getDbmsPort())) {
      throw new JDBCDriverInfoException(JDBCUtil.getTextFormatter().dbPortReqd());
    }
    String ret = "jdbc:datadirect:db2://" + info.getDbmsHost();
    if (info.getDbmsPort() != null) {
      ret = ret + ":" + info.getDbmsPort();
    }
    return ret;
  }

  public Properties getProperties() throws JDBCDriverInfoException {
    JDBCDriverInfo info = getJDBCInfo();
    if (!isValid(info.getDbmsName())) {
      throw new JDBCDriverInfoException(JDBCUtil.getTextFormatter().dbNameReqd());
    }
    if (!isValid(info.getUserName())) {
      throw new JDBCDriverInfoException(JDBCUtil.getTextFormatter().dbUsernameReqd());
    }
    if (!isValid(info.getPassword())) {
      throw new JDBCDriverInfoException(JDBCUtil.getTextFormatter().dbPasswordReqd());
    }
    Properties props = new Properties();
    props.put("serverName", info.getDbmsHost());
    props.put("portNumber", info.getDbmsPort());
    props.put("user", info.getUserName());
    props.put("databaseName", info.getDbmsName());
    props.put("batchPerformanceWorkaround", "true");

    return props;
  }
}
