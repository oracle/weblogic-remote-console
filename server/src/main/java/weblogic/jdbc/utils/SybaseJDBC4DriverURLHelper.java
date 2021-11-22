// Copyright (c) 2020, 2021, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.jdbc.utils;

import java.util.Properties;

import weblogic.jdbc.common.internal.JDBCUtil;



public class SybaseJDBC4DriverURLHelper extends JDBCURLHelper {

  public String getURL() throws JDBCDriverInfoException {
    JDBCDriverInfo info = getJDBCInfo();
    if (!isValid(info.getDbmsHost())) {
      throw new JDBCDriverInfoException(JDBCUtil.getTextFormatter().dbHostReqd());
    }
    if (!isValid(info.getDbmsPort())) {
      throw new JDBCDriverInfoException(JDBCUtil.getTextFormatter().dbPortReqd());
    }
    String dbmsName = info.getDbmsName();
    if (!isValid(dbmsName)) {
      dbmsName = "";
    } else {
      dbmsName = "/" + dbmsName;
    }
    //jdbc:sybase:Tds:myserver:3697/dbmsName
    return "jdbc:sybase:Tds:"
      + info.getDbmsHost() + ":" + info.getDbmsPort() + dbmsName;
  }

  public Properties getProperties() throws JDBCDriverInfoException {
    JDBCDriverInfo info = getJDBCInfo();
    if (!isValid(info.getDbmsHost())) {
      throw new JDBCDriverInfoException(JDBCUtil.getTextFormatter().dbHostReqd());
    }
    if (!isValid(info.getUserName())) {
      throw new JDBCDriverInfoException(JDBCUtil.getTextFormatter().dbUsernameReqd());
    }
    if (!isValid(info.getPassword())) {
      throw new JDBCDriverInfoException(JDBCUtil.getTextFormatter().dbPasswordReqd());
    }
    if (!isValid(info.getDbmsPort())) {
      throw new JDBCDriverInfoException(JDBCUtil.getTextFormatter().dbPortReqd());
    }
    Properties props = new Properties();
    props.put("networkProtocol", "Tds");
    props.put("serverName", info.getDbmsHost());
    //props.put("dataSourceName","jtaXAPool");
    props.put("portNumber", info.getDbmsPort());
    props.put("user", info.getUserName());
    props.put("userName", info.getUserName());
    if (isValid(info.getDbmsName())) {
      props.put("databaseName", info.getDbmsName());
    }
    props.put("url", getURL());
    return props;
  }
}
