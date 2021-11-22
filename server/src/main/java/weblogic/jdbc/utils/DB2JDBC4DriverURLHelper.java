// Copyright (c) 2020, 2021, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.jdbc.utils;

import java.util.Properties;

import weblogic.jdbc.common.internal.JDBCUtil;



public class DB2JDBC4DriverURLHelper extends JDBCURLHelper {

  public String getURL() throws JDBCDriverInfoException {
    //URL:  jdbc:db2://server:port/database

    JDBCDriverInfo info = getJDBCInfo();

    if (!isValid(info.getDbmsName())) {
      throw new JDBCDriverInfoException(JDBCUtil.getTextFormatter().dbNameReqd());
    }
    if (!isValid(info.getDbmsHost())) {
      throw new JDBCDriverInfoException(JDBCUtil.getTextFormatter().dbHostReqd());
    }
    if (!isValid(info.getDbmsPort())) {
      throw new JDBCDriverInfoException(JDBCUtil.getTextFormatter().dbPortReqd());
    }
    String ret = "jdbc:db2://" + info.getDbmsHost();
    if (info.getDbmsPort() != null) {
      ret = ret + ":" + info.getDbmsPort();
    }
    if (info.getDbmsName() != null) {
      ret = ret + "/" + info.getDbmsName();
    }
    return ret;
  }

  public Properties getProperties() throws JDBCDriverInfoException {

    // FortifyIssueSuppression Password Management: Password in Comment
    // Comment does not really reveal a password
    //Properties: user=db2admin;password=<password>;DatabaseName=database
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
    props.put("user", info.getUserName());
    props.put("databaseName", info.getDbmsName());
    props.put("driverType", "4");
    return props;
  }
}
