// Copyright (c) 2020, 2021, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.jdbc.utils;

import java.util.Properties;

import weblogic.jdbc.common.internal.JDBCUtil;



public class PostgreSQLJDBC4DriverURLHelper extends JDBCURLHelper {

  public String getURL() throws JDBCDriverInfoException {
    //jdbc:mysql://[hostname][:port]/dbname
    JDBCDriverInfo info = getJDBCInfo();
    if (!isValid(info.getDbmsHost())) {
      throw new JDBCDriverInfoException(JDBCUtil.getTextFormatter().dbHostReqd());
    }
    if (!isValid(info.getDbmsPort())) {
      throw new JDBCDriverInfoException(JDBCUtil.getTextFormatter().dbPortReqd());
    }
    if (!isValid(info.getDbmsName())) {
      throw new JDBCDriverInfoException(JDBCUtil.getTextFormatter().dbNameReqd());
    }
    return "jdbc:postgresql://" + info.getDbmsHost() + ":" + info.getDbmsPort() + "/" + info.getDbmsName();
  }

  public Properties getProperties() throws JDBCDriverInfoException {
    JDBCDriverInfo info = getJDBCInfo();
    if (!isValid(info.getUserName())) {
      throw new JDBCDriverInfoException(JDBCUtil.getTextFormatter().dbUsernameReqd());
    }
    // FortifyIssueSuppression Password Management: Password in Comment
    // Comment below does not reveal a password
    // Password is not required
    Properties props = new Properties();
    props.put("user", info.getUserName());
    return props;
  }
}
