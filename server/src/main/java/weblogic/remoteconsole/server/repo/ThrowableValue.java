// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

/**
 * This class holds a java.lang.Throwable value.
 */
public class ThrowableValue extends Value {

  private Throwable throwable;

  public ThrowableValue(Throwable throwable) {
    this.throwable = throwable;
  }

  public Throwable getValue() {
    return this.throwable;
  }

  @Override
  public String toString() {
    return "ThrowableValue<" + getValue() + ">";
  }
}
