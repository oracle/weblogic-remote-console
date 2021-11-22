// Copyright (c) 2020, 2021, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.jdbc.utils;

import java.util.Properties;

import weblogic.jdbc.common.internal.JDBCUtil;



public class OracleRACJDBC4DriverURLHelper extends JDBCURLHelper {

  public String getURL() throws JDBCDriverInfoException {
    JDBCDriverInfo info = getJDBCInfo();

    if (!isValid(info.getDbmsHost())) {
      throw new JDBCDriverInfoException(JDBCUtil.getTextFormatter().dbHostReqd());
    }
    if (!isValid(info.getDbmsPort())) {
      throw new JDBCDriverInfoException(JDBCUtil.getTextFormatter().dbPortReqd());
    }
    String serviceName = getOtherAttribute("servicename", info);

    String protocol = getOtherAttribute("protocol", info);
    if (!isValid(protocol)) {
      protocol = "TCP";
    }
    String drcpConnectionClass = getOtherAttribute(
      "DRCPConnectionClass", info);

    StringBuffer buff =
      new StringBuffer("jdbc:oracle:thin:@(DESCRIPTION=(ADDRESS_LIST=(ADDRESS=(PROTOCOL=" + protocol + ")(HOST=");
    buff.append(info.getDbmsHost());
    buff.append(")(PORT=");
    buff.append(info.getDbmsPort());
    buff.append(")))");
    if (isValid(serviceName) || isValid(info.getDbmsName())) {
      buff.append("(CONNECT_DATA=");
    }
    if (isValid(serviceName)) {
      buff.append("(SERVICE_NAME=");
      buff.append(serviceName);
      buff.append(")");
    }
    if (isValid(drcpConnectionClass)) {
      buff.append("(SERVER=POOLED)");
    }
    if (isValid(info.getDbmsName())) {
      buff.append("(INSTANCE_NAME=");
      buff.append(info.getDbmsName());
      buff.append(")");
    }
    if (isValid(serviceName) || isValid(info.getDbmsName())) {
      buff.append(")"); // CONNECT_DATA
    }
    buff.append(")"); // DESCRIPTION
    return buff.toString();
  }

  // jdbc:oracle:thin:@(DESCRIPTION=(ADDRESS_LIST=(ADDRESS=(PROTOCOL=TCP)(HOST=host-vip)(PORT=1521)))
  // (CONNECT_DATA=(SERVICE_NAME=service)(INSTANCE_NAME=sid)))
  public Properties getProperties() throws JDBCDriverInfoException {
    JDBCDriverInfo info = getJDBCInfo();
    if (info.getDbmsName() == null) {
      throw new JDBCDriverInfoException(JDBCUtil.getTextFormatter().oracleUserIdReqd());
    }
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
