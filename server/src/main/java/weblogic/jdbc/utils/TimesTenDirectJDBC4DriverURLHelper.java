// Copyright (c) 2020, 2021, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.jdbc.utils;

import java.util.Properties;



public class TimesTenDirectJDBC4DriverURLHelper extends JDBCURLHelper {

  public String getURL() throws JDBCDriverInfoException {
    //jdbc:timesten:direct:dsn
    JDBCDriverInfo info = getJDBCInfo();

    if (!isValid(getOtherAttribute("dsn", info))) {
      throw new JDBCDriverInfoException("dsn");
    }

    return "jdbc:timesten:direct:" + getOtherAttribute("dsn", info);
  }

  public Properties getProperties() throws JDBCDriverInfoException {
    JDBCDriverInfo info = getJDBCInfo();
    Properties props = new Properties();
    if (isValid(info.getUserName())) {
      props.put("user", info.getUserName());
    }
    return props;
  }
}
