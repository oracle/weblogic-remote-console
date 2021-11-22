// Copyright (c) 2020, 2021, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.jdbc.utils;



public class JDBCDriverInfoException extends Exception {
  public JDBCDriverInfoException() {
  }

  public JDBCDriverInfoException(String msg) {
    super(msg);
  }

  public JDBCDriverInfoException(Throwable th) {
    super(th);
  }

  public JDBCDriverInfoException(String msg, Throwable th) {
    super(msg, th);
  }
}
