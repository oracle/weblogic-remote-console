// Copyright (c) 2024, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.jdbc.utils;

import java.util.Map;
import java.util.Properties;

import weblogic.remoteconsole.jdbc.common.internal.JDBCUtil;
/**
 * @exclude
 */

public class OracleJDBC4TNSAliasExtensionURLHelper extends JDBCURLHelper {

  public String getURL() throws JDBCDriverInfoException {
    JDBCDriverInfo info = getJDBCInfo();

    if (!isValid(info.getDbmsName())) {
      throw new JDBCDriverInfoException(JDBCUtil.getTextFormatter().dbNameReqd());
    }
    
    StringBuffer buff = new StringBuffer("jdbc:oracle:thin:@");
    buff.append(info.getDbmsName());
    return buff.toString();
  }

  public Properties getProperties() throws JDBCDriverInfoException {
    JDBCDriverInfo info = getJDBCInfo();
    Properties props = new Properties();
    String userName = info.getUserName();
    if (userName != null) {
      props.put("user", userName);
    }
    Map<String,JDBCDriverAttribute> otherAttributes = info.getUnknownDriverAttributes();

    if (otherAttributes != null) {
      for (JDBCDriverAttribute att : otherAttributes.values()) {
        if (att.getName() != null && att.getValue() != null && !att.getName().equals("AliasName")) {
          props.put(att.getName(), att.getValue());
        }
      }
    }
    return props;
  }
}
