// Copyright (c) 2020, 2021, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.jdbc.utils;

import java.util.Properties;



public class TimesTenClientJDBC4DriverURLHelper extends JDBCURLHelper {

  public String getURL() throws JDBCDriverInfoException {
    //jdbc:timesten:client:dsn
    JDBCDriverInfo info = getJDBCInfo();

    String dsn = null;
    String ttcServer = null;
    String tcpPort = null;
    String ttcServerDsn = null;

    if (isValid(getOtherAttribute("dsn", info))) {
      dsn = getOtherAttribute("dsn", info);
    }
    if (isValid(getOtherAttribute("ttc_server", info))) {
      ttcServer = getOtherAttribute("ttc_server", info);
    }
    if (isValid(getOtherAttribute("tcp_port", info))) {
      tcpPort = getOtherAttribute("tcp_port", info);
    }
    if (isValid(getOtherAttribute("ttc_server_dsn", info))) {
      ttcServerDsn = getOtherAttribute("ttc_server_dsn", info);
    }

    if (ttcServer != null || tcpPort != null || ttcServerDsn != null) {
      if (ttcServer == null) {
        throw new JDBCDriverInfoException("ttc_server");
      }
      if (tcpPort == null) {
        throw new JDBCDriverInfoException("tcp_port");
      }
      if (ttcServerDsn == null) {
        throw new JDBCDriverInfoException("ttc_server_dsn");
      }
      if (dsn != null) {
        throw new JDBCDriverInfoException("dsn");
      }
      return "jdbc:timesten:client:TTC_SERVER=" + ttcServer
        + ";TCP_PORT=" + tcpPort
        + ";TTC_SERVER_DSN=" + ttcServerDsn;
    } else {
      if (dsn == null) {
        throw new JDBCDriverInfoException("dsn");
      }
      return "jdbc:timesten:client:" + dsn;
    }
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
