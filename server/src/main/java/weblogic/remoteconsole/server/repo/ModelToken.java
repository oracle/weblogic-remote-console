// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

/**
 * This class holds a WDT model token
 */
public class ModelToken extends Value {

  private String token;

  public ModelToken(String token) {
    this.token = token;
  }

  public String getToken() {
    return this.token;
  }

  @Override
  public String toString() {
    return "ModelToken<" + getToken() + ">";
  }
}
