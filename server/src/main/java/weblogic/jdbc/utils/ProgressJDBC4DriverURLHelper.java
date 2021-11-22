// Copyright (c) 2020, 2021, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.jdbc.utils;

import java.util.Properties;

import weblogic.jdbc.common.internal.JDBCUtil;



public class ProgressJDBC4DriverURLHelper extends JDBCURLHelper {
  // See http://www.progress.com/v9/documentation/sql92/jdb/jdb.pdf
  public String getURL() throws JDBCDriverInfoException {
    //jdbc:JdbcProgress:T:hostname:port:databasename
    JDBCDriverInfo info = getJDBCInfo();
    if (!isValid(info.getDbmsPort())) {
      throw new JDBCDriverInfoException(JDBCUtil.getTextFormatter().dbPortReqd());
    }
    if (!isValid(info.getDbmsHost())) {
      throw new JDBCDriverInfoException(JDBCUtil.getTextFormatter().dbHostReqd());
    }
    if (!isValid(info.getDbmsName())) {
      throw new JDBCDriverInfoException(JDBCUtil.getTextFormatter().dbNameReqd());
    }
    return "jdbc:JdbcProgress:T:" + info.getDbmsHost() + ":" + info.getDbmsPort() + ":" + info.getDbmsName();
  }

  public Properties getProperties() throws JDBCDriverInfoException {
    JDBCDriverInfo info = getJDBCInfo();
    Properties props = new Properties();
    if (isValid(info.getUserName())) {
      props.put("user", info.getUserName());
    }
    return props;
  }
}
