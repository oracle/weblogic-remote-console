// Copyright (c) 2020, 2021, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.jdbc.utils;

import java.util.Properties;

import weblogic.jdbc.common.internal.JDBCUtil;



public class DerbyJDBCDriverURLHelper extends JDBCURLHelper {

  public String getURL() throws JDBCDriverInfoException {
    //jdbc:derby://${dbhost}[:${dbport}]/dbname
    JDBCDriverInfo info = getJDBCInfo();
    if (!isValid(info.getDbmsHost())) {
      throw new JDBCDriverInfoException(JDBCUtil.getTextFormatter().dbHostReqd());
    }
    String ret = "jdbc:derby://" + info.getDbmsHost();
    if (isValid(info.getDbmsPort())) {
      ret = ret + ":" + info.getDbmsPort();
    }
    if (!isValid(info.getDbmsName())) {
      throw new JDBCDriverInfoException(JDBCUtil.getTextFormatter().dbNameReqd());
    }
    ret = ret + "/" + info.getDbmsName();
    // For the datasource, need two more parameters
    // Add create=true for console test
    return ret + ";ServerName=" + info.getDbmsHost() + ";databaseName="
      + info.getDbmsName() + ";create=true";
  }

  public Properties getProperties() throws JDBCDriverInfoException {
    JDBCDriverInfo info = getJDBCInfo();
    Properties props = new Properties();
    if (isValid(info.getUserName())) {
      props.put("user", info.getUserName());
    }
    // These are needed for the XA datasource, but don't hurt the driver
    if (isValid(info.getDbmsPort())) {
      props.put("portNumber", info.getDbmsPort());
    }
    // Add create=true for JSR 250 where application provided URL without it
    props.put("databaseName", info.getDbmsName() + ";create=true");
    props.put("serverName", info.getDbmsHost());
    return props;
  }
}
