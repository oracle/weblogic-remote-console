// Copyright (c) 2020, 2021, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.jdbc.utils;

import java.util.Properties;

import weblogic.jdbc.common.internal.JDBCUtil;


public class InetMSSQLJDBC4DriverURLHelper extends JDBCURLHelper {

  public String getURL() throws JDBCDriverInfoException {
    // See http://www.inetsoftware.de/English/Produkte/OPTA/manual.pdf
    // jdbc:inetdae7:hostname:port
    JDBCDriverInfo info = getJDBCInfo();
    if (!isValid(info.getDbmsHost())) {
      throw new JDBCDriverInfoException(JDBCUtil.getTextFormatter().dbHostReqd());
    }
    String ret = "jdbc:inetdae7:" + info.getDbmsHost();
    if (info.getDbmsPort() != null) {
      ret = ret + ":" + info.getDbmsPort();
    }
    return ret;
  }

  public Properties getProperties() throws JDBCDriverInfoException {
    // FortifyIssueSuppression Password Management: Password in Comment
    // Comment does not really reveal a password
    //user=sa;password=xxx

    JDBCDriverInfo info = getJDBCInfo();
    if (!isValid(info.getUserName())) {
      throw new JDBCDriverInfoException(JDBCUtil.getTextFormatter().dbUsernameReqd());
    }
    Properties props = new Properties();
    props.put("user", info.getUserName());
    if (isValid(info.getDbmsName())) {
      props.put("db", info.getDbmsName());
    }
    return props;
  }
}
