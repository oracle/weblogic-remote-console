// Copyright (c) 2020, 2021, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.jdbc.utils;

import java.util.Properties;

import weblogic.jdbc.common.internal.JDBCUtil;



public class InformixJDBC4DriverURLHelper extends JDBCURLHelper {

  public String getURL() throws JDBCDriverInfoException {
    JDBCDriverInfo info = getJDBCInfo();

    if (!isValid(info.getDbmsHost())) {
      throw new JDBCDriverInfoException(JDBCUtil.getTextFormatter().dbHostReqd());
    }
    if (!isValid(info.getDbmsPort())) {
      throw new JDBCDriverInfoException(JDBCUtil.getTextFormatter().dbPortReqd());
    }
    if (!isValid(info.getUserName())) {
      throw new JDBCDriverInfoException(JDBCUtil.getTextFormatter().dbUsernameReqd());
    }
    if (!isValid(info.getPassword())) {
      throw new JDBCDriverInfoException(JDBCUtil.getTextFormatter().dbPasswordReqd());
    }
    if (!isValid(info.getDbmsName())) {
      throw new JDBCDriverInfoException(JDBCUtil.getTextFormatter().dbNameReqd());
    }
    if (!isValid(getOtherAttribute("informixserver", info))) {
      throw new JDBCDriverInfoException(JDBCUtil.getTextFormatter().informixSvrNameReqd());
    }
    //jdbc:informix-sqli://hostname:port/dbname:informixServer=servername;
    return "jdbc:informix-sqli://"
      + info.getDbmsHost() + ":"
      + info.getDbmsPort() + "/"
      + info.getDbmsName() + ":informixServer="
      + getOtherAttribute("informixserver", info);
  }

  public Properties getProperties() throws JDBCDriverInfoException {
    JDBCDriverInfo jdbcdriverinfo = getJDBCInfo();
    Properties properties = new Properties();
    properties.put("user", jdbcdriverinfo.getUserName());
    properties.put("url", getURL());
    properties.put("portNumber", jdbcdriverinfo.getDbmsPort());
    properties.put("databaseName", jdbcdriverinfo.getDbmsName());
    properties.put("ifxIFXHOST", jdbcdriverinfo.getDbmsHost());
    properties.put("serverName", getOtherAttribute("informixserver", jdbcdriverinfo));
    return properties;
  }
}
