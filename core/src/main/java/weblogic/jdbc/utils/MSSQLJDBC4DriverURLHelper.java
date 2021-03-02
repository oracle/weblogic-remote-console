// Copyright (c) 2020, 2021, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.jdbc.utils;

import java.util.Properties;

import weblogic.jdbc.common.internal.JDBCUtil;



public class MSSQLJDBC4DriverURLHelper extends JDBCURLHelper {

  public String getURL() throws JDBCDriverInfoException {
    JDBCDriverInfo info = getJDBCInfo();
    if (!isValid(info.getDbmsHost())) {
      throw new JDBCDriverInfoException(JDBCUtil.getTextFormatter().dbHostReqd());
    }
    if (!isValid(info.getDbmsPort())) {
      throw new JDBCDriverInfoException(JDBCUtil.getTextFormatter().dbPortReqd());
    }
    return "jdbc:microsoft:sqlserver://" + info.getDbmsHost() + ":"
      + info.getDbmsPort();
  }

  public Properties getProperties() throws JDBCDriverInfoException {
    //serverName=name;
    //url=jdbc:microsoft:sqlserver;
    //dataSourceName=SQL2000JDBC;
    //user=test;
    //databaseName=test;
    //selectMethod=cusrsor;
    //userNamne=test;
    // FortifyIssueSuppression Password Management: Password in Comment
    // Reference does not reveal a secret
    //password=<password>;
    //portNumber=1435

    JDBCDriverInfo info = getJDBCInfo();
    if (!isValid(info.getDbmsHost())) {
      throw new JDBCDriverInfoException(JDBCUtil.getTextFormatter().dbHostReqd());
    }
    if (!isValid(info.getUserName())) {
      throw new JDBCDriverInfoException(JDBCUtil.getTextFormatter().dbUsernameReqd());
    }
    Properties props = new Properties();
    props.put("serverName", info.getDbmsHost());
    props.put("dataSourceName", "SQL2000JDBC");
    props.put("user", info.getUserName());
    props.put("userName", info.getUserName());
    if (isValid(info.getDbmsName())) {
      props.put("databaseName", info.getDbmsName());
    }
    props.put("selectMethod", "cursor");
    props.put("url", getURL());
    return props;
  }
}
