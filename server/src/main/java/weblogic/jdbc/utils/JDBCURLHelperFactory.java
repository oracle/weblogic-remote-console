// Copyright (c) 2020, 2021, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.jdbc.utils;

import java.lang.reflect.InvocationTargetException;


public class JDBCURLHelperFactory {

  //protect our constructur
  private JDBCURLHelperFactory() {
  }

  public static JDBCURLHelperFactory newInstance() {
    return new JDBCURLHelperFactory();
  }

  public JDBCURLHelper getJDBCURLHelper(JDBCDriverInfo driverInfo) throws JDBCURLHelperException {
    if (driverInfo == null) {
      throw new IllegalArgumentException("JDBCDriverInfo can't be null");
    }

    String helperClassName = driverInfo.getURLHelperClassName();
    if (helperClassName == null || helperClassName.length() < 1) {
      throw new JDBCURLHelperException(
        "URLHelperClassName is invalid for " + driverInfo.getDriverVendor() + "'s " + driverInfo.getDbmsVendor()
          + " driver");
    }
    try {
      JDBCURLHelper helper = (JDBCURLHelper) Class.forName(helperClassName).getDeclaredConstructor().newInstance();
      helper.setJDBCDriverInfo(driverInfo);
      return helper;
    } catch (ClassCastException | ClassNotFoundException | InstantiationException | IllegalAccessException
        | NoSuchMethodException | InvocationTargetException cce) {
      throw new JDBCURLHelperException("Exception instantiating JDBCURLHelperClass", cce);
    }
  }

}
