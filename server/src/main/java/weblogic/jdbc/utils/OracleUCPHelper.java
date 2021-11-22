// Copyright (c) 2020, 2021, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.jdbc.utils;

import java.util.Map;
import java.util.Properties;



public class OracleUCPHelper extends JDBCURLHelper {

  /*
   * Not used.
   */
  public String getURL() throws JDBCDriverInfoException {
    throw new JDBCDriverInfoException("getURL not supported for UCP");
  }

  public Properties getProperties() throws JDBCDriverInfoException {
    Properties props = new Properties();
    JDBCDriverInfo info = getJDBCInfo();

    if (isValid(info.getUserName())) {
      props.put("user", info.getUserName());
    }
    Map<String,JDBCDriverAttribute> otherAttributes = info.getUnknownDriverAttributes();
    if (otherAttributes != null) {
      for (JDBCDriverAttribute att : otherAttributes.values()) {
        if (att.getName() != null && att.getValue() != null) {
          props.put(att.getName(), att.getValue());
        }
      }
    }
    return props;
  }
}
