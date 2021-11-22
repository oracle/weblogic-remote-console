// Copyright (c) 2020, 2021, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.jdbc.utils;



public class JDBCURLHelperException extends Exception {

  public JDBCURLHelperException() {
  }

  public JDBCURLHelperException(String msg) {
    super(msg);
  }

  public JDBCURLHelperException(Throwable th) {
    super(th);
  }

  public JDBCURLHelperException(String msg, Throwable th) {
    super(msg, th);
  }

}
