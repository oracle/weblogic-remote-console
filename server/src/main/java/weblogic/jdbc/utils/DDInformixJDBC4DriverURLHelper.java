// Copyright (c) 2020, 2021, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.jdbc.utils;

import java.util.Properties;

import weblogic.jdbc.common.internal.JDBCUtil;



public class DDInformixJDBC4DriverURLHelper extends JDBCURLHelper {

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
    //jdbc:datadirect:informix://server4:1526;informixServer=ol_test;databaseName=jdbc
    return "jdbc:datadirect:informix://"
      + info.getDbmsHost() + ":"
      + info.getDbmsPort() + ";informixServer="
      + getOtherAttribute("informixserver", info) + ";databaseName="
      + info.getDbmsName();
  }

  public Properties getProperties() throws JDBCDriverInfoException {
    JDBCDriverInfo info = getJDBCInfo();
    Properties props = new Properties();
    //FIXME:CONSOLE
    //add more than 6 entries into properties will cause console page 
    //ConnectionPoolWizard CreateAndDeploy fail and fall into a loop.
    //props.put("url", getURL());
    props.put("serverName", info.getDbmsHost());
    props.put("portNumber", info.getDbmsPort());
    props.put("user", info.getUserName());
    props.put("databaseName", info.getDbmsName());
    props.put("informixServer", getOtherAttribute("informixserver", info));
    return props;
  }
}
