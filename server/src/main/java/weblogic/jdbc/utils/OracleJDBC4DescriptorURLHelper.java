// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.jdbc.utils;

import java.util.Iterator;
import java.util.Properties;

import weblogic.jdbc.common.internal.AddressList;
import weblogic.jdbc.common.internal.JDBCUtil;



public class OracleJDBC4DescriptorURLHelper extends JDBCURLHelper {

  public OracleJDBC4DescriptorURLHelper() {
    super();
  }

  public OracleJDBC4DescriptorURLHelper(JDBCDriverInfo info) {
    super(info);
  }

  public String getURL() throws JDBCDriverInfoException {
    JDBCDriverInfo info = getJDBCInfo();
    AddressList hostPorts = info.getHostPorts();

    if (hostPorts == null || hostPorts.size() == 0) {
      // no host/port list, check if single host/port specified and use that
      if (!isValid(info.getDbmsHost())) {
        throw new JDBCDriverInfoException(JDBCUtil.getTextFormatter().dbHostReqd());
      }
      if (!isValid(info.getDbmsPort())) {
        throw new JDBCDriverInfoException(JDBCUtil.getTextFormatter().dbPortReqd());
      }
      hostPorts = new AddressList();
      hostPorts.add(info.getDbmsHost(), Integer.parseInt(info.getDbmsPort()));

    } else {
      // validate host/port list
      Iterator<AddressList.HostPort> it = hostPorts.iterator();
      while (it.hasNext()) {
        AddressList.HostPort hp = it.next();
        if (!isValid(hp.host)) {
          throw new JDBCDriverInfoException(JDBCUtil.getTextFormatter().dbHostReqd());
        }
        if (hp.port <= 0) {
          throw new JDBCDriverInfoException(JDBCUtil.getTextFormatter().dbPortReqd());
        }
      }
    }
    String protocol = getOtherAttribute("protocol", info);
    if (!isValid(protocol)) {
      protocol = "TCP";
    }
    String drcpConnectionClass = getOtherAttribute(
      "DRCPConnectionClass", info);

    //jdbc:oracle:thin:@(DESCRIPTION=(ADDRESS_LIST=(ADDRESS=(PROTOCOL=TCP)(HOST=center)(PORT=1521)))
    // (CONNECT_DATA=(SERVICE_NAME=ajservice)))
    String serviceName = getOtherAttribute("servicename", info);
    if (!isValid(serviceName)) {
      throw new JDBCDriverInfoException("Service name required");
    }

    StringBuffer buff = new StringBuffer("jdbc:oracle:thin:@(DESCRIPTION=(ADDRESS_LIST=");
    Iterator<AddressList.HostPort> it = hostPorts.iterator();
    boolean first = true;
    while (it.hasNext()) {
      AddressList.HostPort hp = it.next();
      if (first) {
        first = false;
        if (it.hasNext()) {
          buff.append("(LOAD_BALANCE=on)");
        }
      }
      if (hp.protocol != null) {
        buff.append("(ADDRESS=(PROTOCOL=" + hp.protocol + ")(HOST=");
      } else {
        buff.append("(ADDRESS=(PROTOCOL=" + protocol + ")(HOST=");
      }
      buff.append(hp.host);
      buff.append(")(PORT=");
      buff.append(hp.port);
      buff.append("))");
    }
    buff.append(")"); // ADDRESS_LIST
    buff.append("(CONNECT_DATA=");
    buff.append("(SERVICE_NAME=");
    buff.append(serviceName);
    buff.append(")");
    if (isValid(drcpConnectionClass)) {
      buff.append("(SERVER=POOLED)");
    }
    buff.append(")"); // CONNECT_DATA
    buff.append(")"); // DESCRIPTION
    return buff.toString();
  }

  public Properties getProperties() throws JDBCDriverInfoException {
    JDBCDriverInfo info = getJDBCInfo();
    Properties props = new Properties();
    String userName = info.getUserName();
    if (userName != null) {
      props.put("user", userName);
    }
    String drcpConnectionClass = getOtherAttribute(
      "DRCPConnectionClass", info);
    if (isValid(drcpConnectionClass)) {
      props.put("oracle.jdbc.DRCPConnectionClass", drcpConnectionClass);
    }
    return props;
  }
}
