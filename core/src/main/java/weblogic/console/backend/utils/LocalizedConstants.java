// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.utils;

import java.util.ArrayList;
import java.util.List;

public class LocalizedConstants {

  public static final String ERROR_MSG_INTEGER_REQUIRED_FOR_PORT =
    "Integer is required for Port";
  public static final String ERROR_MSG_INVALID_HOSTPORT =
    "Invalid Listeners is specified, must be in the format of host:port";
  public static final String MSG_DOMAIN_VER_NOT_SUPPORTED =
    "Unsupported WebLogic domain version";
  public static final String MSG_USER_NOT_ADMIN =
    "Connected user is not a WebLogic Administrator. Content requiring administrator privileges is not displayed.";
  public static final String MSG_DELETE_REFERENCES_FIRST =
    "We recommend that you remove references to an object before you delete it.";

  private static  List<String> allConstants = new ArrayList<>();

  static {
    allConstants.add(ERROR_MSG_INTEGER_REQUIRED_FOR_PORT);
    allConstants.add(ERROR_MSG_INVALID_HOSTPORT);
    allConstants.add(MSG_DOMAIN_VER_NOT_SUPPORTED);
    allConstants.add(MSG_USER_NOT_ADMIN);
    allConstants.add(MSG_DELETE_REFERENCES_FIRST);
  }

  public static List<String> getAllConstants() {
    return allConstants;
  }

}
