// Copyright (c) 2020, 2021, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.jdbc.utils;

import java.util.Map;
import java.util.Properties;

public class OracleBIServerURLHelper extends JDBCURLHelper {

  /**
   * <URL>:= <Prefix>: [//<Host>:<Port>/][<Property Name>=<Property Value>;]*
   * <p>
   * where
   *
   * <Prefix>: is the string jdbc:oraclebi
   *
   * <Host>: is the hostname of the analytics server. It can be an IP Address or hostname. The default is localhost.
   *
   * <Port> is he port number that the server is listening on. The default is 9703.
   * [...]
   *
   * <PrimaryCCS> - (For clustered configurations) specifies the primary
   * CCS machine name instead of using the "host" to connect. If this
   * property is specified, the "host" property value is ignored.
   * The jdbc driver will try to connect to the CCS to obtain the
   * load-balanced machine. Default is localhost.
   */

  public String getURL() throws JDBCDriverInfoException {
    String host = null;
    String port = null;
    JDBCDriverInfo info = getJDBCInfo();
    Map<String,JDBCDriverAttribute> otherAttributes = info.getUnknownDriverAttributes();
    if (otherAttributes != null) {
      for (JDBCDriverAttribute att : otherAttributes.values()) {
        if (att.getName() != null && att.getValue() != null) {
          if (att.getName().equals("ServerHost")) {
            host = att.getValue();
          } else if (att.getName().equals("ServerPort")) {
            port = att.getValue();
            try {
              Integer.parseInt(port);
            } catch (NumberFormatException e) {
              throw new JDBCDriverInfoException("serverport");
            }
          }
        }
      }
    }
    String ret = "jdbc:oraclebi:";
    if (host != null) {
      if (port == null) {
        port = "9703";
      }
      ret += "//" + host + ":" + port + "/";
    }
    otherAttributes = info.getUnknownDriverAttributes();
    if (otherAttributes != null) {
      for (JDBCDriverAttribute att : otherAttributes.values()) {
        if (att.getName() != null && att.getValue() != null) {
          if (att.getName().equals("Ssl")) {
            if (!att.getValue().equals("True") && !att.getValue().equals("False")) {
              throw new JDBCDriverInfoException("ssl");
            }
            if (att.getValue().equals("False")) {
              continue;  // default
            }
          } else if (att.getName().equals("TrustAnyServer")) {
            if (!att.getValue().equals("True") && !att.getValue().equals("False")) {
              throw new JDBCDriverInfoException("trustanyserver");
            }
            if (att.getValue().equals("False")) {
              continue;  // default
            }
          }
          if (att.getName().equals("LogLevel")) {
            if (!att.getValue().equals("SEVERE")
              && !att.getValue().equals("WARNING")
              && !att.getValue().equals("INFO")
              && !att.getValue().equals("CONFIG")
              && !att.getValue().equals("FINE")
              && !att.getValue().equals("FINER")
              && !att.getValue().equals("FINEST")) {
              throw new JDBCDriverInfoException("loglevel");
            }
          } else if (att.getName().equals("PrimaryCcsPort")) {
            try {
              Integer.parseInt(att.getValue());
            } catch (NumberFormatException e) {
              throw new JDBCDriverInfoException("primaryccsport");
            }
          } else if (att.getName().equals("SecondaryCcsPort")) {
            try {
              Integer.parseInt(att.getValue());
            } catch (NumberFormatException e) {
              throw new JDBCDriverInfoException("secondaryccsport");
            }
          } else if (att.getName().equals("ServerHost")) {
            // Already included
            continue;
          } else if (att.getName().equals("ServerPort")) {
            // Already included
            continue;
          }
          ret += att.getName() + "=" + att.getValue() + ";";
        }
      }
    }
    return ret;
  }

  public Properties getProperties() throws JDBCDriverInfoException {
    Properties props = new Properties();
    JDBCDriverInfo info = getJDBCInfo();
    if (isValid(info.getUserName())) {
      props.put("user", info.getUserName());
    }
    return props;
  }
}
