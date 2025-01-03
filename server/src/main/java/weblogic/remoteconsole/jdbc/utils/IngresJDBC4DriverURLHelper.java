// Copyright (c) 2020, 2024, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.jdbc.utils;

import java.util.Properties;

import weblogic.remoteconsole.jdbc.common.internal.JDBCUtil;



public class IngresJDBC4DriverURLHelper extends JDBCURLHelper {

  public String getURL() throws JDBCDriverInfoException {
    //jdbc:ingres://${dbhost}:${dbport}/dbname
    JDBCDriverInfo info = getJDBCInfo();
    if (!isValid(info.getDbmsHost())) {
      throw new JDBCDriverInfoException(JDBCUtil.getTextFormatter().dbHostReqd());
    }
    String ret = "jdbc:ingres://" + info.getDbmsHost();
    if (isValid(info.getDbmsPort())) {
      ret = ret + ":" + info.getDbmsPort();
    }
    if (!isValid(info.getDbmsName())) {
      throw new JDBCDriverInfoException(JDBCUtil.getTextFormatter().dbNameReqd());
    }
    return ret + "/" + info.getDbmsName();
  }

  public Properties getProperties() throws JDBCDriverInfoException {
    JDBCDriverInfo info = getJDBCInfo();
    Properties props = new Properties();
    if (isValid(info.getUserName())) {
      props.put("user", info.getUserName());
    }

    // XA Datasource needs the stuff that is in the URL
    if (isValid(info.getDbmsPort())) {
      props.put("portnumber", info.getDbmsPort());
    }
    props.put("servername", info.getDbmsHost());
    props.put("databasename", info.getDbmsName());
    return props;
  }
}
