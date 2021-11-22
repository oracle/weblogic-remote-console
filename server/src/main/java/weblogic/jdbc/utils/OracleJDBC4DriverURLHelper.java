// Copyright (c) 2020, 2021, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.jdbc.utils;

import java.util.Properties;

import weblogic.jdbc.common.internal.JDBCUtil;



public abstract class OracleJDBC4DriverURLHelper extends JDBCURLHelper {

  protected abstract String getSeparator();

  protected abstract String getInitial();

  public static class SIDHelper extends OracleJDBC4DriverURLHelper {
    protected String getSeparator() {
      return ":";
    }

    protected String getInitial() {
      return ":@";
    }
  }

  public static class ServiceHelper extends OracleJDBC4DriverURLHelper {
    protected String getSeparator() {
      return "/";
    }

    protected String getInitial() {
      return ":@//";
    }
  }

  public String getURL() throws JDBCDriverInfoException {
    JDBCDriverInfo info = getJDBCInfo();

    if (!isValid(info.getDbmsHost())) {
      throw new JDBCDriverInfoException(JDBCUtil.getTextFormatter().dbHostReqd());
    }
    if (!isValid(info.getDbmsPort())) {
      throw new JDBCDriverInfoException(JDBCUtil.getTextFormatter().dbPortReqd());
    }
    if (!isValid(info.getDbmsName())) {
      throw new JDBCDriverInfoException(JDBCUtil.getTextFormatter().dbNameReqd());
    }
    StringBuffer buff = new StringBuffer("jdbc:oracle:thin");
    buff.append(getInitial());
    buff.append(info.getDbmsHost());
    buff.append(":");
    buff.append(info.getDbmsPort());
    buff.append(getSeparator());
    buff.append(info.getDbmsName());
    String drcpConnectionClass = getOtherAttribute(
      "DRCPConnectionClass", info);
    if (isValid(drcpConnectionClass)) {
      buff.append(":POOLED");
    }
    return buff.toString();
  }

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
