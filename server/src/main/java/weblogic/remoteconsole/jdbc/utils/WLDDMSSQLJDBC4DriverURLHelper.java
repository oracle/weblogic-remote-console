// Copyright (c) 2020, 2024, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.jdbc.utils;

import java.util.Properties;

import weblogic.remoteconsole.jdbc.common.internal.JDBCUtil;



public class WLDDMSSQLJDBC4DriverURLHelper extends JDBCURLHelper {

  public String getURL() throws JDBCDriverInfoException {
    JDBCDriverInfo info = getJDBCInfo();
    if (!isValid(info.getDbmsHost())) {
      throw new JDBCDriverInfoException(JDBCUtil.getTextFormatter().dbHostReqd());
    }
    String ret = "jdbc:weblogic:sqlserver://" + info.getDbmsHost();
    if (isValid(info.getDbmsPort())) {
      ret = ret + ":" + info.getDbmsPort() + ";allowPortWithNamedInstance=true";
    }
    return ret;
  }

  public Properties getProperties() throws JDBCDriverInfoException {
    JDBCDriverInfo info = getJDBCInfo();
    if (!isValid(info.getUserName())) {
      throw new JDBCDriverInfoException(JDBCUtil.getTextFormatter().dbUsernameReqd());
    }
    Properties props = new Properties();
    props.put("serverName", info.getDbmsHost());
    if (isValid(info.getDbmsPort())) {
      props.put("portNumber", info.getDbmsPort());
    }
    props.put("user", info.getUserName());
    if (isValid(info.getDbmsName())) {
      props.put("databaseName", info.getDbmsName());
    }

    return props;
  }
}
