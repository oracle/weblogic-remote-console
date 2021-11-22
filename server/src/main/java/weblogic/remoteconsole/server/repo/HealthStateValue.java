// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

/**
 * This class holds a weblogic.health.HealthState's 'state' string value.
 * The valid states are ok, warn, critical, failed, overloaded and unknown.
 * 
 * Note: these are returned as-is to the CFE.  The CFE currently localizes them.
 */
public class HealthStateValue extends Value {

  private String state;

  public HealthStateValue(String healthState) {
    this.state = healthState;
  }

  public String getValue() {
    return this.state;
  }

  @Override
  public String toString() {
    return "HealthStateValue<" + getValue() + ">";
  }
}
