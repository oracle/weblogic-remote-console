// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

/**
 * This class holds a secret value.
 */
public class SecretValue extends Value {
  private String value;

  public SecretValue(String value) {
    this.value = value;
  }

  public String getValue() {
    return this.value;
  }

  @Override
  public String toString() {
    // Note: never display them in cleartext since it would be a security vulnerability.
    return "SecretValue<" + getValue() + ">";
  }
}
