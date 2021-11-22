// Copyright (c) 2020, 2021, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.jdbc.utils;



public class ParseException extends Exception {

  public ParseException() {
  }

  public ParseException(String msg) {
    super(msg);
  }

  public ParseException(Throwable th) {
    super(th);
  }

  public ParseException(String msg, Throwable th) {
    super(msg, th);
  }

}
