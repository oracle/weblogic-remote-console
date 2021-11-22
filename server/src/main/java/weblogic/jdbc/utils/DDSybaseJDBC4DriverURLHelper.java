// Copyright (c) 2020, 2021, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.jdbc.utils;

import java.util.Properties;

import weblogic.jdbc.common.internal.JDBCUtil;



public class DDSybaseJDBC4DriverURLHelper extends JDBCURLHelper {

  public String getURL() throws JDBCDriverInfoException {
    JDBCDriverInfo info = getJDBCInfo();
    if (!isValid(info.getDbmsHost())) {
      throw new JDBCDriverInfoException(JDBCUtil.getTextFormatter().dbHostReqd());
    }
    if (!isValid(info.getDbmsPort())) {
      throw new JDBCDriverInfoException(JDBCUtil.getTextFormatter().dbPortReqd());
    }
    // FortifyIssueSuppression Password Management: Password in Comment
    // Comment does not really reveal a password
    //jdbc:datadirect:sybase://server2:5000;User=test;Password=secret
    String ret = "jdbc:datadirect:sybase://" + info.getDbmsHost();
    if (info.getDbmsPort() != null) {
      ret = ret + ":" + info.getDbmsPort();
    }
    return ret;
  }

  public Properties getProperties() throws JDBCDriverInfoException {
    JDBCDriverInfo info = getJDBCInfo();
    if (!isValid(info.getUserName())) {
      throw new JDBCDriverInfoException(JDBCUtil.getTextFormatter().dbUsernameReqd());
    }
    if (!isValid(info.getPassword())) {
      throw new JDBCDriverInfoException(JDBCUtil.getTextFormatter().dbPasswordReqd());
    }
    Properties props = new Properties();
    props.put("url", getURL());
    props.put("serverName", info.getDbmsHost());
    props.put("portNumber", info.getDbmsPort());
    props.put("user", info.getUserName());
    if (isValid(info.getDbmsName())) {
      props.put("databaseName", info.getDbmsName());
    }

    return props;
  }
}
