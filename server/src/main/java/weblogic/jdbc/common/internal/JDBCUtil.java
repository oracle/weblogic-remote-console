// Copyright (c) 2020, 2021, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.jdbc.common.internal;

public class JDBCUtil {
  private static final JDBCUtil oneOfMe = new JDBCUtil();

  public static JDBCUtil getTextFormatter() {
    return oneOfMe;
  }

  public String neonDSNameReqd() {
    return "NeonDSName Required";
  }

  public String dbUsernameReqd() {
    return "dbUserName Required";
  }

  public String dbPasswordReqd() {
    return "dbPassword Required";
  }

  public String dbHostReqd() {
    return "dbHostRequired";
  }

  public String dbPortReqd() {
    return "dbPort Required";
  }

  public String dbNameReqd() {
    return "dbName Required";
  }

  public String oracleUserIdReqd() {
    return "OracleUserId Required";
  }

  public String informixSvrNameReqd() {
    return "InformixServerName Required";
  }
}
