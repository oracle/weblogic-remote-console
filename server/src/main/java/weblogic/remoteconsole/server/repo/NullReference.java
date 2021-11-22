// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

/**
 * This class holds a null reference, e.g. when a ServerMBean's Machine is null.
 */
public class NullReference extends Value {

  public static final NullReference INSTANCE = new NullReference();

  private NullReference() {
  }

  @Override
  public String toString() {
    return "NullReference<>";
  }
}
